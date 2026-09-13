import {apiRequest} from './apiClient';

export async function getGuestStays(){
    return apiRequest('/guest-stays');
}

export async function createGuestStay(guestStayData) {
  return apiRequest("/guest-stays", {
    method: "POST",
    body: guestStayData,
  });
}

export async function updateGuestStay(guestStayId, guestStayData) {
  return apiRequest(`/guest-stays/${guestStayId}`, {
    method: "PUT",
    body: guestStayData,
  });
}

export async function deleteGuestStay(guestStayId) {
  return apiRequest(`/guest-stays/${guestStayId}`, {
    method: "DELETE",
  });
}