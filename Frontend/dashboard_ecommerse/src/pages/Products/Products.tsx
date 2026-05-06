import { useContext, useEffect, useState } from 'react';
import type { FilterConfig } from '../../components/common/AppFilter';
import CategoryService from '../../services/CategoryService';
import type { CategoryType } from '../Categories/Type';
import AppFilter from '../../components/common/AppFilter';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Button, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProducsTable from './ProducsTable';
import ProductModal from './ProductModal';
import ProductService from '../../services/ProductService';
import type { ProductType } from './Type';

const Products = () => {
  const { message, modal } = App.useApp();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const { isDark } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
    categoryId: undefined,
  });
  const [total, setTotal] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getCategories({
        isActive: true,
        limit: 100,
        page: 1,
      });
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await ProductService.getProducts(filter);
      setProducts(res.data || []);
      setTotal(res.meta?.total || 0);
    } catch (error) {
      message.error('Lỗi khi lấy danh sách sản phẩm');
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (values: Record<string, any>) => {
    setFilter((prev) => ({
      ...prev,
      page: 1,
      search: values.search || '',
      categoryId: values.categoryId === '' ? undefined : values.categoryId,
    }));
  };

  const handlePageChange = (pagination: any) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const handleEditProduct = (product: ProductType) => {
    setIsDuplicate(false);
    setEditingProduct(product);
    setOpenModal(true);
  };

  const handleDuplicateProduct = (product: ProductType) => {
    setIsDuplicate(true);
    // Thêm hậu tố (Copy) để người dùng dễ phân biệt
    setEditingProduct({
      ...product,
      name: `${product.name} (Copy)`,
    });
    setOpenModal(true);
  };

  const handleDeleteProduct = (id: number) => {
    modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này không? Thao tác này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await ProductService.deleteProduct(id);
          message.success('Xóa sản phẩm thành công');
          fetchProducts();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Xóa sản phẩm thất bại');
        }
      },
    });
  };

  const filterConfig: FilterConfig[] = [
    {
      type: 'input' as const,
      name: 'search',
      label: 'Tìm kiếm',
      placeholder: 'Tìm kiếm sản phẩm...',
    },
    {
      type: 'select' as const,
      name: 'categoryId',
      label: 'Danh mục',
      placeholder: 'Chọn danh mục',
      options: [
        { label: 'Tất cả danh mục', value: '' },
        ...categories.map((category) => ({
          label: category.name,
          value: category.id,
        })),
      ],
    },
  ];

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
    setIsDuplicate(false);
  };

  const handleSuccessModal = () => {
    fetchProducts();
    setOpenModal(false);
    setEditingProduct(null);
    setIsDuplicate(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 8,
        background: isDark ? '#262626' : '#fff',
        boxShadow: isDark
          ? '0 2px 8px rgba(0, 0, 0, 0.6)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
          alignItems: 'flex-end',
        }}
      >
        <AppFilter
          filters={filterConfig}
          onChange={handleFilterChange}
        />

        <Button 
          type='primary' 
          onClick={() => {
            setIsDuplicate(false);
            setEditingProduct(null);
            setOpenModal(true);
          }}
          size='large'
        >
          <PlusOutlined />
          Tạo sản phẩm mới
        </Button>
      </div>

      <ProducsTable 
        products={products} 
        loading={isLoading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onDuplicate={handleDuplicateProduct}
        pagination={{
          total,
          current: filter.page,
          pageSize: filter.limit,
          showSizeChanger: true,
        }}
        onChange={handlePageChange}
      />

      <ProductModal
        isOpen={openModal}
        onCancel={handleCloseModal}
        onSuccess={handleSuccessModal}
        product={editingProduct}
        isDuplicate={isDuplicate}
      />
    </div>
  );
};

export default Products;
