import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import AppFilter from '../../components/common/AppFilter';
import { Button } from 'antd';
import TableCategories from './TableCategories';
import ModalCategories from './Modal';
import CategoryService from '../../services/CategoryService';
import type { CategoryQuery, CategoryType } from './Type';
import { useDebounce } from '../../hooks/useDebounce';

const CategoriesFilters = [
  {
    type: 'input',
    name: 'search',
    label: 'Tìm kiếm',
    placeholder: 'Nhập từ khóa tìm kiếm',
  },
  {
    type: 'select',
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

const Categories = () => {
  const { isDark } = useContext(ThemeContext);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<CategoryQuery>({
    search: '',
    isActive: '',
    page: 1,
    limit: 10,
  });
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const debouncedSearch = useDebounce(query.search, 400);

  const handleGetValueFilter = (valueFilter: any) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: valueFilter?.search,
      isActive: valueFilter?.isActive ?? '',
    }));
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await CategoryService.getCategories(query);
      console.log('API Response:', res);
      console.log('API Response Data:', res.data);
      console.log('Is Array:', Array.isArray(res.data));

      // Ensure we always set an array
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
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handdleToggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleChangePageSizeTable = (newPage: number, newSize: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      limit: newSize,
    }));
  };

  useEffect(() => {
    fetchCategories();
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
          filters={CategoriesFilters}
          onChange={handleGetValueFilter}
        />

        <Button type='primary' onClick={handdleToggleModal}>
          + Tạo danh mục mới
        </Button>
      </div>
      <TableCategories
        loading={isLoading}
        page={query.page}
        pageSize={query.limit}
        total={query?.meta?.total ?? 0}
        categories={categories}
        onPageChange={handleChangePageSizeTable}
        onDelete={() => {}}
        onEdit={() => {}}
      />

      <ModalCategories
        open={openModal}
        onClose={handdleToggleModal}
        onSuccess={() => {
          fetchCategories();
        }}
      />
    </div>
  );
};

export default Categories;
