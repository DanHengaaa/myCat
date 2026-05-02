import api from './index';

export const getCatLeaderboard = (limit = 10) => api.get('/leaderboard/cats', { params: { limit } });
export const getUserLeaderboard = (type = 'all', limit = 10) =>
  api.get('/leaderboard/users', { params: { type, limit } });