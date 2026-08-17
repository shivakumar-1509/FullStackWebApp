import axiosInstance from './axiosInstance';

export const getAllProducts = () =>
  axiosInstance.get('/home');

export const getMyProducts = () =>
  axiosInstance.get('/user/products');

export const addProduct = (formData) =>
  axiosInstance.post('/addProduct', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, formData) =>
  axiosInstance.put(`/product/${id}/update`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) =>
  axiosInstance.delete(`/product/${id}/delete`);
