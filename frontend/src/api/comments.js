import api from './index';

export const getComments = (target_type, target_id, params) =>
  api.get('/comments', { params: { target_type, target_id, ...params } });
export const postComment = (data) => api.post('/comments', data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);