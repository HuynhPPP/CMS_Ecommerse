import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type ProductType } from '../../types';
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
} from 'react-icons/ai';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import '../../styles/components/ProductCard.css';

interface ProductCardProps {
  product: ProductType;
  onImageClick: (images: string[], initialIndex: number) => void;
}

const ProductCard = ({ product, onImageClick }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { addItem: addToCart, openSidebar: openCartSidebar } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const allImages = [
      product.featuredImageUrl,
      ...(product.images?.map((img) => img.imageUrl) || []),
    ].filter((img): img is string => img !== undefined);
    onImageClick(allImages, 0);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, 1);
    openCartSidebar();
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isWishlisted) {
      await addToWishlist(product.id);
    }
  };

  const displayPrice = product.salePrice || product.price || 0;
  const hasDiscount =
    product.salePrice && product.price && product.salePrice < product.price;

  return (
    <Link to={`/products/${product.id}`} className='product-card-link'>
      <article className='product-card'>
        {/* Brand Logo */}
        {product.brand && (
          <div className='product-brand'>
            <span className='brand-text'>{product.brand}</span>
          </div>
        )}

        {/* Hover Action Buttons */}
        <div className='product-actions'>
          <button
            className='action-btn action-cart'
            onClick={handleAddToCart}
            aria-label='Thêm vào giỏ hàng'
            title='Thêm vào giỏ hàng'
          >
            <AiOutlineShoppingCart size={20} />
          </button>
          <button
            className='action-btn action-wishlist'
            onClick={handleAddToWishlist}
            aria-label='Thêm vào yêu thích'
            title='Thêm vào yêu thích'
          >
            {isWishlisted ? (
              <AiFillHeart size={20} style={{ color: '#e74c3c' }} />
            ) : (
              <AiOutlineHeart size={20} />
            )}
          </button>
        </div>

        {/* Product Image with Podium Effect */}
        <div className='product-image-wrapper' onClick={handleImageClick}>
          <div className='product-podium'>
            <img
              src={
                imageError
                  ? 'https://via.placeholder.com/300?text=No+Image'
                  : product.featuredImageUrl
              }
              alt={product.imageAlt || product.name}
              className='product-image'
              loading='lazy'
              onError={() => setImageError(true)}
            />
          </div>

          {/* Image Count Badge */}
          {product.images && product.images.length > 0 && (
            <div className='image-count-badge'>+{product.images.length}</div>
          )}

          {/* Likes Badge */}
          {product.likes !== undefined && product.likes > 0 && (
            <div className='likes-badge'>{product.likes} ❤️ /Tặp</div>
          )}
        </div>

        {/* Product Info */}
        <div className='product-info'>
          <h3 className='product-name' title={product.name}>
            {product.name}
          </h3>

          <div className='product-price'>
            <span className='price-current'>
              {displayPrice?.toLocaleString('vi-VN')}₫
            </span>
            {hasDiscount && (
              <span className='price-original'>
                {product.price?.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button className='btn-add-to-cart' onClick={handleAddToCart}>
            THÊM VÀO GIỎ
          </button>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
