import type { ProductPayload } from '../pages/Products/Type';
import axiosInstance from '../utils/axiosInstance';

const ProductService = {
  createProduct: async (data: ProductPayload) => {
    try {
      const res = await axiosInstance.post('/products', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  updateProduct: async (id: number, data: ProductPayload) => {
    try {
      const res = await axiosInstance.put(`/products/${id}`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ProductService;
