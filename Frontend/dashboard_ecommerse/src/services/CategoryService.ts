import type {
  CategoryTypeCreate,
  CategoryQuery,
  CategoryResponse,
} from '../pages/Categories/Type';
import axiosInstance from '../utils/axiosInstance';

const CategoryService = {
  createCategory: (data: CategoryTypeCreate) => {
    return axiosInstance.post('/categories', data);
  },

  getCategories: async (params: CategoryQuery): Promise<CategoryResponse> => {
    const res = await axiosInstance.get<CategoryResponse>('/categories', {
      params,
    });
    return res.data;
  },

  getCategoryById: (id: number) => {
    return axiosInstance.get(`/categories/${id}`);
  },

  updateCategory: (id: number, data: Partial<CategoryTypeCreate>) => {
    return axiosInstance.put(`/categories/${id}`, data);
  },

  deleteCategory: (id: number) => {
    return axiosInstance.delete(`/categories/${id}`);
  },
};

export default CategoryService;
