import type {
  PhycoCategoryTypeCreate,
  PhycoCategoryQuery,
  PhycoCategoryResponse,
} from '../pages/PhycoCategories/Type';
import axiosInstance from '../utils/axiosInstance';

const PhycoCategoryService = {
  createPhycoCategory: (data: PhycoCategoryTypeCreate) => {
    return axiosInstance.post('/phyco/categories', data);
  },

  getPhycoCategories: async (
    params: PhycoCategoryQuery
  ): Promise<PhycoCategoryResponse> => {
    const res = await axiosInstance.get<PhycoCategoryResponse>(
      '/phyco/categories',
      {
        params,
      }
    );
    return res.data;
  },

  getPhycoCategoryById: (id: number) => {
    return axiosInstance.get(`/phyco/categories/${id}`);
  },

  updatePhycoCategory: (id: number, data: Partial<PhycoCategoryTypeCreate>) => {
    return axiosInstance.put(`/phyco/categories/${id}`, data);
  },

  deletePhycoCategory: (id: number) => {
    return axiosInstance.delete(`/phyco/categories/${id}`);
  },
};

export default PhycoCategoryService;
