import axiosInstance from '../utils/axiosInstance';
import type { UserQuery, UserResponse, UserType } from '../pages/Users/Type';

const UserService = {
  getUsers: async (params: UserQuery): Promise<UserResponse> => {
    const res = await axiosInstance.get<UserResponse>('/users', {
      params,
    });
    return res.data;
  },

  getUserById: async (id: number): Promise<UserType> => {
    const res = await axiosInstance.get<UserType>(`/users/${id}`);
    return res.data;
  },

  updateUser: async (id: number, data: Partial<UserType>) => {
    const res = await axiosInstance.put(`/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: number) => {
    const res = await axiosInstance.delete(`/users/${id}`);
    return res.data;
  },
};

export default UserService;
