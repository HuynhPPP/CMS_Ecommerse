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
  isActive?: boolean | string;
  search?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}
