import type { ProductType } from './Type';
import {
  App,
  Button,
  Col,
  Collapse,
  ColorPicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import type { CategoryType } from '../Categories/Type';
import { ThemeContext } from '../../contexts/ThemeContext';
import AppModal from '../../components/common/AppModal';
import CategoryService from '../../services/CategoryService';
import ProductService from '../../services/ProductService';
import UploadImage from '../../components/common/UploadImage';
import UploadService from '../../services/UploadService';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  product?: ProductType | null;
};

const ProductModal = ({ isOpen, onCancel, onSuccess, product }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const colors = Form.useWatch('colors', form);

  const handleOk = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      // --- LOGIC DELAYED UPLOAD ---
      // Duyệt qua tất cả ảnh để tìm các file chưa upload
      const updatedColors = await Promise.all(
        (values.colors || []).map(async (color: any) => {
          const updatedImages = await Promise.all(
            (color.images || []).map(async (img: any) => {
              // Nếu có file vật lý (chưa upload)
              if (img.imageUrl?.file) {
                const uploadRes = await UploadService.uploadSingle(img.imageUrl.file);
                return {
                  imageUrl: uploadRes.imageUrl,
                  publicId: uploadRes.publicId,
                };
              }
              // Nếu là ảnh cũ (đã có link hoặc object đã upload)
              return {
                imageUrl: img.imageUrl?.imageUrl || img.imageUrl,
                publicId: img.imageUrl?.publicId || img.publicId,
              };
            })
          );
          return { ...color, images: updatedImages };
        })
      );

      const finalValues = { ...values, colors: updatedColors };
      // ----------------------------

      if (product) {
        await ProductService.updateProduct(product.id, finalValues);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await ProductService.createProduct(finalValues);
        message.success('Tạo sản phẩm thành công');
      }

      form.resetFields();
      onSuccess?.();
      onCancel();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Có lỗi xảy ra';
      message.error(errorMsg);
      console.error('Full error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.getCategories({
        isActive: true,
        limit: 100,
        page: 1,
      });
      setCategories(res.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (product) {
        // Chuẩn hóa dữ liệu ảnh từ API (string) sang Object cho Component Upload
        const normalizedProduct = {
          ...product,
          colors: product.colors?.map((color) => ({
            ...color,
            images: color.images?.map((img) => ({
              ...img,
              imageUrl: {
                imageUrl: img.imageUrl,
                publicId: img.publicId,
              },
            })),
          })),
        };
        form.setFieldsValue(normalizedProduct);
      } else {
        form.setFieldsValue({
          name: '',
          description: '',
          categoryId: undefined,
          colors: [
            {
              color: '',
              colorCode: '#000',
              images: [],
              variants: [
                { size: 'S', price: 0, stock: 0 },
                { size: 'M', price: 0, stock: 0 },
                { size: 'L', price: 0, stock: 0 },
                { size: 'XL', price: 0, stock: 0 },
              ],
            },
          ],
        });
      }
    }
  }, [isOpen, product, form]);

  return (
    <>
      <AppModal
        title={product ? 'Cập nhật sản phẩm' : 'Tạo mới sản phẩm'}
        open={isOpen}
        onCancel={onCancel}
        onOk={handleOk}
        okText={product ? 'Cập nhật' : 'Tạo'}
        cancelText='Hủy'
        confirmLoading={submitting}
        width={900}
      >
        <Form form={form} layout='vertical'>
          {/*Basic information section */}
          <div>
            <Typography.Title level={5}>Thông tin chung</Typography.Title>
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name='name'
                  label='Tên sản phẩm'
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên sản phẩm' },
                  ]}
                >
                  <Input placeholder='Nhập tên sản phẩm' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='categoryId'
                  label='Danh mục'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn danh mục',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder='Chọn danh mục'
                    allowClear
                    notFoundContent='Không tìm thấy danh mục'
                    loading={loading}
                    options={categories.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name='description'
                  label='Mô tả'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mô tả chi tiết sản phẩm',
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder='Nhập mô tả chi tiết sản phẩm'
                    rows={4}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          <Typography.Title level={5}>
            Biến thể sản phẩm (Màu sắc & Size)
          </Typography.Title>

          <Form.List name={'colors'}>
            {(fields, { add, remove }) => (
              <div
                style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}
              >
                <Collapse
                  defaultActiveKey={fields.map((f) => f.key)}
                  items={fields.map((field, index) => ({
                    key: field.key,
                    label: (
                      <Space>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background:
                              colors?.[index]?.colorCode ||
                              (typeof colors?.[index]?.colorCode === 'string'
                                ? colors?.[index]?.colorCode
                                : '#000'),
                            border: '1px solid #ddd',
                          }}
                        />
                        <span
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          {colors?.[index]?.color || `Màu sắc ${index + 1}`}
                        </span>
                      </Space>
                    ),
                    extra: (
                      <DeleteOutlined
                        onClick={(
                          e: React.MouseEvent<HTMLSpanElement, MouseEvent>
                        ) => {
                          e.stopPropagation();
                          remove(field.name);
                        }}
                        style={{ color: '#ff4d4f' }}
                      />
                    ),
                    children: (
                      <div key={field.key}>
                        <Row gutter={16} align='middle'>
                          <Col span={12}>
                            <Form.Item
                              name={[field.name, 'color']}
                              label='Tên màu'
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập tên màu',
                                },
                              ]}
                              style={{
                                marginBottom: 12,
                              }}
                            >
                              <Input placeholder='Ví dụ: đen, trắng, xanh,...' />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={[field.name, 'colorCode']}
                              label='Mã màu(Hex)'
                              style={{
                                marginBottom: 12,
                              }}
                              getValueFromEvent={(color) => color.toHexString()}
                            >
                              <ColorPicker showText />
                            </Form.Item>
                          </Col>
                        </Row>

                        {/* Images */}
                        <div
                          style={{
                            background: isDark ? '#f1f1f1f' : '#fafafa',
                            padding: 12,
                            borderRadius: 8,
                          }}
                        >
                          <Typography.Text
                            strong
                            style={{
                              display: 'block',
                              marginBottom: 12,
                            }}
                          >
                            Hình ảnh sản phẩm
                          </Typography.Text>

                          <Form.List name={[field.name, 'images']}>
                            {(imageFields, imageOptions) => (
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 16,
                                }}
                              >
                                {imageFields.map((imageField) => (
                                  <div
                                    key={imageField.key}
                                    style={{
                                      position: 'relative',
                                    }}
                                  >
                                    <Form.Item
                                      {...imageField}
                                      name={[imageField.name, 'imageUrl']}
                                      rules={[
                                        {
                                          required: true,
                                          message: 'Vui lòng upload ảnh',
                                        },
                                      ]}
                                      style={{ marginBottom: 0 }}
                                    >
                                      <UploadImage />
                                    </Form.Item>
                                    <Button
                                      type='primary'
                                      danger
                                      shape='circle'
                                      size='small'
                                      icon={<MinusCircleOutlined />}
                                      onClick={() => {
                                        imageOptions.remove(imageField.name);
                                      }}
                                      style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        zIndex: 1,
                                      }}
                                    />
                                  </div>
                                ))}
                                <Upload
                                  multiple
                                  showUploadList={false}
                                  beforeUpload={(file) => {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                      imageOptions.add({
                                        imageUrl: {
                                          imageUrl: e.target?.result as string,
                                          file: file,
                                        },
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                    return false; // Chặn upload tự động
                                  }}
                                  accept='image/*'
                                >
                                  <Button
                                    type='dashed'
                                    icon={<PlusOutlined />}
                                    style={{
                                      width: 102,
                                      height: 102,
                                    }}
                                  >
                                    Thêm ảnh
                                  </Button>
                                </Upload>
                              </div>
                            )}
                          </Form.List>
                        </div>

                        {/* Variants table */}
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: 8,
                              marginTop: 8,
                            }}
                          >
                            <Typography.Text strong>
                              Danh sách Size & Giá{' '}
                            </Typography.Text>
                          </div>

                          <div
                            style={{
                              background: isDark ? '#141414' : '#fff',
                              border: `1px solid ${isDark ? '#303030' : '#f0f0f0'
                                }`,
                              borderRadius: 8,
                              padding: 8,
                            }}
                          >
                            <Row
                              gutter={8}
                              style={{
                                marginBottom: 8,
                                fontWeight: 500,
                                color: '#666',
                              }}
                            >
                              <Col span={8}>Size</Col>
                              <Col span={8}>Giá bán (VNĐ)</Col>
                              <Col span={8}>Tồn kho</Col>
                              <Col span={2} />
                            </Row>

                            <Form.List name={[field.name, 'variants']}>
                              {(subFields, subOption) => (
                                <>
                                  {subFields.map((subField) => (
                                    <Row
                                      key={subField.key}
                                      gutter={8}
                                      style={{
                                        marginBottom: 8,
                                      }}
                                      align={'middle'}
                                    >
                                      <Col span={6}>
                                        <Form.Item
                                          {...subField}
                                          name={[subField.name, 'size']}
                                          rules={[
                                            {
                                              required: true,
                                              message: 'Vui lòng nhập size',
                                            },
                                          ]}
                                        >
                                          <Input placeholder='S, M, L...' />
                                        </Form.Item>
                                      </Col>

                                      <Col span={8}>
                                        <Form.Item
                                          {...subField}
                                          name={[subField.name, 'price']}
                                          rules={[
                                            {
                                              required: true,
                                              message: 'Vui lòng nhập giá',
                                            },
                                          ]}
                                        >
                                          <InputNumber
                                            style={{ width: '100%' }}
                                            formatter={(value) =>
                                              `${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ','
                                              )
                                            }
                                            parser={(value) =>
                                              value!.replace(
                                                /\$\s?|(,*)/g,
                                                ''
                                              ) as unknown as string
                                            }
                                            placeholder='0'
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col span={8}>
                                        <Form.Item
                                          {...subField}
                                          name={[subField.name, 'stock']}
                                          rules={[
                                            {
                                              required: true,
                                              message: 'Vui lòng nhập tồn kho',
                                            },
                                          ]}
                                        >
                                          <InputNumber
                                            style={{ width: '100%' }}
                                            formatter={(value) =>
                                              `${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ','
                                              )
                                            }
                                            parser={(value) =>
                                              value!.replace(
                                                /\$\s?|(,*)/g,
                                                ''
                                              ) as unknown as string
                                            }
                                            placeholder='0'
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col span={2}>
                                        <Button
                                          type='text'
                                          danger
                                          icon={<MinusCircleOutlined />}
                                          onClick={() => {
                                            subOption.remove(subField.name);
                                          }}
                                          style={{
                                            marginBottom: 20,
                                          }}
                                        />
                                      </Col>
                                    </Row>
                                  ))}

                                  <Button
                                    type='dashed'
                                    onClick={() => {
                                      subOption.add({});
                                    }}
                                    icon={<PlusOutlined />}
                                    style={{
                                      marginBottom: 0,
                                      width: '100%',
                                    }}
                                  >
                                    Thêm biến thể
                                  </Button>
                                </>
                              )}
                            </Form.List>
                          </div>
                        </div>
                      </div>
                    ),
                  }))}
                />

                <Button
                  type='primary'
                  onClick={() => {
                    add({
                      color: '',
                      colorCode: '#000',
                      images: [],
                      variants: [
                        { size: 'S', price: 0, stock: 0 },
                        { size: 'M', price: 0, stock: 0 },
                        { size: 'L', price: 0, stock: 0 },
                        { size: 'XL', price: 0, stock: 0 },
                      ],
                    });
                  }}
                  icon={<PlusOutlined />}
                  size='large'
                >
                  Thêm màu sắc mới
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      </AppModal>
    </>
  );
};

export default ProductModal;
