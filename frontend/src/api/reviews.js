import { apiRequest } from "./client";

export async function addReview(reviewData) {
  return apiRequest("/reviews/add/", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

export async function getReviewsByProduct(productId) {
  return apiRequest(`/reviews/product/${productId}/`, {
    skipAuth: true,
  });
}