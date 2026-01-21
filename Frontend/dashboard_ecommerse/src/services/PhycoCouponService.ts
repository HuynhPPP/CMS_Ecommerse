import axiosInstance from '../utils/axiosInstance';

export interface PhycoCoupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PhycoCouponCreate {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  usageLimit?: number;
}

export interface PhycoCouponQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

export interface PhycoCouponResponse {
  data: PhycoCoupon[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

const PhycoCouponService = {
  getCoupons: async (params: PhycoCouponQuery = {}): Promise<PhycoCoupon[]> => {
    const response = await axiosInstance.get('/phyco/coupons', { params });
    return response.data.data || response.data;
  },

  getCouponById: async (id: number): Promise<PhycoCoupon> => {
    const response = await axiosInstance.get(`/phyco/coupons/${id}`);
    return response.data;
  },

  createCoupon: async (data: PhycoCouponCreate): Promise<PhycoCoupon> => {
    const response = await axiosInstance.post('/phyco/coupons', data);
    return response.data;
  },

  updateCoupon: async (
    id: number,
    data: Partial<PhycoCouponCreate>
  ): Promise<PhycoCoupon> => {
    const response = await axiosInstance.put(`/phyco/coupons/${id}`, data);
    return response.data;
  },

  deleteCoupon: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/phyco/coupons/${id}`);
    return response.data;
  },

  toggleCouponStatus: async (id: number): Promise<PhycoCoupon> => {
    const response = await axiosInstance.patch(`/phyco/coupons/${id}/toggle`);
    return response.data;
  },
};

export default PhycoCouponService;
