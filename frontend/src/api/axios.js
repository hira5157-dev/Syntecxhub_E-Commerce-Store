import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
});

// attach the JWT token to every request (if the user is logged in)
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch {
    /* ignore */
  }
  return config;
});

export default api;
