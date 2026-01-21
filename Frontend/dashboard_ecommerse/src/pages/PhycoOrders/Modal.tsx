import AppModal from '../../components/common/AppModal';
import {
  Descriptions,
  Tag,
  Badge,
  Table,
  Select,
  Button,
  message,
  Modal,
} from 'antd';
import type { PhycoOrder } from './Type';
import PhycoOrderService from '../../services/PhycoOrderService';
import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: PhycoOrder | null;
};

const { Option } = Select;

const ModalPhycoOrders = ({ open, onClose, onSuccess, order }: Props) => {
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

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

  const getPaymentStatusColor = (status: string) => {
    return status === 'PAID'
      ? 'success'
      : status === 'FAILED'
        ? 'error'
        : 'warning';
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await PhycoOrderService.updateOrderStatus(
        order.id,
        newStatus as PhycoOrder['status']
      );
      message.success('Cập nhật trạng thái thành công');
      onSuccess();
      onClose();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = () => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      onOk: async () => {
        try {
          await PhycoOrderService.cancelOrder(order.id);
          message.success('Hủy đơn hàng thành công');
          onSuccess();
          onClose();
        } catch (error: any) {
          message.error(
            error.response?.data?.message || 'Không thể hủy đơn hàng'
          );
        }
      },
    });
  };

  const footer = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
          <Button danger onClick={handleCancelOrder}>
            Hủy đơn hàng
          </Button>
        )}
      </div>
      <div>
        <Button onClick={onClose}>Đóng</Button>
      </div>
    </div>
  );

  return (
    <AppModal
      title={`Chi tiết đơn hàng: ${order.orderCode}`}
      open={open}
      onCancel={onClose}
      footer={footer}
      width={800}
    >
      <Descriptions bordered column={2} size='small'>
        <Descriptions.Item label='Mã đơn hàng' span={2}>
          <strong>{order.orderCode}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Khách hàng'>
          {order.customerName || order.user?.username}
        </Descriptions.Item>
        <Descriptions.Item label='Email'>
          {order.customerEmail || order.user?.email}
        </Descriptions.Item>
        <Descriptions.Item label='Số điện thoại' span={2}>
          {order.customerPhone || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Trạng thái'>
          <Select
            value={order.status}
            onChange={handleStatusChange}
            style={{ width: '100%' }}
            loading={updating}
            disabled={
              order.status === 'DELIVERED' || order.status === 'CANCELLED'
            }
          >
            <Option value='PENDING'>
              <Tag color='gold'>Chờ xác nhận</Tag>
            </Option>
            <Option value='CONFIRMED'>
              <Tag color='blue'>Đã xác nhận</Tag>
            </Option>
            <Option value='PROCESSING'>
              <Tag color='cyan'>Đang xử lý</Tag>
            </Option>
            <Option value='SHIPPED'>
              <Tag color='purple'>Đang giao</Tag>
            </Option>
            <Option value='DELIVERED'>
              <Tag color='green'>Đã giao</Tag>
            </Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label='Thanh toán'>
          <Tag>{order.paymentMethod === 'COD' ? 'COD' : 'Chuyển khoản'}</Tag>
          <Badge
            status={getPaymentStatusColor(order.paymentStatus)}
            text={
              order.paymentStatus === 'PAID'
                ? 'Đã thanh toán'
                : 'Chưa thanh toán'
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label='Tổng tiền'>
          <strong style={{ color: '#1890ff', fontSize: '16px' }}>
            {order.totalAmount.toLocaleString('vi-VN')}₫
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Giảm giá'>
          {order.discount && order.discount > 0 ? (
            <span style={{ color: '#f5222d' }}>
              -{order.discount.toLocaleString('vi-VN')}₫
            </span>
          ) : (
            '0₫'
          )}
        </Descriptions.Item>
      </Descriptions>

      {order.address && (
        <div style={{ marginTop: 16 }}>
          <h4>Địa chỉ giao hàng</h4>
          <p>
            {order.address.fullName} - {order.address.phone}
            <br />
            {order.address.address}
            {order.address.ward && `, ${order.address.ward}`}
            {order.address.district && `, ${order.address.district}`}
            {order.address.city && `, ${order.address.city}`}
          </p>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <h4>Sản phẩm</h4>
        <Table
          dataSource={order.items}
          rowKey='id'
          pagination={false}
          size='small'
          columns={[
            {
              title: 'Sản phẩm',
              key: 'product',
              render: (_, item) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {item.variation?.product.featuredImageUrl && (
                    <img
                      src={item.variation.product.featuredImageUrl}
                      alt={item.variation.product.name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        marginRight: 8,
                      }}
                    />
                  )}
                  <div>
                    <div>{item.variation?.product.name}</div>
                    {item.variation?.sku && (
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        SKU: {item.variation.sku}
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              title: 'SL',
              dataIndex: 'quantity',
              key: 'quantity',
              width: 60,
              align: 'center' as const,
            },
            {
              title: 'Đơn giá',
              dataIndex: 'price',
              key: 'price',
              width: 120,
              render: (price: number) => `${price.toLocaleString('vi-VN')}₫`,
            },
            {
              title: 'Thành tiền',
              key: 'total',
              width: 120,
              render: (_, item) =>
                `${(item.price * item.quantity).toLocaleString('vi-VN')}₫`,
            },
          ]}
        />
      </div>
    </AppModal>
  );
};

export default ModalPhycoOrders;
