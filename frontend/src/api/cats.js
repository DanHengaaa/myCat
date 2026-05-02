import api from './index';

export const getCats = (params) => api.get('/cats', { params });
export const getCatDetail = (id) => api.get(`/cats/${id}`);
export const createCat = (data) => api.post('/cats', data);
export const updateCat = (id, data) => api.put(`/cats/${id}`, data);
export const deleteCat = (id) => api.delete(`/cats/${id}`);
export const addCatLocation = (catId, locationId) => api.post(`/cats/${catId}/locations`, { location_id: locationId });