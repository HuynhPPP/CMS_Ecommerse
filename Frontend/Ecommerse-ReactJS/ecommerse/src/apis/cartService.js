import axiosClient from './axiosClient';

const getCart = async (userId) => {
  const res = await axiosClient.get(`/cart/${userId}`);
  return res.data;
};

const addToCart = async (data) => {
  const res = await axiosClient.post('/cart', data);
  return res.data;
};

const deleteCartItem = async (cartItemId) => {
  const res = await axiosClient.delete('/cart/deleteItem', {
    data: { cartItemId }
  });
  return res.data;
};

const clearCart = async (userId) => {
  const res = await axiosClient.delete('/cart/delete', {
    data: { userId }
  });
  return res.data;
};

export { getCart, addToCart, deleteCartItem, clearCart };
