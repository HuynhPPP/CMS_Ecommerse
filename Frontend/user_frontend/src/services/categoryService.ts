import api from './api';
import type { Category, ApiResponse } from '../types';

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const categoryService = {
  /**
   * Get all categories with pagination
   */
  async getCategories(
    params?: GetCategoriesParams
  ): Promise<ApiResponse<Category[]>> {
    const response = await api.get<ApiResponse<Category[]>>(
      '/api/phyco/categories',
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 100, // Get all categories for menu
          search: params?.search || '',
          isActive: params?.isActive !== undefined ? params.isActive : true,
        },
      }
    );
    return response.data;
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get<Category>(`/api/phyco/categories/${id}`);
    return response.data;
  },

  /**
   * Get category tree (parent categories with children)
   */
  async getCategoryTree(): Promise<Category[]> {
    const response = await this.getCategories({ limit: 100, isActive: true });

    // Organize categories into tree structure
    const categoriesMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // First pass: create map of all categories
    response.data.forEach((category: { id: number; }) => {
      categoriesMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build tree structure
    response.data.forEach((category: { id: number; parentId: number; }) => {
      const cat = categoriesMap.get(category.id)!;
      if (category.parentId) {
        const parent = categoriesMap.get(category.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(cat);
        }
      } else {
        rootCategories.push(cat);
      }
    });

    return rootCategories;
  },
};

export default categoryService;
