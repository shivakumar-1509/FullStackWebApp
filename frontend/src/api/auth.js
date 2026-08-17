import axiosInstance from './axiosInstance';

export const loginUser = (username, password) =>
  axiosInstance.post('/user/login', { username, password });

export const registerUser = (userData) =>
  axiosInstance.post('/user/register', userData);

export const getProfile = () =>
  axiosInstance.get('/user/profile');
