from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Permette accesso solo agli admin.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsModerator(BasePermission):
    """
    Permette accesso solo ai moderatori.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "MODERATOR"
        )


class IsClient(BasePermission):
    """
    Permette accesso solo ai clienti.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "CLIENT"
        )


class IsModeratorOrAdmin(BasePermission):
    """
    Permette accesso a moderatori e admin.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["MODERATOR", "ADMIN"]
        )