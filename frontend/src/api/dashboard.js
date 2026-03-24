import { apiRequest } from "./client";

export async function getDashboardStats() {
  return await apiRequest("/dashboard-stats/");
}