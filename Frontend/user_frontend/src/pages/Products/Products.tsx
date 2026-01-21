import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Breadcrumb,
  ProductSidebar,
  ProductGrid,
  ProductImageModal,
  Pagination,
} from '../../components';
import { productService, categoryService } from '../../services';
import type {
  Product,
  Category,
  FilterState,
  BreadcrumbItem,
} from '../../types';
import '../../styles/pages/Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    categories: searchParams.get('category')
      ? [parseInt(searchParams.get('category')!)]
      : [],
    priceRange: { min: 0, max: 100000000 },
    tags: [],
  });

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState<string>('default');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Sync filters with URL params when they change
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    setFilters((prev) => ({
      ...prev,
      search: searchParam || '',
      categories: categoryParam ? [parseInt(categoryParam)] : [],
    }));
  }, [searchParams]);

  // Fetch products when filters or pagination change
  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage, pageSize, sortBy]);

  // Update URL params when filters change (but not on initial mount)
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.categories.length > 0)
      params.category = filters.categories[0].toString();
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [filters.categories, filters.search, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories({ limit: 100 });
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // When sorting by price, fetch all products to sort properly
      const shouldFetchAll = sortBy === 'price-asc' || sortBy === 'price-desc';

      const response = await productService.getProducts({
        page: shouldFetchAll ? 1 : currentPage,
        limit: shouldFetchAll ? 1000 : pageSize, // Fetch all when sorting
        search: filters.search,
        categoryId:
          filters.categories.length > 0 ? filters.categories[0] : undefined,
        includeChildren: true,
        status: 'publish',
      });

      setProducts(response.data);
      setTotalProducts(response.meta?.total || 0);
      setTotalPages(shouldFetchAll ? 1 : response.meta?.pageCount || 1);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(
        err.response?.data?.error ||
          'Không thể tải sản phẩm. Vui lòng kiểm tra kết nối backend.'
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side sorting (since backend doesn't support it yet)
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.salePrice || a.price || 0;
    const priceB = b.salePrice || b.price || 0;

    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      default:
        return 0;
    }
  });

  const handleImageClick = (images: string[], initialIndex: number) => {
    setModalImages(images);
    setModalInitialIndex(initialIndex);
    setModalVisible(true);
  };

  const handleAddToCart = (productId: number) => {
    console.log('Add to cart:', productId);
    alert(`Đã thêm sản phẩm vào giỏ hàng!`);
  };

  const handleAddToWishlist = (productId: number) => {
    console.log('Add to wishlist:', productId);
    alert(`Đã thêm sản phẩm vào danh sách yêu thích!`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Prepare categories for sidebar
  const categoriesForSidebar = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    count: cat._count?.products || 0,
  }));

  // Get price range from products
  const prices = products
    .map((p) => p.salePrice || p.price || 0)
    .filter((p) => p > 0);
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 100000000,
  };

  // Get selected category for breadcrumb and title
  const selectedCategory =
    filters.categories.length > 0
      ? categories.find((cat) => cat.id === filters.categories[0])
      : null;

  // Dynamic breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'TRANG CHỦ', href: '/' },
    { label: 'SẢN PHẨM', href: '/products' },
  ];

  if (selectedCategory) {
    breadcrumbItems.push({ label: selectedCategory.name.toUpperCase() });
  }

  // Dynamic title
  const pageTitle = selectedCategory ? selectedCategory.name : 'SẢN PHẨM';

  return (
    <div className='products-page'>
      <div className='container'>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className='products-header'>
          <h1 className='products-title'>{pageTitle}</h1>
          <div className='products-controls'>
            <div className='control-group'>
              <label htmlFor='display-count'>Hiển thị</label>
              <select
                id='display-count'
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className='control-select'
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
              </select>
            </div>
            <div className='control-group'>
              <label htmlFor='sort-by'>Sắp xếp</label>
              <select
                id='sort-by'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='control-select'
              >
                <option value='default'>Mặc định</option>
                <option value='price-asc'>Giá: Thấp đến cao</option>
                <option value='price-desc'>Giá: Cao đến thấp</option>
                <option value='name-asc'>Tên: A-Z</option>
                <option value='name-desc'>Tên: Z-A</option>
                <option value='newest'>Mới nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='products-content'>
          {/* Sidebar */}
          <ProductSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categoriesForSidebar}
            priceRange={priceRange}
            tags={[]}
          />

          {/* Products Grid */}
          <div className='products-main'>
            {loading ? (
              <div className='products-loading'>
                <div className='loading-spinner'></div>
                <p>Đang tải sản phẩm...</p>
              </div>
            ) : error ? (
              <div className='products-error'>
                <p>{error}</p>
                <button onClick={fetchProducts} className='btn-retry'>
                  Thử lại
                </button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className='products-empty'>
                <p>Không tìm thấy sản phẩm nào.</p>
                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      categories: [],
                      priceRange: { min: 0, max: 100000000 },
                      tags: [],
                    });
                  }}
                  className='btn-clear-filters'
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className='products-count'>
                  Hiển thị {sortedProducts.length} / {totalProducts} sản phẩm
                </div>
                <ProductGrid
                  products={sortedProducts}
                  onImageClick={handleImageClick}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ProductImageModal
        images={modalImages}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialIndex={modalInitialIndex}
      />
    </div>
  );
};

export default Products;
