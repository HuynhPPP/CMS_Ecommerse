import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  App,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import PhycoCouponService, {
  type PhycoCoupon,
} from '../../services/PhycoCouponService';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PhycoCoupons: React.FC = () => {
  const { message } = App.useApp();
  const [coupons, setCoupons] = useState<PhycoCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<PhycoCoupon | null>(null);
  const [form] = Form.useForm();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await PhycoCouponService.getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      message.error('Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const columns: ColumnsType<PhycoCoupon> = [
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <strong>{code}</strong>,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'percentage' ? 'blue' : 'green'}>
          {type === 'percentage' ? 'Phần trăm' : 'Cố định'}
        </Tag>
      ),
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record) =>
        record.type === 'percentage'
          ? `${value}%`
          : `${value.toLocaleString('vi-VN')}₫`,
    },
    {
      title: 'Số lần dùng',
      key: 'usage',
      render: (_, record) => `${record.usedCount}/${record.usageLimit || '∞'}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Hạn sử dụng',
      key: 'validity',
      render: (_, record) =>
        `${new Date(record.startDate).toLocaleDateString('vi-VN')} - ${new Date(
          record.endDate
        ).toLocaleDateString('vi-VN')}`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type='link'
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (coupon: PhycoCoupon) => {
    setEditingCoupon(coupon);
    setModalVisible(true);
    message.info('Chức năng chỉnh sửa đang được phát triển');
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa mã giảm giá này?',
      onOk: () => {
        message.info('Backend API chưa sẵn sàng');
      },
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Quản lý Mã giảm giá</h2>}
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchCoupons}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingCoupon(null);
                setModalVisible(true);
              }}
            >
              Tạo mã mới
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={coupons}
          rowKey='id'
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} mã`,
          }}
        />
      </Card>

      <Modal
        title={editingCoupon ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <p>
          Backend API cho Coupons sẽ được thêm vào trong giai đoạn tiếp theo.
        </p>
      </Modal>
    </div>
  );
};

export default PhycoCoupons;
