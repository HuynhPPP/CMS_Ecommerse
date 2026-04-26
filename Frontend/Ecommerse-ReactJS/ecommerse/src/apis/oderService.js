import axiosClient from './axiosClient';

const creatOrder = async (data) => {
    return await axiosClient.post(`/orders`, data);
};

const getDetailOrder = async (id) => {
    return await axiosClient.get(`/orders/${id}`);
};

export { creatOrder, getDetailOrder };