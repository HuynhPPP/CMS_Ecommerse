// Product Types based on PhycoProduct schema
export interface ProductImage {
  id?: number;
  imageUrl: string;
  imageAlt?: string;
  order?: number;
}

export interface ProductTag {
  id?: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id?: number;
  name: string;
  slug: string;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface ProductVariation {
  id?: number;
  sku?: string;
  price: number;
  regularPrice?: number;
  salePrice?: number;
  saleStart?: string;
  saleEnd?: string;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  manageStock: boolean;
  backordersAllowed: boolean;
  attributes: Record<string, string>;
  imageUrl?: string;
  weight?: string;
  length?: number;
  width?: number;
  height?: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  data: any;
  id: number;
  sku?: string;
  name: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending';
  type: 'simple' | 'variable';
  shortDescription?: string;
  description?: string;
  categoryId: number;
  category?: ProductCategory;
  authorId?: number;
  price?: number;
  regularPrice?: number;
  salePrice?: number;
  saleStart?: string;
  saleEnd?: string;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  manageStock: boolean;
  backordersAllowed: boolean;
  featuredImageUrl?: string;
  imageAlt?: string;
  weight?: string;
  length?: number;
  width?: number;
  height?: number;
  shippingClassId?: number;
  taxStatus: 'taxable' | 'shipping' | 'none';
  taxClass?: string;
  virtual: boolean;
  downloadable: boolean;
  purchaseNote?: string;
  images?: ProductImage[];
  tags?: ProductTag[];
  attributes?: ProductAttribute[];
  variations?: ProductVariation[];
  _count?: {
    variations: number;
  };
  likes?: number;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

// For backward compatibility with existing components
export type ProductType = Product;
