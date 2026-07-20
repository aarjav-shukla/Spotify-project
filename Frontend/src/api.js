import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const authAPI = {
  register: (data) => api.post('/api/auth/registeruser', data),
  login: (data) => api.post('/api/auth/loginuser', data),
};

export const musicAPI = {
  upload: (data) => api.post('/api/music/upload', data),
  getMine: () => api.get('/api/music/mine'),
  getAll: () => api.get('/api/music/getmusic'),
  getAlbums: () => api.get('/api/music/getalbums'),
  update: (id, data) => api.put(`/api/music/${id}`, data),
  delete: (id) => api.delete(`/api/music/${id}`),
};

export default api;
