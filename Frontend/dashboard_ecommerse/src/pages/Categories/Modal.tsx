import AppModal from '../../components/common/AppModal';
import { Form, Input, message, Switch } from 'antd';
import CategoryService from '../../services/CategoryService';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryId?: number;
};

const ModalCategories = ({ open, onClose, onSuccess, categoryId }: Props) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (categoryId) {
        await CategoryService.updateCategory(categoryId, values);
        message.success('Cập nhật danh mục thành công');
      } else {
        await CategoryService.createCategory(values);
        message.success('Tạo danh mục thành công');
      }
      form.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      message.error('Cập nhật danh mục thất bại');
    }
  };

  useEffect(() => {
    if (categoryId) {
      CategoryService.getCategoryById(categoryId).then((res) => {
        form.setFieldsValue(res.data);
      });
    } else {
      form.resetFields();
    }
  }, [categoryId]);

  return (
    <AppModal
      title={categoryId ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText={categoryId ? 'Cập nhật' : 'Tạo'}
      cancelText='Hủy'
      bg={categoryId ? '#FFC0CB' : '#FFC0CB'}
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='name'
          label='Tên danh mục'
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
        >
          <Input placeholder='Nhập tên danh mục' />
        </Form.Item>

        <Form.Item
          name='slug'
          label='Slug'
          rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
        >
          <Input placeholder='Ví dụ thoi-trang' />
        </Form.Item>

        <Form.Item name='isActive' label='Trạng thái'>
          <Switch defaultChecked={true} />
        </Form.Item>
      </Form>
    </AppModal>
  );
};

export default ModalCategories;
