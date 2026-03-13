import api from './axiosInstance';

export async function getPublicEventType(slug) {
  return api.get(`/public/event-types/${slug}`);
}

export async function getAvailableSlots(slug, date, timezone) {
  return api.get(`/public/event-types/${slug}/slots`, { params: { date, timezone } });
}

export async function createBooking(data) {
  return api.post('/public/book', data);
}

export async function getConfirmation(uid) {
  return api.get(`/public/confirmation/${uid}`);
}

export async function getPublicProfile(username) {
  return api.get(`/public/users/${username}`);
}

export async function getPublicEventTypes(userId) {
  return api.get(`/public/users/${userId}/event-types`);
}

