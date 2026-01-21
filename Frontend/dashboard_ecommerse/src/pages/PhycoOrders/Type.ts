export interface PhycoOrder {
  id: number;
  userId?: number;
  sessionId?: string;
  orderCode: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';
  paymentMethod: 'COD' | 'BANK_TRANSFER';
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED';
  totalAmount: number;
  discount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  items: PhycoOrderItem[];
  address?: PhycoAddress;
  _count?: {
    items: number;
  };
}

export interface PhycoOrderItem {
  id: number;
  orderId: number;
  variationId: number;
  quantity: number;
  price: number;
  variation?: {
    id: number;
    sku?: string;
    attributes: any;
    product: {
      id: number;
      name: string;
      slug: string;
      featuredImageUrl?: string;
    };
  };
}

export interface PhycoAddress {
  id: number;
  orderId: number;
  fullName: string;
  phone: string;
  address: string;
  ward?: string;
  district?: string;
  city?: string;
}

export interface PhycoOrderQuery {
  page?: number;
  limit?: number;
  status?: string;
  userId?: number;
  sessionId?: string;
  search?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

export interface PhycoOrderResponse {
  data: PhycoOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}
