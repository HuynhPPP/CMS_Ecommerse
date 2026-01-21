import { Table, Tag, Badge } from 'antd';
import type { PhycoOrder } from './Type';
import TableAction from '../../components/common/TableAction';

type Props = {
  orders: PhycoOrder[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onDetail: (id: number) => void;
  onStatusChange: (order: PhycoOrder) => void;
};

const TablePhycoOrders = ({
  orders,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onDetail,
  onStatusChange,
}: Props) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'gold',
      CONFIRMED: 'blue',
      PROCESSING: 'cyan',
      SHIPPED: 'purple',
      DELIVERED: 'green',
      CANCELLED: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const text: Record<string, string> = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy',
    };
    return text[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'PAID'
      ? 'success'
      : status === 'FAILED'
        ? 'error'
        : 'warning';
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 180,
      fixed: 'left' as const,
      render: (code: string) => <strong>{code}</strong>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_: any, record: PhycoOrder) => (
        <div>
          <div>{record.customerName || record.user?.username || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {record.customerEmail || record.user?.email || ''}
          </div>
        </div>
      ),
    },
    {
      title: 'Số SP',
      dataIndex: '_count',
      key: 'itemCount',
      width: 80,
      align: 'center' as const,
      render: (count: any) => <Badge count={count?.items || 0} showZero />,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      render: (amount: number) => (
        <strong style={{ color: '#1890ff' }}>
          {amount.toLocaleString('vi-VN')}₫
        </strong>
      ),
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      width: 110,
      render: (discount?: number) =>
        discount && discount > 0 ? (
          <span style={{ color: '#f5222d' }}>
            -{discount.toLocaleString('vi-VN')}₫
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string, record: PhycoOrder) => (
        <Tag
          color={getStatusColor(status)}
          style={{ cursor: 'pointer' }}
          onClick={() => onStatusChange(record)}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 150,
      render: (_: any, record: PhycoOrder) => (
        <div>
          <div>
            <Tag>{record.paymentMethod === 'COD' ? 'COD' : 'CK'}</Tag>
          </div>
          <Badge
            status={getPaymentStatusColor(record.paymentStatus)}
            text={
              record.paymentStatus === 'PAID'
                ? 'Đã TT'
                : record.paymentStatus === 'FAILED'
                  ? 'Thất bại'
                  : 'Chưa TT'
            }
          />
        </div>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: PhycoOrder) => (
        <TableAction showDetail onDetail={() => onDetail(record.id)} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey='id'
      loading={loading}
      scroll={{ x: 1400 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} đơn hàng`,
        onChange: onPageChange,
      }}
    />
  );
};

export default TablePhycoOrders;
