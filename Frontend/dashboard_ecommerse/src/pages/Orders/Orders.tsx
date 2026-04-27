import React, { useEffect, useState, useContext } from 'react';
import { Table, Tag, Space, Button, message, Modal, Select, Descriptions, Typography, Divider, Input, Row, Col, Card, Statistic, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  SearchOutlined, 
  ShoppingCartOutlined, 
} from '@ant-design/icons';
import OrderService from '../../services/OrderService';
import dayjs from 'dayjs';
import { ThemeContext } from '../../contexts/ThemeContext';
import DetailOrder from './DetailOrder';

const { Title, Text } = Typography;

interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  address: {
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    email: string;
  };
  user: {
    username: string;
    email: string;
  };
  items: any[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await OrderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await OrderService.updateOrderStatus(id, newStatus);
      message.success('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const showDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <b>#{id}</b>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm tên khách hàng"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
              Xóa
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        `${record.address.firstName} ${record.address.lastName}`.toLowerCase().includes((value as string).toLowerCase()),
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.address.firstName} {record.address.lastName}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.address.phone}</Text>
        </Space>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <Text type="danger" strong>{amount.toLocaleString()} VNĐ</Text>,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      filters: [
        { text: 'Chuyển khoản / QR', value: 'QRCODE' },
        { text: 'Khi nhận hàng (COD)', value: 'COD' },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: (method) => (
        <Tag color={method === 'QRCODE' ? 'blue' : 'orange'}>
          {method === 'QRCODE' ? 'CHUYỂN KHOẢN / QR' : 'COD'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'CHỜ XÁC NHẬN', value: 'PENDING' },
        { text: 'THÀNH CÔNG', value: 'SUCCESS' },
        { text: 'ĐANG GIAO', value: 'SHIPPING' },
        { text: 'ĐÃ HỦY', value: 'CANCELLED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(record.id, value)}
          options={[
            { value: 'PENDING', label: <Tag color="gold">CHỜ XÁC NHẬN</Tag> },
            { value: 'SUCCESS', label: <Tag color="green">THÀNH CÔNG</Tag> },
            { value: 'SHIPPING', label: <Tag color="blue">ĐANG GIAO</Tag> },
            { value: 'CANCELLED', label: <Tag color="red">ĐÃ HỦY</Tag> },
          ]}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => showDetail(record)}>Xem chi tiết</Button>
      ),
    },
  ];

  return (
    <div style={{ 
      padding: '24px', 
      background: isDark ? '#141414' : '#fff', 
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      minHeight: '100%'
    }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: isDark ? '#fff' : undefined }}>Quản Lý Đơn Hàng</Title>
        <Button type="primary" onClick={fetchOrders}>Làm mới</Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={orders} 
        loading={loading} 
        rowKey="id" 
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          locale: { items_per_page: '/ trang' }
        }}
        style={{ background: 'transparent' }}
      />

      <DetailOrder 
        order={selectedOrder} 
        visible={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        isDark={isDark} 
      />
    </div>
  );
};

export default Orders;
