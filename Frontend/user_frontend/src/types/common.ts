// API Types
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

// Breadcrumb Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Filter Types
export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  search: string;
  categories: number[];
  priceRange: PriceRange;
  tags: string[];
}

// Pagination Types
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Sort Types
export type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

export interface SortState {
  sortBy: SortOption;
}
