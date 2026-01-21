import { motion, AnimatePresence } from 'framer-motion';
import {
  AiOutlineClose,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineDelete,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/useCartStore';
import type { CartItem } from '../../services/cartService';
import '../../styles/components/CartSidebar.css';

const CartSidebar = () => {
  const {
    cart,
    sidebarOpen,
    closeSidebar,
    updateQuantity,
    removeItem,
    loading,
  } = useCartStore();

  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (
      item.product.stockQuantity &&
      newQuantity > item.product.stockQuantity
    ) {
      return;
    }
    await updateQuantity(item.id, newQuantity);
  };

  const handleRemove = async (itemId: number) => {
    await removeItem(itemId);
  };

  const total = cart?.total || 0;
  const itemCount = cart?.count || 0;
  const items = cart?.items || [];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className='cart-sidebar-backdrop'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className='cart-sidebar'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className='cart-sidebar-header'>
              <h2 className='cart-sidebar-title'>GIỎ HÀNG ({itemCount})</h2>
              <button
                className='cart-sidebar-close'
                onClick={closeSidebar}
                aria-label='Đóng giỏ hàng'
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className='cart-sidebar-content'>
              {loading ? (
                <div className='cart-loading'>
                  <div className='loading-spinner'></div>
                  <p>Đang tải...</p>
                </div>
              ) : items.length === 0 ? (
                <div className='cart-empty'>
                  <div className='empty-icon'>🛒</div>
                  <h3>Giỏ hàng trống</h3>
                  <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                  <button
                    className='btn-continue-shopping'
                    onClick={closeSidebar}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div className='cart-items'>
                  {items.map((item) => {
                    const price = item.product.salePrice || item.product.price;

                    return (
                      <motion.div
                        key={item.id}
                        className='cart-item'
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                      >
                        <Link
                          to={`/products/${item.productId}`}
                          className='cart-item-image'
                          onClick={closeSidebar}
                        >
                          <img
                            src={
                              item.product.featuredImageUrl ||
                              'https://via.placeholder.com/80'
                            }
                            alt={item.product.name}
                          />
                        </Link>

                        <div className='cart-item-details'>
                          <Link
                            to={`/products/${item.productId}`}
                            className='cart-item-name'
                            onClick={closeSidebar}
                          >
                            {item.product.name}
                          </Link>
                          <div className='cart-item-price'>
                            {item.quantity} x {price.toLocaleString('vi-VN')}₫
                          </div>

                          <div className='cart-item-actions'>
                            <div className='quantity-controls'>
                              <button
                                className='qty-btn'
                                onClick={() =>
                                  handleQuantityChange(item, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <AiOutlineMinus size={14} />
                              </button>
                              <span className='qty-value'>{item.quantity}</span>
                              <button
                                className='qty-btn'
                                onClick={() =>
                                  handleQuantityChange(item, item.quantity + 1)
                                }
                                disabled={
                                  item.product.stockQuantity
                                    ? item.quantity >=
                                      item.product.stockQuantity
                                    : false
                                }
                              >
                                <AiOutlinePlus size={14} />
                              </button>
                            </div>

                            <button
                              className='btn-remove'
                              onClick={() => handleRemove(item.id)}
                              aria-label='Xóa sản phẩm'
                            >
                              <AiOutlineDelete size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className='cart-sidebar-footer'>
                <div className='cart-total'>
                  <span className='total-label'>TỔNG SỐ PHỤ:</span>
                  <span className='total-amount'>
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <div className='cart-actions'>
                  <Link
                    to='/cart'
                    className='btn-view-cart'
                    onClick={closeSidebar}
                  >
                    XEM GIỎ HÀNG
                  </Link>
                  <Link
                    to='/checkout'
                    className='btn-checkout'
                    onClick={closeSidebar}
                  >
                    THANH TOÁN
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;
