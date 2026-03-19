import { apiRequest } from "./client";

export async function login(username, password) {
  return apiRequest("/token/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function register(userData) {
  return apiRequest("/users/register/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function getCurrentUser() {
  return apiRequest("/users/me/");
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}