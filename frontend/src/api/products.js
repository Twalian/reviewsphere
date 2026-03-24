import { apiRequest } from "./client";

export async function getProducts() {
  return await apiRequest("/products/", {
    skipAuth: true,
  });
}

export async function createProduct(productData) {
  return await apiRequest("/products/", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(id) {
  return await apiRequest(`/products/${id}/`, {
    method: "DELETE",
  });
}

export async function updateProduct(id, data) {
  return await apiRequest(`/products/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
