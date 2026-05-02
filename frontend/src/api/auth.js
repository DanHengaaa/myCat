import api from './index';

export const login = (data) => api.post('/users/login', data);
export const register = (data) => api.post('/users/register', data);
export const getProfile = () => api.get('/users/me');