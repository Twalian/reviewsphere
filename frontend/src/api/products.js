import { apiRequest } from "./client";

export async function getProducts() {
  return await apiRequest("/products/");
}