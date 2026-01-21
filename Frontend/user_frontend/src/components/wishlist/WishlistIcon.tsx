import { useEffect } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '../../stores/useWishlistStore';
import '../../styles/components/WishlistIcon.css';

const WishlistIcon = () => {
  const { wishlist, fetchWishlist, toggleSidebar } = useWishlistStore();
  const itemCount = wishlist?.count || 0;

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <motion.button
      className='wishlist-icon-button'
      onClick={toggleSidebar}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {itemCount > 0 ? (
        <AiFillHeart size={28} className='heart-filled' />
      ) : (
        <AiOutlineHeart size={28} />
      )}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            className='wishlist-badge'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            key={itemCount}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default WishlistIcon;
