import axios from 'axios';

// WooCommerce API Configuration from environment variables
const WOOCOMMERCE_API_URL = import.meta.env.VITE_WOOCOMMERCE_API_URL || '';
const CONSUMER_KEY = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || '';
const CONSUMER_SECRET = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || '';

// Create axios instance for WooCommerce API
const wooCommerceAPI = axios.create({
  baseURL: WOOCOMMERCE_API_URL,
  auth: {
    username: CONSUMER_KEY,
    password: CONSUMER_SECRET,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export type WooCommerceProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  stock_status: string;
  stock_quantity: number | null;
  manage_stock: boolean;
};

const WooCommerceService = {
  // Get all products
  getProducts: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: number;
    status?: string;
  }) => {
    try {
      const response = await wooCommerceAPI.get('/products', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching WooCommerce products:', error);
      throw new Error(
        error.response?.data?.message ||
          'Failed to fetch products from WooCommerce'
      );
    }
  },

  // Get single product
  getProduct: async (id: number) => {
    try {
      const response = await wooCommerceAPI.get(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching WooCommerce product:', error);
      throw new Error(
        error.response?.data?.message ||
          'Failed to fetch product from WooCommerce'
      );
    }
  },

  // Get product categories
  getCategories: async (params?: {
    page?: number;
    per_page?: number;
    parent?: number;
  }) => {
    try {
      const response = await wooCommerceAPI.get('/products/categories', {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching WooCommerce categories:', error);
      throw new Error(
        error.response?.data?.message ||
          'Failed to fetch categories from WooCommerce'
      );
    }
  },

  // Test connection
  testConnection: async () => {
    try {
      await wooCommerceAPI.get('/products', {
        params: { per_page: 1 },
      });
      return { success: true, message: 'Connection successful' };
    } catch (error: any) {
      console.error('WooCommerce connection test failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Connection failed',
      };
    }
  },
};

export default WooCommerceService;
