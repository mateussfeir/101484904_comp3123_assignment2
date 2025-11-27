import apiClient from './client';

export const loginUser = async (payload) => {
  const { data } = await apiClient.post('/user/login', payload);
  return data;
};

export const signupUser = async (payload) => {
  const { data } = await apiClient.post('/user/signup', payload);
  return data;
};
