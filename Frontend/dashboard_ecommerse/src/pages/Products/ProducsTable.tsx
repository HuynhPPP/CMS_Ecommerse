import { Image, Table, Tag, Typography, Tooltip, Space, Empty } from 'antd';
import type { ProductType } from './Type';
import TableAction from '../../components/common/TableAction';
import { useState, useEffect } from 'react';

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
  // State lưu trữ index của màu đang chọn cho mỗi sản phẩm: { [productId]: colorIndex }
  const [selectedColorMap, setSelectedColorMap] = useState<Record<number, number>>({});
  const [loadingTip, setLoadingTip] = useState<string>('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading) {
      timer = setTimeout(() => {
        setLoadingTip('Server đang khởi động, vui lòng chờ trong giây lát...');
      }, 5000);
    } else {
      setLoadingTip('');
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const columns = [
    {
      title: 'Ảnh',
      key: 'image',
      width: 100,
      render: (_: any, record: ProductType) => {
        const colorIndex = selectedColorMap[record.id] || 0;
        const selectedColor = record.colors?.[colorIndex];
        const images = selectedColor?.images || [];
        const mainImage = images[0]?.imageUrl || 'https://via.placeholder.com/150';

        return (
          <div className="product-image-preview">
            <Image.PreviewGroup
              items={images.map(img => img.imageUrl)}
            >
              <Image
                src={mainImage}
                alt={record.name}
                width={60}
                height={60}
                style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
              />
            </Image.PreviewGroup>

          </div>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      dataIndex: 'name',
      render: (name: string, record: ProductType) => (
        <Space orientation='vertical' size={0}>
          <Typography.Text strong>{name}</Typography.Text>
          <Tag color='blue'>{record.category?.name}</Tag>
        </Space>
      ),
    },
    {
      title: 'Màu sắc',
      key: 'colors',
      width: 150,
      render: (_: any, record: ProductType) => {
        const selectedIndex = selectedColorMap[record.id] || 0;

        return (
          <Space wrap size={[8, 8]}>
            {record.colors?.map((color, index) => (
              <Tooltip title={color.color} key={index}>
                <div
                  onClick={() => setSelectedColorMap(prev => ({ ...prev, [record.id]: index }))}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: color.colorCode,
                    border: selectedIndex === index
                      ? '2px solid #1890ff'
                      : '1px solid #ddd',
                    cursor: 'pointer',
                    padding: '2px',
                    boxShadow: selectedIndex === index ? '0 0 4px rgba(24, 144, 255, 0.5)' : 'none',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Chấm nhỏ bên trong để tạo hiệu ứng khi chọn */}
                  {selectedIndex === index && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', boxShadow: '0 0 2px rgba(0,0,0,0.5)' }} />
                  )}
                </div>
              </Tooltip>
            ))}
          </Space>
        );
      },
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
      bordered
      columns={columns}
      dataSource={products}
      rowKey='id'
      locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
      loading={{ spinning: !!loading, tip: loadingTip }}
      pagination={pagination}
      onChange={onChange}
    />
  );
};
export default ProducsTable;
