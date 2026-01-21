import { motion, AnimatePresence } from 'framer-motion';
import {
  AiOutlineClose,
  AiOutlineShoppingCart,
  AiOutlineDelete,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCartStore } from '../../stores/useCartStore';
import type { WishlistItem } from '../../services/wishlistService';
import '../../styles/components/WishlistSidebar.css';

const WishlistSidebar = () => {
  const { wishlist, sidebarOpen, closeSidebar, removeItem, loading } =
    useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleMoveToCart = async (item: WishlistItem) => {
    await addToCart(item.productId, 1);
    await removeItem(item.id);
  };

  const handleRemove = async (itemId: number) => {
    await removeItem(itemId);
  };

  const itemCount = wishlist?.count || 0;
  const items = wishlist?.items || [];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className='wishlist-sidebar-backdrop'
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
            className='wishlist-sidebar'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className='wishlist-sidebar-header'>
              <h2 className='wishlist-sidebar-title'>
                YÊU THÍCH ({itemCount})
              </h2>
              <button
                className='wishlist-sidebar-close'
                onClick={closeSidebar}
                aria-label='Đóng danh sách yêu thích'
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className='wishlist-sidebar-content'>
              {loading ? (
                <div className='wishlist-loading'>
                  <div className='loading-spinner'></div>
                  <p>Đang tải...</p>
                </div>
              ) : items.length === 0 ? (
                <div className='wishlist-empty'>
                  <div className='empty-icon'>❤️</div>
                  <h3>Chưa có sản phẩm yêu thích</h3>
                  <p>Hãy thêm sản phẩm yêu thích để dễ dàng tìm lại sau này</p>
                  <button
                    className='btn-continue-shopping'
                    onClick={closeSidebar}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div className='wishlist-items'>
                  {items.map((item) => {
                    const price = item.product.salePrice || item.product.price;

                    return (
                      <motion.div
                        key={item.id}
                        className='wishlist-item'
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                      >
                        <Link
                          to={`/products/${item.productId}`}
                          className='wishlist-item-image'
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

                        <div className='wishlist-item-details'>
                          <Link
                            to={`/products/${item.productId}`}
                            className='wishlist-item-name'
                            onClick={closeSidebar}
                          >
                            {item.product.name}
                          </Link>
                          <div className='wishlist-item-price'>
                            {price.toLocaleString('vi-VN')}₫
                          </div>
                          <div className='wishlist-item-stock'>
                            {item.product.stockStatus === 'instock' ? (
                              <span className='in-stock'>✓ Còn hàng</span>
                            ) : (
                              <span className='out-of-stock'>✗ Hết hàng</span>
                            )}
                          </div>

                          <div className='wishlist-item-actions'>
                            <button
                              className='btn-add-to-cart'
                              onClick={() => handleMoveToCart(item)}
                              disabled={item.product.stockStatus !== 'instock'}
                            >
                              <AiOutlineShoppingCart size={16} />
                              Thêm vào giỏ
                            </button>
                            <button
                              className='btn-remove'
                              onClick={() => handleRemove(item.id)}
                              aria-label='Xóa khỏi yêu thích'
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WishlistSidebar;
