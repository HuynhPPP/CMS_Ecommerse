import { Modal, Button, Table, message, Spin, Tag, Image, Select } from 'antd';
import { useState, useEffect } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import WooCommerceService, {
  type WooCommerceProduct,
} from '../../services/WooCommerceService';
import PhycoProductService from '../../services/PhycoProductService';
import PhycoCategoryService from '../../services/PhycoCategoryService';
import type { PhycoProductCreate } from './Type';
import type { PhycoCategoryType } from '../PhycoCategories/Type';

const { Option } = Select;

type Props = {
  open: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  defaultCategoryId: number;
};

const ModalImportWooCommerce = ({
  open,
  onClose,
  onImportSuccess,
  defaultCategoryId,
}: Props) => {
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [importing, setImporting] = useState(false);

  // Category mapping
  const [phycoCategories, setPhycoCategories] = useState<PhycoCategoryType[]>(
    []
  );
  const [categoryMapping, setCategoryMapping] = useState<
    Record<number, number>
  >({});
  const [wooCommerceCategories, setWooCommerceCategories] = useState<
    Array<{
      id: number;
      name: string;
      slug: string;
    }>
  >([]);

  // Load Phyco categories on mount
  useEffect(() => {
    if (open) {
      loadPhycoCategories();
    }
  }, [open]);

  const loadPhycoCategories = async () => {
    try {
      const response = await PhycoCategoryService.getPhycoCategories({
        page: 1,
        limit: 100,
      });
      setPhycoCategories(response.data);
    } catch (error) {
      console.error('Failed to load Phyco categories:', error);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const result = await WooCommerceService.testConnection();
      setConnectionStatus({
        tested: true,
        success: result.success,
        message: result.message,
      });
      if (result.success) {
        message.success('Kết nối thành công!');
      } else {
        message.error('Kết nối thất bại: ' + result.message);
      }
    } catch (error) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: 'Connection error',
      });
      message.error('Không thể kết nối đến WooCommerce');
    } finally {
      setTesting(false);
    }
  };

  const handleLoadProducts = async () => {
    setLoading(true);
    try {
      const wooProducts = await WooCommerceService.getProducts({
        per_page: 50,
        status: 'publish',
      });
      setProducts(wooProducts);

      // Extract unique categories from products
      const categoriesMap = new Map<
        number,
        { id: number; name: string; slug: string }
      >();
      wooProducts.forEach((product: WooCommerceProduct) => {
        product.categories.forEach(
          (cat: { id: number; name: string; slug: string }) => {
            if (!categoriesMap.has(cat.id)) {
              categoriesMap.set(cat.id, cat);
            }
          }
        );
      });

      const uniqueCategories = Array.from(categoriesMap.values());
      setWooCommerceCategories(uniqueCategories);

      // Initialize category mapping with default category
      const initialMapping: Record<number, number> = {};
      uniqueCategories.forEach((cat) => {
        initialMapping[cat.id] = defaultCategoryId;
      });
      setCategoryMapping(initialMapping);

      message.success(
        `Đã tải ${wooProducts.length} sản phẩm từ ${uniqueCategories.length} danh mục`
      );
    } catch (error: any) {
      message.error('Không thể tải sản phẩm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    // Validate category mapping
    const unmappedCategories = wooCommerceCategories.filter(
      (cat) => !categoryMapping[cat.id]
    );
    if (unmappedCategories.length > 0) {
      message.error(
        `Vui lòng map tất cả danh mục WooCommerce sang Phyco. Thiếu: ${unmappedCategories.map((c) => c.name).join(', ')}`
      );
      return;
    }

    setImporting(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    console.log('Starting import for products:', selectedRowKeys);
    console.log('Category mapping:', categoryMapping);

    for (const productId of selectedRowKeys) {
      const wooProduct = products.find((p) => p.id === productId);
      if (!wooProduct) {
        console.warn(`Product ${productId} not found in list`);
        continue;
      }

      try {
        // Get mapped category ID
        const wooCategoryId = wooProduct.categories[0]?.id;
        const phycoCategoryId = wooCategoryId
          ? categoryMapping[wooCategoryId]
          : defaultCategoryId;

        if (!phycoCategoryId) {
          throw new Error(
            `Category mapping not found for WooCommerce category ${wooCategoryId}`
          );
        }

        // Map WooCommerce product to Phyco product
        const phycoProduct: PhycoProductCreate = {
          name: wooProduct.name,
          slug: wooProduct.slug,
          sku:
            wooProduct.sku && wooProduct.sku.trim() !== ''
              ? wooProduct.sku
              : undefined,
          description: wooProduct.description,
          shortDescription: wooProduct.short_description,
          categoryId: phycoCategoryId, // Use mapped category

          // Improved price parsing - handle empty strings and NaN
          regularPrice:
            wooProduct.regular_price && wooProduct.regular_price !== ''
              ? parseFloat(wooProduct.regular_price)
              : undefined,
          salePrice:
            wooProduct.sale_price && wooProduct.sale_price !== ''
              ? parseFloat(wooProduct.sale_price)
              : undefined,
          price:
            wooProduct.price && wooProduct.price !== ''
              ? parseFloat(wooProduct.price)
              : undefined,

          // Improved stock status - preserve onbackorder
          stockStatus: ['instock', 'outofstock', 'onbackorder'].includes(
            wooProduct.stock_status
          )
            ? (wooProduct.stock_status as
                | 'instock'
                | 'outofstock'
                | 'onbackorder')
            : 'outofstock',
          stockQuantity: wooProduct.stock_quantity || undefined,
          manageStock: wooProduct.manage_stock || false,

          // Images
          featuredImageUrl: wooProduct.images[0]?.src,
          imageAlt: wooProduct.images[0]?.alt || wooProduct.name,
          images: wooProduct.images.slice(1).map((img, index) => ({
            imageUrl: img.src,
            imageAlt: img.alt || `${wooProduct.name} - Image ${index + 2}`,
            order: index,
          })),

          // Status
          status: wooProduct.status === 'publish' ? 'publish' : 'draft',
          isActive: wooProduct.status === 'publish',
        };

        console.log(
          'Importing product:',
          wooProduct.name,
          'to category:',
          phycoCategoryId,
          phycoProduct
        );

        await PhycoProductService.createPhycoProduct(phycoProduct);
        successCount++;
        console.log(`✓ Successfully imported: ${wooProduct.name}`);
      } catch (error: any) {
        console.error('✗ Error importing product:', wooProduct.name, error);
        console.error('Error details:', error.response?.data || error.message);
        errors.push(
          `${wooProduct.name}: ${error.response?.data?.error || error.message}`
        );
        errorCount++;
      }
    }

    setImporting(false);

    if (errorCount > 0) {
      console.error('Import errors:', errors);
      message.error(
        `Import hoàn tất với lỗi! Thành công: ${successCount}, Lỗi: ${errorCount}. Xem console để biết chi tiết.`
      );
    } else {
      message.success(
        `Import hoàn tất! Đã import thành công ${successCount} sản phẩm`
      );
    }

    setSelectedRowKeys([]);
    if (successCount > 0) {
      onImportSuccess();
    }
    onClose();
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'image',
      width: 80,
      render: (images: WooCommerceProduct['images']) => (
        <Image
          src={images[0]?.src || 'https://via.placeholder.com/60'}
          alt={images[0]?.alt}
          width={60}
          height={60}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string, record: WooCommerceProduct) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          {record.sku && (
            <div style={{ fontSize: 12, color: '#999' }}>SKU: {record.sku}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: string, record: WooCommerceProduct) => (
        <div>
          {record.sale_price ? (
            <>
              <div style={{ color: '#ff4d4f', fontWeight: 500 }}>
                {parseFloat(record.sale_price).toLocaleString('vi-VN')}₫
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#999',
                  textDecoration: 'line-through',
                }}
              >
                {parseFloat(record.regular_price).toLocaleString('vi-VN')}₫
              </div>
            </>
          ) : (
            <div style={{ fontWeight: 500 }}>
              {parseFloat(price).toLocaleString('vi-VN')}₫
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock_status',
      key: 'stock',
      width: 100,
      render: (status: string, record: WooCommerceProduct) => (
        <div>
          <Tag color={status === 'instock' ? 'green' : 'red'}>
            {status === 'instock' ? 'Còn hàng' : 'Hết hàng'}
          </Tag>
          {record.stock_quantity && (
            <div style={{ fontSize: 12, marginTop: 4 }}>
              SL: {record.stock_quantity}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Ảnh',
      dataIndex: 'images',
      key: 'imageCount',
      width: 60,
      render: (images: WooCommerceProduct['images']) => (
        <Tag color='blue'>{images.length}</Tag>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys as number[]);
    },
  };

  return (
    <Modal
      title='Import sản phẩm từ WooCommerce'
      open={open}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key='close' onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key='import'
          type='primary'
          onClick={handleImport}
          loading={importing}
          disabled={selectedRowKeys.length === 0}
        >
          Import {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
        </Button>,
      ]}
    >
      {/* Connection Test */}
      <div style={{ marginBottom: 16 }}>
        <Button
          icon={<SyncOutlined />}
          onClick={handleTestConnection}
          loading={testing}
          style={{ marginRight: 8 }}
        >
          Test kết nối
        </Button>

        {connectionStatus && (
          <Tag
            icon={
              connectionStatus.success ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )
            }
            color={connectionStatus.success ? 'success' : 'error'}
          >
            {connectionStatus.message}
          </Tag>
        )}

        {connectionStatus?.success && (
          <Button
            type='primary'
            onClick={handleLoadProducts}
            loading={loading}
            style={{ marginLeft: 8 }}
          ></Button>
        )}
      </div>

      {/* Category Mapping */}
      {wooCommerceCategories.length > 0 && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: '#f0f5ff',
            borderRadius: 4,
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 12 }}>
            Map danh mục WooCommerce → Phyco
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            {wooCommerceCategories.map((wooCat) => (
              <div
                key={wooCat.id}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <div style={{ flex: 1, fontSize: 13 }}>
                  <Tag color='orange'>{wooCat.name}</Tag>
                </div>
                <div style={{ width: 20, textAlign: 'center' }}>→</div>
                <Select
                  style={{ flex: 1 }}
                  value={categoryMapping[wooCat.id]}
                  onChange={(value) => {
                    setCategoryMapping({
                      ...categoryMapping,
                      [wooCat.id]: value,
                    });
                  }}
                  placeholder='Chọn danh mục Phyco'
                >
                  {phycoCategories.map((phycoCat) => (
                    <Option key={phycoCat.id} value={phycoCat.id}>
                      {phycoCat.parentId && '└─ '}
                      {phycoCat.name}
                    </Option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size='large' />
          <div style={{ marginTop: 16 }}>Đang tải sản phẩm...</div>
        </div>
      ) : (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={products}
          rowKey='id'
          pagination={{ pageSize: 10 }}
          scroll={{ y: 400 }}
        />
      )}

      {selectedRowKeys.length > 0 && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f0f5ff',
            borderRadius: 4,
          }}
        >
          <strong>Lưu ý:</strong> Sản phẩm sẽ được import vào danh mục đã map ở
          trên.
        </div>
      )}
    </Modal>
  );
};

export default ModalImportWooCommerce;
