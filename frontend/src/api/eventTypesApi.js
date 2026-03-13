import api from './axiosInstance';

export async function getEventTypes() {
  return api.get('/event-types');
}

export async function getEventType(slug) {
  return api.get(`/event-types/${slug}`);
}

export async function createEventType(data) {
  return api.post('/event-types', data);
}

export async function updateEventType(id, data) {
  return api.put(`/event-types/${id}`, data);
}

export async function deleteEventType(id) {
  return api.delete(`/event-types/${id}`);
}

export async function bulkUpdateEventTypesAvailability(data) {
  return api.patch('/event-types/bulk-update-availability', data);
}

