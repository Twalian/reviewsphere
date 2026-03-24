import { apiRequest } from "./client";

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.brand) params.append("brand", filters.brand);
  if (filters.status) params.append("status", filters.status);

  const queryString = params.toString();
  const url = queryString ? `/products/?${queryString}` : "/products/";

  return await apiRequest(url, {
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

export async function compareProducts(productIds) {
  return await apiRequest("/products/compare/", {
    method: "POST",
    body: JSON.stringify({ product_ids: productIds }),
  });
}
