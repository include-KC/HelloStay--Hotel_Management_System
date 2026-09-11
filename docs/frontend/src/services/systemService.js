import { apiClient } from "./apiClient";

export function getBackendHealth() {
  return apiClient.get("/");
}

export function getSystemInfo() {
  return apiClient.get("/system-info");
}