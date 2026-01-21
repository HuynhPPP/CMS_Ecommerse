import api from './api';
import type { Product, ApiResponse } from '../types';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  includeChildren?: boolean;
  status?: 'publish' | 'draft' | 'pending';
  type?: 'simple' | 'variable';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const productService = {
  /**
   * Get all products with pagination and filters
   */
  async getProducts(
    params?: GetProductsParams
  ): Promise<ApiResponse<Product[]>> {
    const response = await api.get<ApiResponse<Product[]>>(
      '/api/phyco/products',
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 15,
          search: params?.search || '',
          categoryId: params?.categoryId,
          includeChildren: params?.includeChildren || false,
          status: params?.status || 'publish',
          type: params?.type,
        },
      }
    );
    return response.data;
  },

  /**
   * Get product by ID
   */
  async getProductById(id: number) {
    const response = await api.get(`/api/phyco/products/${id}`);
    // Backend returns product directly, not wrapped in { data: product }
    return response;
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(
    categoryId: number,
    params?: Omit<GetProductsParams, 'categoryId'>
  ): Promise<ApiResponse<Product[]>> {
    return this.getProducts({
      ...params,
      categoryId,
      includeChildren: true,
    });
  },

  /**
   * Search products
   */
  async searchProducts(
    searchTerm: string,
    params?: Omit<GetProductsParams, 'search'>
  ): Promise<ApiResponse<Product[]>> {
    return this.getProducts({
      ...params,
      search: searchTerm,
    });
  },
};

export default productService;
