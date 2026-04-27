import axiosClient from './axiosClient';

const createOrder = async (orderData) => {
  const res = await axiosClient.post('/orders', orderData);
  return res.data;
};

const getOrdersByUser = async (userId) => {
  const res = await axiosClient.get(`/orders/user/${userId}`);
  return res.data;
};

const getOrderDetail = async (orderId) => {
  const res = await axiosClient.get(`/orders/${orderId}`);
  return res.data;
};

export { createOrder, getOrdersByUser, getOrderDetail, getOrderDetail as getDetailOrder };