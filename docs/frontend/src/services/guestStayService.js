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