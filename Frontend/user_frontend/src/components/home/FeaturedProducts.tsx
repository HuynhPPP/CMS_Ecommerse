import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import '../../styles/components/FeaturedProducts.css';

// Placeholder product data
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'TPBVSK A-Z Depot bổ sung vitamin và khoáng chất đáng sử dụng hỗ trợ tăng cường sức khỏe, tăng sức đề kháng',
    brand: 'Doppelherz',
    brandLogo: 'DOPPELHERZ',
    price: 395000,
    image: 'product-placeholder',
  },
  {
    id: 2,
    name: 'TPBVSK A-Z Fizz bổ sung vitamin và khoáng chất đáng sử dụng hỗ trợ tăng cường sức khỏe, tăng sức đề kháng',
    brand: 'Doppelherz',
    brandLogo: 'DOPPELHERZ',
    price: 99000,
    image: 'product-placeholder',
  },
  {
    id: 3,
    name: 'TPBVSK Omega-3 + Folic acid + B6 + B12 hỗ trợ sức khỏe tim mạch và não bộ',
    brand: 'Doppelherz',
    brandLogo: 'DOPPELHERZ',
    price: 335000,
    image: 'product-placeholder',
  },
  {
    id: 4,
    name: 'TPBVSK Magnesium+ Calcium+D3 hỗ trợ xương khớp',
    brand: 'Doppelherz',
    brandLogo: 'DOPPELHERZ',
    price: 375000,
    image: 'product-placeholder',
  },
];

const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(FEATURED_PRODUCTS.length - itemsPerPage, prev + 1)
    );
  };

  const visibleProducts = FEATURED_PRODUCTS.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <section className='featured-products'>
      <div className='container'>
        <div className='featured-products-header'>
          <h2 className='featured-products-title'>Sản Phẩm Nổi Bật</h2>
        </div>

        <div className='products-carousel-wrapper'>
          <button
            className='carousel-nav-btn carousel-nav-prev'
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label='Previous products'
          >
            <AiOutlineLeft />
          </button>

          <div className='products-grid'>
            {visibleProducts.map((product) => (
              <div key={product.id} className='product-card'>
                <div className='product-brand-logo'>
                  <span>{product.brandLogo}</span>
                </div>

                <div className='product-image-wrapper'>
                  <div className='product-image-placeholder'>
                    <span>PRODUCT IMAGE</span>
                  </div>
                </div>

                <div className='product-info'>
                  <h3 className='product-name'>{product.name}</h3>
                  <p className='product-price'>
                    {product.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>

                <button className='btn-add-to-cart'>
                  <AiOutlineShoppingCart />
                  <span>THÊM VÀO GIỎ</span>
                </button>
              </div>
            ))}
          </div>

          <button
            className='carousel-nav-btn carousel-nav-next'
            onClick={handleNext}
            disabled={currentIndex >= FEATURED_PRODUCTS.length - itemsPerPage}
            aria-label='Next products'
          >
            <AiOutlineRight />
          </button>
        </div>

        <div className='featured-products-footer'>
          <Link to='/products' className='btn-view-all-products'>
            Xem Tất Cả Sản Phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
