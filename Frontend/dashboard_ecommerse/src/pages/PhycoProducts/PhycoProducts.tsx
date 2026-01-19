import { useState, useEffect } from 'react';
import { Input, Select, Button, message, Modal } from 'antd';
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import TablePhycoProducts from './TablePhycoProducts';
import ModalPhycoProducts from './ModalPhycoProducts';
import ModalImportWooCommerce from './ModalImportWooCommerce';
import PhycoProductService from '../../services/PhycoProductService';
import PhycoCategoryService from '../../services/PhycoCategoryService';
import type {
  PhycoProductType,
  PhycoProductCreate,
  PhycoProductQuery,
} from './Type';
import type { PhycoCategoryType } from '../PhycoCategories/Type';

const { Search } = Input;
const { Option } = Select;

const PhycoProducts = () => {
  const [products, setProducts] = useState<PhycoProductType[]>([]);
  const [categories, setCategories] = useState<PhycoCategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PhycoProductType | null>(
    null
  );
  const [modalLoading, setModalLoading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<PhycoProductQuery>({
    page: 1,
    limit: 10,
    search: '',
    categoryId: undefined,
    status: undefined,
  });

  const [total, setTotal] = useState(0);

  // Load products
  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Load categories for filter
  useEffect(() => {
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await PhycoProductService.getPhycoProducts(filters);
      setProducts(response.data);
      setTotal(response.meta.total);
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await PhycoCategoryService.getPhycoCategories({
        page: 1,
        limit: 100,
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
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

    // Add any orphaned categories (shouldn't happen, but just in case)
    const addedIds = new Set(result.map((c) => c.id));
    categories.forEach((cat) => {
      if (!addedIds.has(cat.id)) {
        result.push(cat);
      }
    });

    return result;
  };

  const hierarchicalCategories = buildHierarchicalCategories();

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleCategoryFilter = (value: number | undefined) => {
    if (!value) {
      // Clear category filter
      setFilters({
        ...filters,
        categoryId: undefined,
        includeChildren: undefined,
        page: 1,
      });
      return;
    }

    // Check if selected category is a parent (has children)
    const hasChildren = categories.some((c) => c.parentId === value);

    if (hasChildren) {
      // Parent category - include all children
      setFilters({
        ...filters,
        categoryId: value,
        includeChildren: true,
        page: 1,
      });
    } else {
      // Child category or leaf category - filter normally
      setFilters({
        ...filters,
        categoryId: value,
        includeChildren: false,
        page: 1,
      });
    }
  };

  const handleStatusFilter = (value: string | undefined) => {
    setFilters({ ...filters, status: value, page: 1 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters({ ...filters, page, limit: pageSize });
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const product = await PhycoProductService.getPhycoProductById(id);
      setEditingProduct(product);
      setModalOpen(true);
    } catch (error) {
      message.error('Không thể tải thông tin sản phẩm');
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await PhycoProductService.deletePhycoProduct(id);
          message.success('Xóa sản phẩm thành công');
          loadProducts();
        } catch (error: any) {
          if (error.response?.data?.error === 'PRODUCT_HAS_ORDERS') {
            message.error(
              'Không thể xóa sản phẩm vì đã có đơn hàng. Vui lòng ẩn sản phẩm thay vì xóa.'
            );
          } else {
            message.error('Không thể xóa sản phẩm');
          }
        }
      },
    });
  };

  const handleSubmit = async (data: PhycoProductCreate) => {
    try {
      setModalLoading(true);

      // Calculate price if not set
      const submitData = {
        ...data,
        price: data.salePrice || data.regularPrice,
      };

      if (editingProduct) {
        await PhycoProductService.updatePhycoProduct(
          editingProduct.id,
          submitData
        );
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await PhycoProductService.createPhycoProduct(submitData);
        message.success('Tạo sản phẩm thành công');
      }
      setModalOpen(false);
      loadProducts();
    } catch (error: any) {
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error(
          editingProduct
            ? 'Không thể cập nhật sản phẩm'
            : 'Không thể tạo sản phẩm'
        );
      }
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      {/* Filters and Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', flex: 1 }}>
          <Search
            placeholder='Tìm kiếm theo tên hoặc SKU'
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />

          <Select
            placeholder='Lọc theo danh mục'
            allowClear
            style={{ width: 250 }}
            onChange={handleCategoryFilter}
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

          <Select
            placeholder='Lọc theo trạng thái'
            allowClear
            style={{ width: 150 }}
            onChange={handleStatusFilter}
          >
            <Option value='publish'>Xuất bản</Option>
            <Option value='draft'>Nháp</Option>
            <Option value='pending'>Chờ duyệt</Option>
            <Option value='private'>Riêng tư</Option>
          </Select>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            icon={<ImportOutlined />}
            onClick={() => setImportModalOpen(true)}
            size='large'
          >
            Import WooCommerce
          </Button>

          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size='large'
          >
            Tạo sản phẩm mới
          </Button>
        </div>
      </div>

      {/* Table */}
      <TablePhycoProducts
        products={products}
        total={total}
        page={filters.page || 1}
        pageSize={filters.limit || 10}
        loading={loading}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Create/Edit Modal */}
      <ModalPhycoProducts
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        loading={modalLoading}
      />

      {/* Import Modal */}
      <ModalImportWooCommerce
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={loadProducts}
        defaultCategoryId={categories[0]?.id || 1}
      />
    </div>
  );
};

export default PhycoProducts;
