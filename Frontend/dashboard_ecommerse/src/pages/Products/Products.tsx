import { useContext, useEffect, useState } from 'react';
import type { FilterConfig } from '../../components/common/AppFilter';
import CategoryService from '../../services/CategoryService';
import type { CategoryType } from '../Categories/Type';
import AppFilter from '../../components/common/AppFilter';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProducsTable from './ProducsTable';

const Products = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getCategories({
        isActive: true,
        limit: 100,
        page: 1,
      });
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (values: Record<string, any>) => {
    console.log(values);
  };

  const filterConfig: FilterConfig[] = [
    {
      type: 'input',
      name: 'search',
      label: 'Tìm kiếm',
      placeholder: 'Tìm kiếm sản phẩm...',
    },
    {
      type: 'select',
      name: 'categoryId',
      label: 'Danh mục',
      placeholder: 'Chọn danh mục',
      options: categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    },
  ];

  console.log(categories);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
          alignItems: 'flex-end',
        }}
      >
        <AppFilter
          filters={filterConfig}
          onChange={(values) => handleFilterChange(values)}
        />

        <Button type='primary' onClick={() => setOpenModal(true)}>
          <PlusOutlined />
          Tạo sản phẩm mới
        </Button>
      </div>

      <ProducsTable products={[]} />
    </div>
  );
};

export default Products;
