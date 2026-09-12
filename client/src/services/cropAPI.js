import api from './api';

export const cropAPI = {
  getCrops: (params) => api.get('/crops', { params }),
  addCrop: (data) => api.post('/crops', data),
  getCropById: (id) => api.get(`/crops/${id}`),
  updateCrop: (id, data) => api.put(`/crops/${id}`, data),
  deleteCrop: (id) => api.delete(`/crops/${id}`),
  updateGrowthStage: (id, data) => api.post(`/crops/${id}/stage`, data),
  logWatering: (id, data) => api.post(`/crops/${id}/water`, data),
  getWateringHistory: (id) => api.get(`/crops/${id}/watering`),
};
