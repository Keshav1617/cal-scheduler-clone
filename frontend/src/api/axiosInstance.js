import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || '';
const baseURL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error?.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;