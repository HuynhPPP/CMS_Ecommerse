import axiosClient from './axiosClient';

const login = async (data) => {
  const res = await axiosClient.post('/users/login', data);
  return res.data;
};

const register = async (data) => {
  const res = await axiosClient.post('/users/register', data);
  return res.data;
};

const getInfo = async (id) => {
  const res = await axiosClient.get(`/users/${id}`);
  return res.data;
};

export { login, register, getInfo };
