import api from './api';

export interface WishlistItem {
  id: number;
  wishlistId: number;
  productId: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    featuredImageUrl?: string;
    stockStatus: string;
  };
}

export interface Wishlist {
  id: number;
  items: WishlistItem[];
  count: number;
}

export const wishlistService = {
  /**
   * Get wishlist
   */
  async getWishlist(sessionId?: string) {
    const response = await api.get('/api/phyco/wishlist', {
      params: { sessionId },
    });
    return response.data;
  },

  /**
   * Add item to wishlist
   */
  async addToWishlist(productId: number, sessionId?: string) {
    const response = await api.post('/api/phyco/wishlist/items', {
      productId,
      sessionId,
    });
    return response.data;
  },

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(itemId: number) {
    const response = await api.delete(`/api/phyco/wishlist/items/${itemId}`);
    return response.data;
  },

  /**
   * Clear wishlist
   */
  async clearWishlist(sessionId?: string) {
    const response = await api.delete('/api/phyco/wishlist', {
      params: { sessionId },
    });
    return response.data;
  },
};

export default wishlistService;
