import { apiRequest } from "./apiClient";

export async function getRooms() {
  const rooms = await apiRequest("/rooms");

  if (!Array.isArray(rooms)) {
    return [];
  }

  return rooms;
}