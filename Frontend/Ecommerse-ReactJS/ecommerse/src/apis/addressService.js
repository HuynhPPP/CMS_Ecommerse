import axiosClient from './axiosClient';

const getProvinces = async () => {
  const res = await axiosClient.get('/address/provinces');
  return res.data;
};

const getWardsByProvince = async (provinceCode) => {
  const res = await axiosClient.get(`/address/wards/${provinceCode}`);
  return res.data;
};

export { getProvinces, getWardsByProvince };
