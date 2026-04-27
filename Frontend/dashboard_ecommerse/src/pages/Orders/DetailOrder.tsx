import React from 'react';
import { Modal, Space, Button, Typography, Row, Col, Card, Statistic, Tag, Descriptions, Table, Timeline, Divider } from 'antd';
import { 
  ShoppingCartOutlined, 
  PrinterOutlined, 
  CreditCardOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined, 
  InfoCircleOutlined,
  UserOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface OrderItem {
  id: number;
  price: number;
  quantity: number;
  variant: {
    id: number;
    size: string;
    price: number;
    color: {
      color: string;
      images: { imageUrl: string }[];
      product: {
        id: number;
        name: string;
      };
    };
  };
}

interface OrderDetailProps {
  order: {
    id: number;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
    user: {
      username: string;
      email: string;
    };
    address: {
      firstName: string;
      lastName: string;
      phone: string;
      street: string;
      state: string;
      city: string;
      country: string;
      zipCode?: string;
      email: string;
    };
    items: OrderItem[];
  } | null;
  visible: boolean;
  onCancel: () => void;
  isDark: boolean;
}

const DetailOrder: React.FC<OrderDetailProps> = ({ order, visible, onCancel, isDark }) => {
  if (!order) return null;

  return (
    <Modal
      title={
        <Space>
          <ShoppingCartOutlined style={{ color: '#1890ff' }} />
          <span>Chi Tiết Đơn Hàng <Text copyable={{ text: order.id.toString() }}>#{order.id}</Text></span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
          In đơn hàng
        </Button>,
        <Button key="close" type="primary" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={1000}
      styles={{ body: { backgroundColor: isDark ? '#141414' : '#f5f5f5', padding: '20px' } }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Summary Information Row */}
        <Row gutter={16}>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Trạng thái"
                value={order.status}
                valueStyle={{ color: order.status === 'SUCCESS' ? '#3f8600' : '#cf1322', fontSize: '16px', fontWeight: 'bold' }}
                prefix={<InfoCircleOutlined />}
              />
              <Tag color={order.status === 'SUCCESS' ? 'green' : 'gold'} style={{ marginTop: 8 }}>
                {order.status}
              </Tag>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Tổng thanh toán"
                value={order.totalAmount}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                suffix="VNĐ"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Thanh toán"
                value={order.paymentMethod === 'QRCODE' ? 'Chuyển khoản' : 'COD'}
                valueStyle={{ fontSize: '16px' }}
                prefix={<CreditCardOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Ngày đặt hàng"
                value={dayjs(order.createdAt).format('DD/MM/YYYY')}
                valueStyle={{ fontSize: '16px' }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Customer and Shipping Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Card title={<Space><UserOutlined />Thông tin khách hàng</Space>} bordered={false} style={{ height: '100%' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tên tài khoản">{order.user.username}</Descriptions.Item>
                <Descriptions.Item label="Email đăng ký">{order.user.email}</Descriptions.Item>
                <Descriptions.Item label="Họ tên nhận">{order.address.firstName} {order.address.lastName}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  <Text strong>{order.address.phone}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={<Space><EnvironmentOutlined />Địa chỉ nhận hàng</Space>} bordered={false} style={{ height: '100%' }}>
              <div style={{ marginBottom: 10 }}>
                <Text type="secondary">Địa chỉ chi tiết:</Text>
                <div style={{ marginTop: 4 }}>
                  <Text strong>{order.address.street}</Text>
                </div>
              </div>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Phường / Xã">{order.address.state}</Descriptions.Item>
                <Descriptions.Item label="Quận / Huyện / TP">{order.address.city}</Descriptions.Item>
                <Descriptions.Item label="Quốc gia">{order.address.country}</Descriptions.Item>
                <Descriptions.Item label="Mã bưu điện">{order.address.zipCode || '00000'}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* Order Items Table */}
        <Card title={<Space><ShoppingOutlined />Danh sách sản phẩm ({order.items.length})</Space>} bordered={false}>
          <Table<OrderItem>
            dataSource={order.items}
            pagination={false}
            rowKey="id"
            columns={[
              {
                title: 'Sản phẩm',
                key: 'product',
                render: (_, item) => (
                  <Space size="middle">
                    <img 
                      src={item.variant.color.images?.[0]?.imageUrl} 
                      alt="product" 
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }} 
                    />
                    <div>
                      <Text strong style={{ display: 'block' }}>{item.variant.color.product.name}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>SKU: SKU-{item.variant.color.product.id}-{item.variant.id}</Text>
                    </div>
                  </Space>
                ),
              },
              {
                title: 'Phân loại',
                key: 'variant',
                render: (_, item) => (
                  <Space direction="vertical" size={0}>
                    <Tag color="blue">{item.variant.color.color}</Tag>
                    <Tag color="purple">{item.variant.size}</Tag>
                  </Space>
                ),
              },
              {
                title: 'Đơn giá',
                dataIndex: 'price',
                key: 'price',
                align: 'right',
                render: (p) => <Text>{p.toLocaleString()} VNĐ</Text>,
              },
              {
                title: 'Số lượng',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'center',
                render: (q) => <Text strong>x{q}</Text>,
              },
              {
                title: 'Thành tiền',
                key: 'total',
                align: 'right',
                render: (_, item) => <Text strong style={{ color: '#cf1322' }}>{(item.price * item.quantity).toLocaleString()} VNĐ</Text>,
              },
            ]}
            footer={() => (
              <div style={{ textAlign: 'right', paddingRight: 20 }}>
                <Space size="large">
                  <Text type="secondary">Tổng số lượng:</Text>
                  <Text strong>{order.items.reduce((acc: number, item: OrderItem) => acc + item.quantity, 0)}</Text>
                  <Text type="secondary">Tạm tính:</Text>
                  <Title level={4} style={{ margin: 0, color: '#cf1322' }}>{order.totalAmount.toLocaleString()} VNĐ</Title>
                </Space>
              </div>
            )}
          />
        </Card>

        {/* Order Timeline */}
        <Card title="Lịch sử đơn hàng" bordered={false}>
          <Timeline
            items={[
              {
                color: 'green',
                children: `Đơn hàng được khởi tạo thành công vào ${dayjs(order.createdAt).format('HH:mm DD/MM/YYYY')}`,
              },
              {
                color: order.status === 'PENDING' ? 'blue' : 'green',
                children: `Trạng thái hiện tại: ${order.status}`,
              },
              {
                children: 'Đang chờ xử lý các bước tiếp theo...',
              },
            ]}
          />
        </Card>
      </Space>
    </Modal>
  );
};

export default DetailOrder;
