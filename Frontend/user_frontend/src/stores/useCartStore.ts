import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { cartService, type Cart } from '../services/cartService';
import { toast } from 'react-toastify';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  sessionId: string;
  sidebarOpen: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

// Get or create session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      sessionId: getSessionId(),
      sidebarOpen: false,

      fetchCart: async () => {
        try {
          set({ loading: true });
          const response = await cartService.getCart(get().sessionId);
          set({ cart: response.data, loading: false });
        } catch (error) {
          console.error('Error fetching cart:', error);
          set({ loading: false });
          toast.error('Không thể tải giỏ hàng');
        }
      },

      addItem: async (productId: number, quantity: number = 1) => {
        try {
          set({ loading: true });
          await cartService.addToCart(productId, quantity, get().sessionId);
          await get().fetchCart();
          toast.success('Đã thêm vào giỏ hàng!');
        } catch (error: any) {
          console.error('Error adding to cart:', error);
          toast.error(
            error.response?.data?.error || 'Không thể thêm vào giỏ hàng'
          );
          set({ loading: false });
        }
      },

      updateQuantity: async (itemId: number, quantity: number) => {
        try {
          await cartService.updateCartItem(itemId, quantity);
          await get().fetchCart();
        } catch (error) {
          console.error('Error updating quantity:', error);
          toast.error('Không thể cập nhật số lượng');
        }
      },

      removeItem: async (itemId: number) => {
        try {
          await cartService.removeFromCart(itemId);
          await get().fetchCart();
          toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
          console.error('Error removing item:', error);
          toast.error('Không thể xóa sản phẩm');
        }
      },

      clearCart: async () => {
        try {
          await cartService.clearCart(get().sessionId);
          set({ cart: null });
          toast.success('Đã xóa toàn bộ giỏ hàng');
        } catch (error) {
          console.error('Error clearing cart:', error);
          toast.error('Không thể xóa giỏ hàng');
        }
      },

      applyCoupon: async (code: string) => {
        try {
          const response = await cartService.applyCoupon(code, get().sessionId);
          set({ cart: response.data });
          toast.success('Áp dụng mã giảm giá thành công!');
        } catch (error: any) {
          console.error('Error applying coupon:', error);
          const errorMessage =
            error.response?.data?.error || 'Không thể áp dụng mã giảm giá';
          toast.error(errorMessage);
          throw error; // Re-throw to handle in component
        }
      },

      removeCoupon: async () => {
        try {
          await cartService.removeCoupon(get().sessionId);
          await get().fetchCart();
          toast.success('Đã xóa mã giảm giá');
        } catch (error: any) {
          console.error('Error removing coupon:', error);
          toast.error('Không thể xóa mã giảm giá');
        }
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      openSidebar: () => set({ sidebarOpen: true }),
      closeSidebar: () => set({ sidebarOpen: false }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ sessionId: state.sessionId }),
    }
  )
);
