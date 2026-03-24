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

export async function getAiSummaryByProduct(productId) {
  return apiRequest(`/reviews/${productId}/ai-summary/`);
}

export async function getMyReviews() {
  return await apiRequest("/reviews/mine/");
}

export async function updateReview(reviewId, data) {
  return await apiRequest(`/reviews/${reviewId}/update/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteReview(reviewId) {
  return await apiRequest(`/reviews/${reviewId}/delete/`, {
    method: "DELETE",
  });
}

export async function toggleHelpful(reviewId) {
  return await apiRequest(`/reviews/${reviewId}/toggle-helpful/`, {
    method: "POST",
  });
}

export async function reportReview(reviewId, reason) {
  return await apiRequest(`/reviews/${reviewId}/report/`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function getReviewReports() {
  return await apiRequest("/reviews/reports/");
}

export async function resolveReviewReport(reportId, action) {
  return await apiRequest(`/reviews/reports/${reportId}/resolve/`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  });
}