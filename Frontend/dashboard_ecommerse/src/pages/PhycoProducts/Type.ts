export type PhycoCategoryOption = {
  id: number;
  name: string;
  slug: string;
};

export type PhycoProductImage = {
  id?: number;
  imageUrl: string;
  imageAlt?: string;
  order?: number;
};

export type PhycoProductType = {
  id: number;
  sku?: string;
  name: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  type: 'simple' | 'variable';
  shortDescription?: string;
  description?: string;
  categoryId: number;
  category?: PhycoCategoryOption;

  // Pricing
  price?: number;
  regularPrice?: number;
  salePrice?: number;
  saleStart?: string;
  saleEnd?: string;

  // Stock
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  manageStock: boolean;
  backordersAllowed?: boolean;

  // Media
  featuredImageUrl?: string;
  imageAlt?: string;
  images?: PhycoProductImage[];

  // Shipping & Dimensions
  weight?: string;
  length?: number;
  width?: number;
  height?: number;

  // Tax
  taxStatus?: string;
  taxClass?: string;

  // Product type flags
  virtual?: boolean;
  downloadable?: boolean;

  // Other
  purchaseNote?: string;

  // Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PhycoProductCreate = {
  sku?: string;
  name: string;
  slug: string;
  status?: 'publish' | 'draft' | 'pending' | 'private';
  type?: 'simple' | 'variable';
  shortDescription?: string;
  description?: string;
  categoryId: number;

  // Pricing
  price?: number;
  regularPrice?: number;
  salePrice?: number;
  saleStart?: string;
  saleEnd?: string;

  // Stock
  stockStatus?: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  manageStock?: boolean;
  backordersAllowed?: boolean;

  // Media
  featuredImageUrl?: string;
  imageAlt?: string;
  images?: PhycoProductImage[];

  // Shipping & Dimensions
  weight?: string;
  length?: number;
  width?: number;
  height?: number;

  // Tax
  taxStatus?: string;
  taxClass?: string;

  // Product type flags
  virtual?: boolean;
  downloadable?: boolean;

  // Other
  purchaseNote?: string;
  isActive?: boolean;
};

export type PhycoProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  includeChildren?: boolean; // Include child categories when filtering by parent
  status?: string;
  type?: string;
};

export type PhycoProductResponse = {
  data: PhycoProductType[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
};
