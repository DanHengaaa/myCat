import api from './index';

export const createCheckin = (data) => api.post('/checkins', data);
export const getCheckins = (params) => api.get('/checkins', { params });
export const getTodayCheckins = () => api.get('/checkins/today');
export const reviewCheckin = (id, status) => api.put(`/checkins/${id}/review`, { status });
export const getTrajectory = (catId) => api.get(`/checkins/trajectory/${catId}`);
export const deleteCheckin = (id) => api.delete(`/checkins/${id}`);