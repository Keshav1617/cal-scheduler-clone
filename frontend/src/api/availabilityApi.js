import api from './axiosInstance';

export async function getSchedule() {
  return api.get('/availability/schedule');
}

export async function getSchedules() {
  return api.get('/availability/schedules');
}

export async function getScheduleDetail(id) {
  return api.get(`/availability/schedules/${id}`);
}

export async function createSchedule(data) {
  return api.post('/availability/schedules', data);
}

export async function updateScheduleInfo(id, data) {
  return api.patch(`/availability/schedules/${id}`, data);
}

export async function updateSchedule(scheduleId, data) {
  return api.put(`/availability/schedule/${scheduleId}`, data);
}

export async function deleteSchedule(id) {
  return api.delete(`/availability/schedules/${id}`);
}

