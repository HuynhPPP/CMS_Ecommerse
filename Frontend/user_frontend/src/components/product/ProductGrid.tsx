import type { ProductType } from '../../types';
import ProductCard from './ProductCard';
import '../../styles/components/ProductGrid.css';

interface ProductGridProps {
  products: ProductType[];
  loading?: boolean;
  onImageClick: (images: string[], initialIndex: number) => void;
  onAddToCart?: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
}

const ProductGrid = ({
  products,
  loading = false,
  onImageClick,
  onAddToCart,
  onAddToWishlist,
}: ProductGridProps) => {
  if (loading) {
    return (
      <div className='product-grid-loading'>
        <div className='loading-spinner'></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className='product-grid-empty'>
        <p>Không tìm thấy sản phẩm nào.</p>
      </div>
    );
  }

  return (
    <div className='product-grid'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onImageClick={onImageClick}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
