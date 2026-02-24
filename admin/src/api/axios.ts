import axios from 'axios';

const api = axios.create({
  baseURL: '',
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('cafe_admin');
  if (stored) {
    try {
      const admin = JSON.parse(stored);
      if (admin?.token) {
        config.headers.Authorization = `Bearer ${admin.token}`;
      }
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

export default api;
