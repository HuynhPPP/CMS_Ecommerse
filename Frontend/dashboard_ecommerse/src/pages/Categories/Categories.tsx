import { useContext, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import AppFilter from '../../components/common/AppFilter';
import { Button } from 'antd';
import TableCategories from './TableCategories';
import ModalCategories from './Modal';

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
      { label: 'Hoạt động', value: '1' },
      { label: 'Không hoạt động', value: '2' },
    ],
  },
];

const Categories = () => {
  const { isDark } = useContext(ThemeContext);
  const [openModal, setOpenModal] = useState(false);

  const handleGetValueFilter = (valueFilter: any) => {
    console.log(valueFilter);
  };

  const handleToggleModal = () => {
    setOpenModal(!openModal);
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
          filters={CategoriesFilters}
          onChange={handleGetValueFilter}
        />

        <Button type='primary' onClick={handleToggleModal}>
          + Tạo danh mục mới
        </Button>
      </div>
      <TableCategories
        loading={false}
        page={1}
        pageSize={10}
        total={0}
        categories={[]}
        onPageChange={() => {}}
        onDelete={() => {}}
        onEdit={() => {}}
      />

      <ModalCategories
        open={openModal}
        onClose={handleToggleModal}
        onSuccess={handleToggleModal}
      />
    </div>
  );
};

export default Categories;
