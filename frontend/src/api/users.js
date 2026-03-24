import { apiRequest } from "./client";

export async function getAdminUsers() {
  return await apiRequest("/users/admin/");
}

export async function updateUserRole(id, role) {
  return await apiRequest(`/users/admin/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}
