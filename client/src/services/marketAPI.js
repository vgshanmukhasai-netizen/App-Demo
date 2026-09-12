import api from './api';

export const marketAPI = {
  getAllMarketData: () => api.get('/market'),
  getMarketDataByCrop: (cropName) => api.get(`/market/${cropName}`),
};
