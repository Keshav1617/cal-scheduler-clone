import api from './axiosInstance';

export async function getBookings(params) {
  return api.get('/bookings', { params });
}

export async function getBooking(uid) {
  return api.get(`/bookings/${uid}`);
}

export async function cancelBooking(uid) {
  return api.post(`/bookings/${uid}/cancel`);
}

