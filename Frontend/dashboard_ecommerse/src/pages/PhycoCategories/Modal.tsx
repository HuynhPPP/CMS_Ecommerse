import AppModal from '../../components/common/AppModal';
import { Form, Input, message, Select, Switch } from 'antd';
import PhycoCategoryService from '../../services/PhycoCategoryService';
import { useEffect, useState } from 'react';
import type { PhycoCategoryType } from './Type';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryId?: number;
};

const ModalPhycoCategories = ({
  open,
  onClose,
  onSuccess,
  categoryId,
}: Props) => {
  const [form] = Form.useForm();
  const [parentCategories, setParentCategories] = useState<PhycoCategoryType[]>(
    []
  );

  const fetchParentCategories = async () => {
    try {
      const res = await PhycoCategoryService.getPhycoCategories({
        page: 1,
        limit: 100,
      });
      // Filter only parent categories (no parentId) and exclude current category when editing
      const parents = res.data.filter(
        (cat) => !cat.parentId && cat.id !== categoryId
      );
      setParentCategories(parents);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (categoryId) {
        await PhycoCategoryService.updatePhycoCategory(categoryId, values);
        message.success('Cập nhật danh mục Phyco thành công');
      } else {
        await PhycoCategoryService.createPhycoCategory(values);
        message.success('Tạo danh mục Phyco thành công');
      }
      form.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  useEffect(() => {
    if (open) {
      fetchParentCategories();
    }
  }, [open]);

  useEffect(() => {
    if (categoryId) {
      PhycoCategoryService.getPhycoCategoryById(categoryId).then((res) => {
        form.setFieldsValue(res.data);
      });
    } else {
      form.resetFields();
    }
  }, [categoryId]);

  return (
    <AppModal
      title={categoryId ? 'Chỉnh sửa danh mục Phyco' : 'Tạo danh mục Phyco mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText={categoryId ? 'Cập nhật' : 'Tạo'}
      cancelText='Hủy'
      bg='#FFC0CB'
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
          <Input placeholder='Ví dụ: bach-hoa-online' />
        </Form.Item>

        <Form.Item name='parentId' label='Danh mục cha'>
          <Select
            placeholder='Chọn danh mục cha (tùy chọn)'
            allowClear
            options={parentCategories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }))}
          />
        </Form.Item>

        <Form.Item name='description' label='Mô tả'>
          <Input.TextArea
            placeholder='Nhập mô tả danh mục'
            rows={3}
            maxLength={500}
          />
        </Form.Item>

        <Form.Item name='isActive' label='Trạng thái' valuePropName='checked'>
          <Switch defaultChecked={true} />
        </Form.Item>
      </Form>
    </AppModal>
  );
};

export default ModalPhycoCategories;
