import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineDelete,
  AiOutlineShoppingCart,
  AiOutlineTag,
} from 'react-icons/ai';
import '../../styles/pages/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    updateQuantity,
    removeItem,
    fetchCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: number) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      await removeItem(itemId);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (error) {
      // Error is already handled in store with toast
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const discount = cart?.discount || 0;
  const total = subtotal - discount;

  if (loading && items.length === 0) {
    return (
      <div className='cart-page'>
        <div className='container'>
          <div className='cart-loading'>
            <div className='loading-spinner'></div>
            <p>Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='cart-page'>
        <div className='container'>
          <div className='cart-empty'>
            <div className='empty-icon'>
              <AiOutlineShoppingCart size={120} />
            </div>
            <h2>Giỏ hàng trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link to='/products' className='btn-continue-shopping'>
              Tiếp tục mua hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='cart-page'>
      <div className='container'>
        {/* Breadcrumbs */}
        <nav className='breadcrumbs'>
          <Link to='/'>Trang chủ</Link>
          <span> › </span>
          <span>Giỏ hàng</span>
        </nav>

        {/* Continue Shopping Button */}
        <div className='cart-header'>
          <Link to='/products' className='btn-back'>
            ← Tiếp tục mua hàng
          </Link>
        </div>

        <div className='cart-content'>
          {/* Cart Table */}
          <div className='cart-table-wrapper'>
            <table className='cart-table'>
              <thead>
                <tr>
                  <th className='product-col'>Sản phẩm</th>
                  <th className='price-col'>Giá</th>
                  <th className='quantity-col'>Số lượng</th>
                  <th className='total-col'>Tổng</th>
                  <th className='remove-col'></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {items.map((item) => {
                    const price =
                      item.product.salePrice || item.product.price || 0;
                    const itemTotal = price * item.quantity;

                    return (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className='product-col'>
                          <div className='product-info'>
                            <Link to={`/products/${item.productId}`}>
                              <img
                                src={
                                  item.product.featuredImageUrl ||
                                  'https://via.placeholder.com/100'
                                }
                                alt={item.product.name}
                                className='product-image'
                              />
                            </Link>
                            <div className='product-details'>
                              <Link
                                to={`/products/${item.productId}`}
                                className='product-name'
                              >
                                {item.product.name}
                              </Link>
                              {item.product.stockStatus === 'instock' ? (
                                <span className='stock-status in-stock'>
                                  Còn hàng
                                </span>
                              ) : (
                                <span className='stock-status out-of-stock'>
                                  Hết hàng
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className='price-col'>
                          <div className='price-wrapper'>
                            {item.product.salePrice && (
                              <span className='original-price'>
                                {item.product.price?.toLocaleString('vi-VN')}₫
                              </span>
                            )}
                            <span className='current-price'>
                              {price.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </td>

                        <td className='quantity-col'>
                          <div className='quantity-controls'>
                            <button
                              className='qty-btn'
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <AiOutlineMinus />
                            </button>
                            <input
                              type='number'
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              min='1'
                              max={item.product.stockQuantity || 999}
                              className='qty-input'
                            />
                            <button
                              className='qty-btn'
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={
                                item.product.stockQuantity
                                  ? item.quantity >= item.product.stockQuantity
                                  : false
                              }
                            >
                              <AiOutlinePlus />
                            </button>
                          </div>
                        </td>

                        <td className='total-col'>
                          <span className='item-total'>
                            {itemTotal.toLocaleString('vi-VN')}₫
                          </span>
                        </td>

                        <td className='remove-col'>
                          <button
                            className='btn-remove'
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label='Xóa sản phẩm'
                          >
                            <AiOutlineDelete />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Update Cart Button */}
            <div className='cart-actions'>
              <button className='btn-update-cart' onClick={fetchCart}>
                Cập nhật giỏ hàng
              </button>
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div className='cart-summary'>
            <h3>Tổng giỏ hàng</h3>

            <div className='summary-row'>
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>

            {discount > 0 && (
              <div className='summary-row discount'>
                <span>Giảm giá:</span>
                <span>-{discount.toLocaleString('vi-VN')}₫</span>
              </div>
            )}

            <div className='summary-row total'>
              <span>Tổng:</span>
              <span>{total.toLocaleString('vi-VN')}₫</span>
            </div>

            {/* Coupon Input */}
            <div className='coupon-section'>
              <div className='coupon-input-wrapper'>
                <AiOutlineTag className='coupon-icon' />
                <input
                  type='text'
                  placeholder='Mã giảm giá'
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className='coupon-input'
                />
                <button
                  className='btn-apply-coupon'
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponCode.trim()}
                >
                  {applyingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
                </button>
              </div>
              {cart?.couponCode && (
                <div className='applied-coupon'>
                  <span>Mã đã áp dụng: {cart.couponCode}</span>
                  <button
                    className='btn-remove-coupon'
                    onClick={handleRemoveCoupon}
                    aria-label='Xóa mã giảm giá'
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <button className='btn-checkout' onClick={handleCheckout}>
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
