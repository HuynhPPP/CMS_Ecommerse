import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb, ProductImageModal } from '../../components';
import ImageGallery from '../../components/product/ImageGallery';
import QuantitySelector from '../../components/product/QuantitySelector';
import StarRating from '../../components/common/StarRating';
import ProductTabs from '../../components/product/ProductTabs';
import ReviewList from '../../components/product/ReviewList';
import ReviewForm from '../../components/product/ReviewForm';
import { productService } from '../../services';
import { sanitizeText } from '../../utils';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import type { Product, BreadcrumbItem } from '../../types';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import bannerSidebar from '../../assets/Banner/banner_sidebar.png';
import '../../styles/pages/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  // Cart and Wishlist stores
  const { addItem: addToCart, openSidebar: openCartSidebar } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Mock reviews data (since backend doesn't have reviews yet)
  const mockReviews = [
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Sản phẩm rất tốt, chất lượng cao. Tôi rất hài lòng!',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      customerName: 'Trần Thị B',
      rating: 4,
      comment: 'Sản phẩm đúng như mô tả, giao hàng nhanh.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProductById(parseInt(id!));
      // Backend returns product directly in response.data
      setProduct(response.data);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (images: string[], index: number) => {
    setModalImages(images);
    setModalInitialIndex(index);
    setModalVisible(true);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    openCartSidebar();
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    if (isWishlisted) {
      // Find the wishlist item to remove
      const wishlistItem = await useWishlistStore
        .getState()
        .wishlist?.items.find((item) => item.productId === product.id);
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
      }
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleReviewSubmit = (data: any) => {
    console.log('Review submitted:', data);
    alert('Cảm ơn bạn đã đánh giá! Đánh giá của bạn đang chờ phê duyệt.');
  };

  if (loading) {
    return (
      <div className='product-detail product-detail--loading'>
        <div className='container'>
          <div className='loading-spinner'></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='product-detail product-detail--error'>
        <div className='container'>
          <p>{error || 'Không tìm thấy sản phẩm'}</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'TRANG CHỦ', href: '/' },
    { label: 'SẢN PHẨM', href: '/products' },
    { label: product.name },
  ];

  const productImages = [
    product.featuredImageUrl,
    ...(product.images?.map((img) => img.imageUrl) || []),
  ].filter((img): img is string => img !== undefined);

  const displayPrice = product.salePrice || product.price || 0;
  const hasDiscount =
    product.salePrice && product.price && product.salePrice < product.price;

  return (
    <div className='product-detail'>
      <div className='container'>
        <Breadcrumb items={breadcrumbItems} />

        <div className='product-detail__layout'>
          {/* Left Banner */}
          <div className='product-detail__banner product-detail__banner--left'>
            <img src={bannerSidebar} alt='Banner' />
          </div>

          {/* Main Content */}
          <div className='product-detail__content'>
            {/* Product Info Section */}
            <div className='product-detail__main'>
              {/* Gallery */}
              <div className='product-detail__gallery'>
                <ImageGallery
                  images={productImages}
                  productName={product.name}
                  onImageClick={handleImageClick}
                />
              </div>

              {/* Info */}
              <div className='product-detail__info'>
                <h1 className='product-detail__title'>{product.name}</h1>

                {product.shortDescription && (
                  <div className='product-detail__short-desc'>
                    {sanitizeText(product.shortDescription)}
                  </div>
                )}

                <div className='product-detail__rating'>
                  <StarRating
                    rating={4.5}
                    showCount
                    count={mockReviews.length}
                  />
                </div>

                <div className='product-detail__price'>
                  <span className='product-detail__price-current'>
                    {displayPrice.toLocaleString('vi-VN')}₫
                  </span>
                  {hasDiscount && (
                    <span className='product-detail__price-original'>
                      {product.price?.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                <div className='product-detail__actions'>
                  <div className='product-detail__quantity'>
                    <label>Số lượng:</label>
                    <QuantitySelector
                      value={quantity}
                      onChange={setQuantity}
                      max={product.stockQuantity || 999}
                    />
                  </div>

                  <div className='product-detail__buttons'>
                    <button
                      className='product-detail__add-to-cart'
                      onClick={handleAddToCart}
                    >
                      THÊM VÀO GIỎ HÀNG
                    </button>

                    <button
                      className={`product-detail__wishlist ${isWishlisted ? 'wishlisted' : ''}`}
                      onClick={handleToggleWishlist}
                      aria-label={
                        isWishlisted
                          ? 'Xóa khỏi yêu thích'
                          : 'Thêm vào yêu thích'
                      }
                    >
                      {isWishlisted ? (
                        <AiFillHeart size={24} />
                      ) : (
                        <AiOutlineHeart size={24} />
                      )}
                    </button>
                  </div>
                </div>

                {product.category && (
                  <div className='product-detail__meta'>
                    <span className='product-detail__meta-label'>
                      Danh mục:
                    </span>
                    <span className='product-detail__meta-value'>
                      {product.category.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs Section */}
            <ProductTabs
              description={product.description || 'Chưa có mô tả chi tiết'}
              reviews={
                <>
                  <ReviewList
                    reviews={mockReviews}
                    averageRating={4.5}
                    totalReviews={mockReviews.length}
                  />
                  <ReviewForm onSubmit={handleReviewSubmit} />
                </>
              }
            />
          </div>

          {/* Right Banner */}
          <div className='product-detail__banner product-detail__banner--right'>
            <img src={bannerSidebar} alt='Banner' />
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

export default ProductDetail;
