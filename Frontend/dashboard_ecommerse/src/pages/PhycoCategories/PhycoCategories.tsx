import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import AppFilter from '../../components/common/AppFilter';
import { Button, message } from 'antd';
import TablePhycoCategories from './TablePhycoCategories';
import ModalPhycoCategories from './Modal';
import PhycoCategoryService from '../../services/PhycoCategoryService';
import type { PhycoCategoryQuery, PhycoCategoryType } from './Type';
import { useDebounce } from '../../hooks/useDebounce';
import './PhycoCategories.css'; // Import CSS for styling

const PhycoCategoriesFilters = [
  {
    type: 'input' as const,
    name: 'search',
    label: 'Tìm kiếm',
    placeholder: 'Nhập từ khóa tìm kiếm',
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

const PhycoCategories = () => {
  const { isDark } = useContext(ThemeContext);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<PhycoCategoryQuery>({
    search: '',
    isActive: '',
    page: 1,
    limit: 10,
  });
  const [categories, setCategories] = useState<PhycoCategoryType[]>([]);
  const debouncedSearch = useDebounce(query.search, 400);
  const [isEditing, setIsEditing] = useState(0);

  const handleGetValueFilter = (valueFilter: any) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: valueFilter?.search,
      isActive: valueFilter?.isActive ?? '',
    }));
  };

  const fetchPhycoCategories = async () => {
    try {
      setIsLoading(true);
      const res = await PhycoCategoryService.getPhycoCategories(query);

      const categoriesData = Array.isArray(res.data) ? res.data : [];
      setCategories(categoriesData);

      setQuery((prev) => ({
        ...prev,
        page: res.meta?.page ?? prev.page,
        limit: res.meta?.limit ?? prev.limit,
        meta: res.meta,
      }));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching Phyco categories:', error);
      setCategories([]);
      message.error('Lỗi khi tải danh sách danh mục Phyco');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleModal = () => {
    setOpenModal(!openModal);
    if (openModal) {
      setIsEditing(0);
    }
  };

  const handleChangePageSizeTable = (newPage: number, newSize: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      limit: newSize,
    }));
  };

  const handleEditCategory = (id: number) => {
    setOpenModal(true);
    setIsEditing(id);
  };

  const handleDeleteCategory = async (id: number) => {
    await PhycoCategoryService.deletePhycoCategory(id)
      .then(() => {
        fetchPhycoCategories();
        message.success('Xóa danh mục Phyco thành công');
      })
      .catch((error) => {
        console.error('Error deleting Phyco category:', error);
        const errorMessage =
          error.response?.data?.message || 'Xóa danh mục Phyco thất bại';
        message.error(errorMessage);
      });
  };

  useEffect(() => {
    fetchPhycoCategories();
  }, [query.limit, query.page, debouncedSearch, query.isActive]);

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
          filters={PhycoCategoriesFilters}
          onChange={handleGetValueFilter}
        />

        <Button type='primary' onClick={handleToggleModal}>
          + Tạo danh mục Phyco mới
        </Button>
      </div>
      <TablePhycoCategories
        loading={isLoading}
        page={query.page}
        pageSize={query.limit}
        total={query?.meta?.total ?? 0}
        categories={categories}
        onPageChange={handleChangePageSizeTable}
        onDelete={handleDeleteCategory}
        onEdit={handleEditCategory}
      />

      <ModalPhycoCategories
        open={openModal}
        onClose={handleToggleModal}
        onSuccess={() => {
          fetchPhycoCategories();
        }}
        categoryId={isEditing}
      />
    </div>
  );
};

export default PhycoCategories;
