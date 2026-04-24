export interface UserType {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserResponse {
  data: UserType[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}
