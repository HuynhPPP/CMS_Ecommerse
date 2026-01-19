export type PhycoCategoryType = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number | null;
  parent?: {
    id: number;
    name: string;
    slug: string;
  };
  children?: PhycoCategoryType[];
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export type PhycoCategoryTypeCreate = {
  name: string;
  slug: string;
  description?: string;
  parentId?: number | null;
  isActive: boolean;
};

export type PhycoCategoryQuery = {
  page: number;
  limit: number;
  search?: string;
  meta?: PaginationMeta;
  isActive?: string | boolean;
};

export type PhycoCategoryResponse = {
  data: PhycoCategoryType[];
  meta: PaginationMeta;
};
