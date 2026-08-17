import axiosInstance from './axiosInstance';

export const getNotifications = (sellerId) =>
  axiosInstance.get(`/notifications/${sellerId}`);

export const getUnreadCount = (sellerId) =>
  axiosInstance.get(`/notifications/unread/${sellerId}`);

export const markRead = (id) =>
  axiosInstance.put(`/notifications/read/${id}`);

export const markAllRead = (sellerId) =>
  axiosInstance.put(`/notifications/read-all/${sellerId}`);
