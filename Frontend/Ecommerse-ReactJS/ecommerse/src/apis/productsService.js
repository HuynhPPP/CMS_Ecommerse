import axiosClient from './axiosClient';

const getProducts = async (query) => {
  const { sortType, page, limit, search } = query;
  const queryLimit = limit === 'all' ? '' : `limit=${limit}`;
  const res = await axiosClient.get(
    `/products?sortType=${sortType}&page=${page}&${queryLimit}&search=${search || ''}`
  );
  return res.data;
};

const getDetailProduct = async (id) => {
  const res = await axiosClient.get(`/products/${id}`);
  return res.data;
};

const getRelatedProduct = async (id) => {
  const res = await axiosClient.get(`/related-products/${id}`);
  return res.data.relatedProducts;
};

export { getProducts, getDetailProduct, getRelatedProduct };
