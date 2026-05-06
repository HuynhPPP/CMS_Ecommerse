export interface Variants {
  id?: number;
  size: string;
  price: number;
  stock: number;
}

export interface Colors {
  id?: number;
  color: string;
  colorCode: string;
  images: {
    id?: number;
    imageUrl: string;
    publicId?: string; // Lưu ID để xóa trên Cloudinary
    order: number;
    file?: File; // Trường tạm để lưu file chưa upload
  }[];
  variants: Variants[];
}

export interface ProductType {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  colors: Colors[];
  moreDetails?: string[];
  sizeAndFit?: string[];
  guarantee?: string;
  sizeChartImage?: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  categoryId: number;
  colors: Colors[];
  moreDetails?: string[];
  sizeAndFit?: string[];
  guarantee?: string;
  sizeChartImage?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export interface ProductResponse {
  data: ProductType[];
  meta: PaginationMeta;
}
