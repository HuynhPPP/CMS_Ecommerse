import { Table, Tag, Image } from 'antd';
import type { PhycoProductType } from './Type';
import TableAction from '../../components/common/TableAction';

type Props = {
  products: PhycoProductType[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

const TablePhycoProducts = ({
  products,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onDelete,
  onEdit,
}: Props) => {
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'featuredImageUrl',
      key: 'image',
      width: 100,
      render: (url: string, record: PhycoProductType) => {
        // Combine featured image and gallery images for preview
        const allImages = [
          url || 'https://via.placeholder.com/80?text=No+Image',
          ...(record.images?.map((img) => img.imageUrl) || []),
        ];

        return (
          <Image.PreviewGroup items={allImages}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Image
                src={url || 'https://via.placeholder.com/80?text=No+Image'}
                alt={record.imageAlt || record.name}
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: 4 }}
                fallback='https://via.placeholder.com/80?text=Error'
                preview={{
                  mask:
                    record.images && record.images.length > 0
                      ? `Xem ${record.images.length + 1} ảnh`
                      : 'Xem ảnh',
                }}
              />
              {record.images && record.images.length > 0 && (
                <Tag
                  color='blue'
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    fontSize: 10,
                    padding: '0 4px',
                  }}
                >
                  +{record.images.length}
                </Tag>
              )}
            </div>
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string, record: PhycoProductType) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          {record.sku && (
            <div style={{ fontSize: 12, color: '#999' }}>SKU: {record.sku}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: PhycoProductType['category']) => (
        <span>{category?.name || '-'}</span>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (_: any, record: PhycoProductType) => (
        <div>
          {record.salePrice ? (
            <>
              <div style={{ color: '#ff4d4f', fontWeight: 500 }}>
                {record.salePrice.toLocaleString('vi-VN')}₫
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#999',
                  textDecoration: 'line-through',
                }}
              >
                {record.regularPrice?.toLocaleString('vi-VN')}₫
              </div>
            </>
          ) : (
            <div style={{ fontWeight: 500 }}>
              {record.price?.toLocaleString('vi-VN') || '0'}₫
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      key: 'stock',
      width: 100,
      render: (quantity: number, record: PhycoProductType) => (
        <div>
          {record.manageStock ? (
            <div>
              <div style={{ fontWeight: 500 }}>{quantity || 0}</div>
              <Tag
                color={
                  record.stockStatus === 'instock'
                    ? 'green'
                    : record.stockStatus === 'outofstock'
                      ? 'red'
                      : 'orange'
                }
                style={{ fontSize: 11, marginTop: 4 }}
              >
                {record.stockStatus === 'instock'
                  ? 'Còn hàng'
                  : record.stockStatus === 'outofstock'
                    ? 'Hết hàng'
                    : 'Đặt trước'}
              </Tag>
            </div>
          ) : (
            <span style={{ color: '#999' }}>Không quản lý</span>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: PhycoProductType) => (
        <div>
          <Tag
            color={
              status === 'publish'
                ? 'green'
                : status === 'draft'
                  ? 'default'
                  : status === 'pending'
                    ? 'orange'
                    : 'red'
            }
          >
            {status === 'publish'
              ? 'Xuất bản'
              : status === 'draft'
                ? 'Nháp'
                : status === 'pending'
                  ? 'Chờ duyệt'
                  : 'Riêng tư'}
          </Tag>
          <Tag
            color={record.isActive ? 'green' : 'red'}
            style={{ marginTop: 4 }}
          >
            {record.isActive ? 'Hoạt động' : 'Ẩn'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_: string, record: PhycoProductType) => (
        <TableAction
          showEdit
          showDelete
          onEdit={() => onEdit(record.id)}
          onDelete={() => onDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      rowKey='id'
      scroll={{ x: 1200 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} sản phẩm`,
        onChange: onPageChange,
      }}
    />
  );
};

export default TablePhycoProducts;
