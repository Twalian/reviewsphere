from rest_framework import serializers
from reviews.models import Review, Report
from users.serializers import UserSerializer


class ReviewListSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    helpful_count = serializers.IntegerField(source="helpful_votes.count", read_only=True)

    user_marked_helpful = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "title",
            "vote",
            "username",
            "product_name",
            "description",
            "date",
            "status",
            "sentiment",
            "pros",
            "cons",
            "helpful_count",
            "user_marked_helpful",
        ]

    def get_user_marked_helpful(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from reviews.models import ReviewHelpfulVote
            return ReviewHelpfulVote.objects.filter(review=obj, user=request.user).exists()
        return False


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "title",
            "vote",
            "description",
            "product"
        ]
    def validate_vote(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Il voto deve essere tra 1 e 5.")
        return value

class ReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "title",
            "vote",
            "description",
        ]
    def validate_vote(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Il voto deve essere tra 1 e 5.")
        return value


# Report
class ReportSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    reported_by = serializers.CharField(source='reporter.username', read_only=True)
    product_name = serializers.CharField(source='review.product.name', read_only=True)
    review_author = serializers.CharField(source='review.user.username', read_only=True)
    review_description = serializers.CharField(source='review.description', read_only=True)
    action = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = [
            'id', 'review', 'reason', 'status', 'created_at', 
            'resolved_at', 'resolved_by', 'reporter',
            'reported_by', 'product_name', 'review_author', 'review_description',
            'action'
        ]
        read_only_fields = ['review', 'status', 'created_at', 'resolved_at', 'resolved_by', 'reporter', 'action']
    
    def get_action(self, obj):
        """Get the action taken on this report: 'hide' if review was hidden, 'keep' if kept."""
        if obj.status == 'RESOLVED' and obj.review.status == 'HIDDEN':
            return 'hide'
        return 'keep'