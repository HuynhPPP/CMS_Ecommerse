import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Tabs,
  DatePicker,
  message,
  Button,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import type { PhycoProductType, PhycoProductCreate } from './Type';
import PhycoCategoryService from '../../services/PhycoCategoryService';
import type { PhycoCategoryType } from '../PhycoCategories/Type';
import { LinkOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PhycoProductCreate) => void;
  editingProduct: PhycoProductType | null;
  loading: boolean;
};

const ModalPhycoProducts = ({
  open,
  onClose,
  onSubmit,
  editingProduct,
  loading,
}: Props) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<PhycoCategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Load categories
  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await PhycoCategoryService.getPhycoCategories({
        page: 1,
        limit: 100,
      });
      setCategories(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Build hierarchical category list for dropdown
  const buildHierarchicalCategories = () => {
    const result: PhycoCategoryType[] = [];

    // Get parent categories first
    const parents = categories.filter((cat) => !cat.parentId);

    // For each parent, add it and then its children
    parents.forEach((parent) => {
      result.push(parent);

      // Add children of this parent
      const children = categories.filter((cat) => cat.parentId === parent.id);
      children.forEach((child) => {
        result.push(child);
      });
    });

    // Add any orphaned categories
    const addedIds = new Set(result.map((c) => c.id));
    categories.forEach((cat) => {
      if (!addedIds.has(cat.id)) {
        result.push(cat);
      }
    });

    return result;
  };

  const hierarchicalCategories = buildHierarchicalCategories();

  // Set form values when editing
  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue({
        ...editingProduct,
        categoryId: editingProduct.category?.id || editingProduct.categoryId,
        // Convert date strings to dayjs objects
        saleStart: editingProduct.saleStart
          ? dayjs(editingProduct.saleStart)
          : null,
        saleEnd: editingProduct.saleEnd ? dayjs(editingProduct.saleEnd) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingProduct, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert dayjs objects to ISO strings
      const submitData: PhycoProductCreate = {
        ...values,
        saleStart: values.saleStart
          ? values.saleStart.toISOString()
          : undefined,
        saleEnd: values.saleEnd ? values.saleEnd.toISOString() : undefined,
      };

      onSubmit(submitData);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!editingProduct) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setFieldValue('slug', slug);
    }
  };

  const tabItems = [
    {
      key: '1',
      label: 'Thông tin cơ bản',
      children: (
        <>
          <Form.Item
            name='name'
            label='Tên sản phẩm'
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input
              placeholder='Nhập tên sản phẩm'
              onChange={handleNameChange}
            />
          </Form.Item>

          <Form.Item
            name='slug'
            label='Slug'
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder='ten-san-pham' />
          </Form.Item>

          <Form.Item name='sku' label='SKU'>
            <Input placeholder='Mã sản phẩm (tùy chọn)' />
          </Form.Item>

          <Form.Item
            name='categoryId'
            label='Danh mục'
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select
              placeholder='Chọn danh mục'
              loading={loadingCategories}
              showSearch
              optionFilterProp='children'
              filterOption={(input, option) => {
                const label = option?.children?.toString() || '';
                return label.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {hierarchicalCategories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.parentId && '　└─ '}
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name='shortDescription' label='Mô tả ngắn'>
            <TextArea
              rows={3}
              placeholder='Mô tả ngắn về sản phẩm'
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item name='description' label='Mô tả chi tiết'>
            <TextArea
              rows={6}
              placeholder='Mô tả chi tiết về sản phẩm (công dụng, cách dùng, thành phần...)'
              maxLength={2000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name='virtual'
            label='Sản phẩm ảo'
            valuePropName='checked'
            initialValue={false}
            extra='Sản phẩm không cần vận chuyển (dịch vụ, khóa học...)'
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name='downloadable'
            label='Có thể tải xuống'
            valuePropName='checked'
            initialValue={false}
            extra='Sản phẩm có file tải xuống (ebook, phần mềm...)'
          >
            <Switch />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: 'Giá & Kho',
      children: (
        <>
          <Form.Item
            name='regularPrice'
            label='Giá thường'
            rules={[{ required: true, message: 'Vui lòng nhập giá thường' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder='0'
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) =>
                Number(value!.replace(/\$\s?|(,*)/g, '')) as any
              }
              addonAfter='₫'
            />
          </Form.Item>

          <Form.Item name='salePrice' label='Giá khuyến mãi'>
            <InputNumber
              style={{ width: '100%' }}
              placeholder='0 (để trống nếu không có khuyến mãi)'
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) =>
                Number(value!.replace(/\$\s?|(,*)/g, '')) as any
              }
              addonAfter='₫'
            />
          </Form.Item>

          <Form.Item label='Thời gian giảm giá'>
            <Input.Group compact>
              <Form.Item name='saleStart' noStyle>
                <DatePicker
                  placeholder='Từ ngày'
                  showTime
                  format='DD/MM/YYYY HH:mm'
                  style={{ width: '50%' }}
                />
              </Form.Item>
              <Form.Item name='saleEnd' noStyle>
                <DatePicker
                  placeholder='Đến ngày'
                  showTime
                  format='DD/MM/YYYY HH:mm'
                  style={{ width: '50%' }}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item
            name='manageStock'
            label='Quản lý tồn kho'
            valuePropName='checked'
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue('manageStock') ? (
                <>
                  <Form.Item
                    name='stockQuantity'
                    label='Số lượng tồn kho'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số lượng tồn kho',
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder='0'
                      min={0}
                    />
                  </Form.Item>

                  <Form.Item
                    name='stockStatus'
                    label='Trạng thái kho'
                    initialValue='instock'
                  >
                    <Select>
                      <Option value='instock'>Còn hàng</Option>
                      <Option value='outofstock'>Hết hàng</Option>
                      <Option value='onbackorder'>Đặt trước</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name='backordersAllowed'
                    label='Cho phép đặt trước'
                    valuePropName='checked'
                    initialValue={false}
                    extra='Cho phép khách hàng đặt hàng khi hết hàng'
                  >
                    <Switch />
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name='taxStatus'
            label='Trạng thái thuế'
            initialValue='taxable'
          >
            <Select placeholder='Chọn trạng thái thuế'>
              <Option value='taxable'>Chịu thuế</Option>
              <Option value='shipping'>Chỉ vận chuyển</Option>
              <Option value='none'>Không thuế</Option>
            </Select>
          </Form.Item>

          <Form.Item name='taxClass' label='Loại thuế'>
            <Input placeholder='Nhập loại thuế (tùy chọn)' />
          </Form.Item>
        </>
      ),
    },
    {
      key: '3',
      label: 'Vận chuyển',
      children: (
        <>
          <Form.Item name='weight' label='Trọng lượng (kg)'>
            <Input placeholder='Nhập trọng lượng (vd: 0.5)' />
          </Form.Item>

          <Form.Item label='Kích thước (cm)'>
            <Input.Group compact>
              <Form.Item name='length' noStyle>
                <InputNumber
                  placeholder='Dài'
                  style={{ width: '33.33%' }}
                  min={0}
                />
              </Form.Item>
              <Form.Item name='width' noStyle>
                <InputNumber
                  placeholder='Rộng'
                  style={{ width: '33.33%' }}
                  min={0}
                />
              </Form.Item>
              <Form.Item name='height' noStyle>
                <InputNumber
                  placeholder='Cao'
                  style={{ width: '33.33%' }}
                  min={0}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item name='purchaseNote' label='Ghi chú mua hàng'>
            <TextArea
              rows={3}
              placeholder='Ghi chú hiển thị sau khi khách hàng mua (vd: Hướng dẫn sử dụng, bảo quản...)'
              maxLength={500}
              showCount
            />
          </Form.Item>
        </>
      ),
    },
    {
      key: '4',
      label: 'Hình ảnh',
      children: (
        <>
          <Form.Item
            name='featuredImageUrl'
            label='Ảnh đại diện'
            rules={[
              { type: 'url', message: 'Vui lòng nhập URL hợp lệ' },
              { required: true, message: 'Vui lòng nhập ảnh đại diện' },
            ]}
            extra='Ảnh chính hiển thị trong danh sách sản phẩm'
          >
            <Input
              placeholder='https://res.cloudinary.com/...'
              addonBefore={<LinkOutlined />}
            />
          </Form.Item>

          <Form.Item name='imageAlt' label='Alt text (SEO)'>
            <Input placeholder='Mô tả ngắn cho ảnh đại diện' />
          </Form.Item>

          {/* Featured Image Preview */}
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const imageUrl = getFieldValue('featuredImageUrl');
              return imageUrl ? (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ marginBottom: 8, fontWeight: 500 }}>
                    Xem trước ảnh đại diện:
                  </div>
                  <img
                    src={imageUrl}
                    alt='Featured Preview'
                    style={{
                      maxWidth: 200,
                      maxHeight: 200,
                      objectFit: 'cover',
                      border: '1px solid #d9d9d9',
                      borderRadius: 4,
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/200?text=Invalid+URL';
                    }}
                  />
                </div>
              ) : null;
            }}
          </Form.Item>

          <div
            style={{
              borderTop: '1px solid #f0f0f0',
              paddingTop: 16,
              marginTop: 16,
            }}
          >
            <div style={{ marginBottom: 12, fontWeight: 500 }}>
              Gallery (Ảnh phụ)
            </div>

            <Form.List name='images'>
              {(fields, { add, remove, move }) => (
                <>
                  {fields.map((field, index) => (
                    <div
                      key={field.key}
                      style={{
                        marginBottom: 16,
                        padding: 12,
                        border: '1px solid #d9d9d9',
                        borderRadius: 4,
                        background: '#fafafa',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>
                          Ảnh #{index + 1}
                        </span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {index > 0 && (
                            <Button
                              size='small'
                              onClick={() => move(index, index - 1)}
                            >
                              ↑
                            </Button>
                          )}
                          {index < fields.length - 1 && (
                            <Button
                              size='small'
                              onClick={() => move(index, index + 1)}
                            >
                              ↓
                            </Button>
                          )}
                          <Button
                            size='small'
                            danger
                            onClick={() => remove(field.name)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>

                      <Form.Item
                        {...field}
                        name={[field.name, 'imageUrl']}
                        rules={[
                          { required: true, message: 'Vui lòng nhập URL' },
                          { type: 'url', message: 'URL không hợp lệ' },
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input
                          placeholder='https://res.cloudinary.com/...'
                          addonBefore={<LinkOutlined />}
                        />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'imageAlt']}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder='Alt text (tùy chọn)' />
                      </Form.Item>

                      {/* Image Preview */}
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const images = getFieldValue('images') || [];
                          const imageUrl = images[index]?.imageUrl;
                          return imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={`Preview ${index + 1}`}
                              style={{
                                maxWidth: 150,
                                maxHeight: 150,
                                objectFit: 'cover',
                                border: '1px solid #d9d9d9',
                                borderRadius: 4,
                              }}
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://via.placeholder.com/150?text=Invalid';
                              }}
                            />
                          ) : null;
                        }}
                      </Form.Item>
                    </div>
                  ))}

                  <Button
                    type='dashed'
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm ảnh
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        </>
      ),
    },
    {
      key: '5',
      label: 'Trạng thái',
      children: (
        <>
          <Form.Item
            name='status'
            label='Trạng thái xuất bản'
            initialValue='publish'
          >
            <Select>
              <Option value='publish'>Xuất bản</Option>
              <Option value='draft'>Nháp</Option>
              <Option value='pending'>Chờ duyệt</Option>
              <Option value='private'>Riêng tư</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name='isActive'
            label='Kích hoạt'
            valuePropName='checked'
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item name='type' label='Loại sản phẩm' initialValue='simple'>
            <Select disabled>
              <Option value='simple'>Sản phẩm đơn giản</Option>
              <Option value='variable' disabled>
                Sản phẩm biến thể (Sắp ra mắt)
              </Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Modal
      title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
      open={open}
      onOk={handleSubmit}
      onCancel={handleClose}
      width={800}
      confirmLoading={loading}
      okText={editingProduct ? 'Cập nhật' : 'Tạo mới'}
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical'>
        <Tabs items={tabItems} />
      </Form>
    </Modal>
  );
};

export default ModalPhycoProducts;
