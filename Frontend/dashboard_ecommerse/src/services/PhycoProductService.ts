import axiosInstance from '../utils/axiosInstance';
import type {
  PhycoProductType,
  PhycoProductCreate,
  PhycoProductQuery,
  PhycoProductResponse,
} from '../pages/PhycoProducts/Type';

const PhycoProductService = {
  getPhycoProducts: async (
    params: PhycoProductQuery
  ): Promise<PhycoProductResponse> => {
    const response = await axiosInstance.get('/phyco/products', { params });
    return response.data;
  },

  getPhycoProductById: async (id: number): Promise<PhycoProductType> => {
    const response = await axiosInstance.get(`/phyco/products/${id}`);
    return response.data;
  },

  createPhycoProduct: async (
    data: PhycoProductCreate
  ): Promise<PhycoProductType> => {
    const response = await axiosInstance.post('/phyco/products', data);
    return response.data;
  },

  updatePhycoProduct: async (
    id: number,
    data: Partial<PhycoProductCreate>
  ): Promise<PhycoProductType> => {
    const response = await axiosInstance.put(`/phyco/products/${id}`, data);
    return response.data;
  },

  deletePhycoProduct: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/phyco/products/${id}`);
    return response.data;
  },
};

export default PhycoProductService;
