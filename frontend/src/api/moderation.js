import { apiRequest } from "./client";

export async function getReviewsForModeration() {
  return apiRequest("/reviews/moderation/");
}

export async function approveReview(reviewId) {
  return apiRequest(`/reviews/${reviewId}/approve/`, {
    method: "PATCH",
  });
}

export async function hideReview(reviewId) {
  return apiRequest(`/reviews/${reviewId}/hide/`, {
    method: "PATCH",
  });
}