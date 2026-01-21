import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  wishlistService,
  type WishlistItem,
  type Wishlist,
} from '../services/wishlistService';
import { toast } from 'react-toastify';

interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  sessionId: string;
  sidebarOpen: boolean;

  // Actions
  fetchWishlist: () => Promise<void>;
  addItem: (productId: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  isInWishlist: (productId: number) => boolean;
}

// Get or create session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('wishlist_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('wishlist_session_id', sessionId);
  }
  return sessionId;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: null,
      loading: false,
      sessionId: getSessionId(),
      sidebarOpen: false,

      fetchWishlist: async () => {
        try {
          set({ loading: true });
          const response = await wishlistService.getWishlist(get().sessionId);
          set({ wishlist: response.data, loading: false });
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          set({ loading: false });
          toast.error('Không thể tải danh sách yêu thích');
        }
      },

      addItem: async (productId: number) => {
        try {
          set({ loading: true });
          await wishlistService.addToWishlist(productId, get().sessionId);
          await get().fetchWishlist();
          toast.success('Đã thêm vào yêu thích!');
        } catch (error: any) {
          console.error('Error adding to wishlist:', error);
          const message =
            error.response?.data?.error || 'Không thể thêm vào yêu thích';
          toast.error(message);
          set({ loading: false });
        }
      },

      removeItem: async (itemId: number) => {
        try {
          await wishlistService.removeFromWishlist(itemId);
          await get().fetchWishlist();
          toast.success('Đã xóa khỏi yêu thích');
        } catch (error) {
          console.error('Error removing from wishlist:', error);
          toast.error('Không thể xóa sản phẩm');
        }
      },

      clearWishlist: async () => {
        try {
          await wishlistService.clearWishlist(get().sessionId);
          set({ wishlist: null });
          toast.success('Đã xóa toàn bộ danh sách yêu thích');
        } catch (error) {
          console.error('Error clearing wishlist:', error);
          toast.error('Không thể xóa danh sách yêu thích');
        }
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      openSidebar: () => set({ sidebarOpen: true }),
      closeSidebar: () => set({ sidebarOpen: false }),

      isInWishlist: (productId: number) => {
        const wishlist = get().wishlist;
        if (!wishlist) return false;
        return wishlist.items.some((item) => item.productId === productId);
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ sessionId: state.sessionId }),
    }
  )
);
