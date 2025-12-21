import { useState } from 'react';
import AppModal from '../../components/common/AppModal';
import AppFilter from '../../components/common/AppFilter';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = () => {
    setIsOpen(!isOpen);
  };

  const testFilters = [
    {
      type: 'input',
      name: 'search',
      label: 'Tìm kiếm',
      placeholder: 'Nhập từ khóa tìm kiếm',
    },
    {
      type: 'select',
      name: 'category',
      label: 'Danh mục',
      placeholder: 'Chọn danh mục',
      options: [
        { label: 'Category 1', value: 'category-1' },
        { label: 'Category 2', value: 'category-2' },
        { label: 'Category 3', value: 'category-3' },
      ],
    },
  ];

  const handleGetValueFilter = (valueFilter: any) => {
    console.log(valueFilter);
  };

  return (
    <div>
      <button onClick={handleChange}>Open Modal</button>
      <AppFilter filters={testFilters} onChange={handleGetValueFilter} />

      <AppModal
        open={isOpen}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        bg='black'
      >
        <p>Modal content</p>
      </AppModal>
    </div>
  );
};

export default Dashboard;
