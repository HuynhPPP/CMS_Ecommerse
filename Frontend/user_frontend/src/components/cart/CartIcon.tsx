import { useEffect } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../stores/useCartStore';
import '../../styles/components/CartIcon.css';

const CartIcon = () => {
  const { cart, fetchCart, toggleSidebar } = useCartStore();
  const itemCount = cart?.count || 0;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <motion.button
      className='cart-icon-button'
      onClick={toggleSidebar}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AiOutlineShoppingCart size={28} />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            className='cart-badge'
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

export default CartIcon;
