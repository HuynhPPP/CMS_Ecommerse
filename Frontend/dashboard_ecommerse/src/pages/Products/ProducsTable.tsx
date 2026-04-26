import { Image, Table, Tag, Typography, Tooltip, Space } from 'antd';
import type { ProductType } from './Type';
import TableAction from '../../components/common/TableAction';

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
      width: 100,
      render: (_: any, record: ProductType) => {
        const firstImage = record.colors?.[0]?.images?.[0]?.imageUrl;
        return (
          <Image
            src={firstImage || 'https://via.placeholder.com/150'}
            alt={record.name}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      dataIndex: 'name',
      render: (name: string, record: ProductType) => (
        <Space direction='vertical' size={0}>
          <Typography.Text strong>{name}</Typography.Text>
          <Tag color='blue'>{record.category?.name}</Tag>
        </Space>
      ),
    },
    {
      title: 'Màu sắc',
      key: 'colors',
      width: 150,
      render: (_: any, record: ProductType) => (
        <Space wrap size={[4, 8]}>
          {record.colors?.map((color, index) => (
            <Tooltip title={color.color} key={index}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: color.colorCode,
                  border: '1px solid #ddd',
                  cursor: 'pointer'
                }}
              />
            </Tooltip>
          ))}
        </Space>
      ),
    },
    {
      title: 'Kích thước',
      key: 'sizes',
      width: 150,
      render: (_: any, record: ProductType) => {
        const sizes = Array.from(
          new Set(record.colors?.flatMap((c) => c.variants.map((v) => v.size)))
        );
        return (
          <Space wrap>
            {sizes.map((size, index) => (
              <Tag key={index} style={{ margin: 0 }}>
                {size}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Tổng kho',
      key: 'totalStock',
      align: 'center' as const,
      render: (_: any, record: ProductType) => {
        const total = record.colors?.reduce(
          (acc, color) =>
            acc + color.variants.reduce((sum, v) => sum + v.stock, 0),
          0
        );
        return <Typography.Text strong>{total || 0}</Typography.Text>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: ProductType) => (
        <TableAction
          showEdit={true}
          showDelete={true}
          onEdit={() => onEdit?.(record)}
          onDelete={() => onDelete?.(record.id)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey='id'
      loading={loading}
      pagination={pagination}
      onChange={onChange}
    />
  );
};
export default ProducsTable;
