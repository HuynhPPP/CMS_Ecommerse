// Category Types based on PhycoCategory schema
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  parentId?: number;
  parent?: {
    id: number;
    name: string;
    slug: string;
  };
  children?: Category[];
  _count?: {
    products: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryWithChildren extends Category {
  children: Category[];
}
