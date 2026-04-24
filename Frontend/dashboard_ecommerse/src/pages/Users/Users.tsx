import { useState, useEffect, useCallback, useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import AppFilter from '../../components/common/AppFilter';
import { message } from 'antd';
import TableUsers from './TableUsers';
import ModalUsers from './ModalUsers';
import UserService from '../../services/UserService';
import type { UserType, UserQuery } from './Type';
import { useDebounce } from '../../hooks/useDebounce';

const UsersFilters = [
  {
    type: 'input' as const,
    name: 'search',
    label: 'Tìm kiếm',
    placeholder: 'Username hoặc Email',
  },
  {
    type: 'select' as const,
    name: 'role',
    label: 'Vai trò',
    placeholder: 'Vai trò',
    options: [
      { label: 'Tất cả', value: '0' },
      { label: 'ADMIN', value: 'ADMIN' },
      { label: 'USER', value: 'USER' },
    ],
  },
  {
    type: 'select' as const,
    name: 'isActive',
    label: 'Trạng thái',
    placeholder: 'Trạng thái',
    options: [
      { label: 'Tất cả', value: '0' },
      { label: 'Hoạt động', value: 'true' },
      { label: 'Không hoạt động', value: 'false' },
    ],
  },
];

const Users = () => {
  const { isDark } = useContext(ThemeContext);
  const [users, setUsers] = useState<UserType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<UserQuery>({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    isActive: undefined,
  });

  const debouncedSearch = useDebounce(query.search, 400);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UserService.getUsers(query);
      setUsers(response.data);
      setTotal(response.meta.total);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [query.page, query.limit, debouncedSearch, query.role, query.isActive]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleGetValueFilter = (valueFilter: any) => {
    // Nếu không có valueFilter (ví dụ khi nhấn clear all), reset về mặc định
    if (!valueFilter) {
      setQuery((prev) => ({
        ...prev,
        page: 1,
        search: '',
        role: '',
        isActive: undefined,
      }));
      return;
    }

    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: valueFilter.search || '',
      role: valueFilter.role === '0' || !valueFilter.role ? '' : valueFilter.role,
      isActive: valueFilter.isActive === '' || valueFilter.isActive === '0' || valueFilter.isActive === undefined
        ? undefined
        : valueFilter.isActive === 'true',
    }));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQuery((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleEdit = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setEditingUser(user);
      setModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await UserService.deleteUser(id);
      message.success('Xoá người dùng thành công');
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleModalOk = async (values: Partial<UserType>) => {
    if (!editingUser) return;
    setModalLoading(true);
    try {
      await UserService.updateUser(editingUser.id, values);
      message.success('Cập nhật người dùng thành công');
      setModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 8,
        background: isDark ? '#262626' : '#fff',
        boxShadow: isDark
          ? '0 2px 8px rgba(0, 0, 0, 0.6)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className='flex items-center justify-between mb-10'>
        <AppFilter
          filters={UsersFilters}
          onChange={handleGetValueFilter}
        />
      </div>

      <TableUsers
        users={users}
        total={total}
        page={query.page || 1}
        pageSize={query.limit || 10}
        loading={loading}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ModalUsers
        open={modalOpen}
        loading={modalLoading}
        initialValues={editingUser}
        onCancel={() => setModalOpen(false)}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default Users;
