import { Table } from 'antd';
import type { ProductType } from './Type';

type Props = {
  products: ProductType[];
  loading?: boolean;
  onEdit?: (product: ProductType) => void;
  onDelete?: (id: number) => void;
  pagination?: any;
  onChange?: (pagination: any) => void;
};

const ProducsTable = ({
  products,
  loading,
  onEdit,
  onDelete,
  pagination,
  onChange,
}: Props) => {
  const columns = [
    {
      title: 'Ảnh',
      key: 'image',
      width: 80,
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Giá',
      key: 'price',
      dataIndex: 'price',
    },
    {
      title: 'Tổng kho',
      key: 'totalStock',
      dataIndex: 'totalStock',
    },
    {
      title: 'Hành động',
      key: 'action',
      dataIndex: 'action',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default ProducsTable;
