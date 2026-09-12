import api from './api';

export const farmerAPI = {
  getProfile: () => api.get('/farmers/me'),
  updateProfile: (data) => api.put('/farmers/me', data),
  deleteAccount: () => api.delete('/farmers/me'),
};
