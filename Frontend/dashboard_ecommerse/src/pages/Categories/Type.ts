export type CategoryType = {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export type CategoryTypeCreate = {
  name: string;
  description?: string;
  isActive: boolean;
};

export type CategoryQuery = {
  page: number;
  limit: number;
  search?: string;
  meta?: PaginationMeta;
  isActive?: string | boolean;
};

export type CategoryResponse = {
  data: CategoryType[];
  meta: PaginationMeta;
};
