import axiosInstance from './axiosInstance';

export const placeOrder = (orderRequest, orderItemRequest) =>
  axiosInstance.post('/placeOrder', { ...orderRequest, ...orderItemRequest });

export const getAllOrders = () =>
  axiosInstance.get('/Orders');
