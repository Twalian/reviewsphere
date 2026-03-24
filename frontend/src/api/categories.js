import { apiRequest } from "./client";

export async function getCategories() {
  return await apiRequest("/categories/", {
    skipAuth: true,
  });
}

export async function createCategory(categoryData) {
  return await apiRequest("/categories/", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
}

export async function updateCategory(id, data) {
  return await apiRequest(`/categories/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id) {
  return await apiRequest(`/categories/${id}/`, {
    method: "DELETE",
  });
}