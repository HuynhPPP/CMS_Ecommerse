import api from './api';

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    featuredImageUrl?: string;
    stockStatus: string;
    stockQuantity?: number;
  };
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  count: number;
  discount?: number;
  couponCode?: string;
}

export const cartService = {
  /**
   * Get cart
   */
  async getCart(sessionId?: string) {
    const response = await api.get('/api/phyco/cart', {
      params: { sessionId },
    });
    return response.data;
  },

  /**
   * Add item to cart
   */
  async addToCart(productId: number, quantity: number = 1, sessionId?: string) {
    const response = await api.post('/api/phyco/cart/items', {
      productId,
      quantity,
      sessionId,
    });
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId: number, quantity: number) {
    const response = await api.put(`/api/phyco/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: number) {
    const response = await api.delete(`/api/phyco/cart/items/${itemId}`);
    return response.data;
  },

  /**
   * Clear cart
   */
  async clearCart(sessionId?: string) {
    const response = await api.delete('/api/phyco/cart', {
      params: { sessionId },
    });
    return response.data;
  },

  /**
   * Apply coupon code
   */
  async applyCoupon(code: string, sessionId?: string) {
    const response = await api.post('/api/phyco/cart/apply-coupon', {
      code,
      sessionId,
    });
    return response.data;
  },

  /**
   * Remove coupon code
   */
  async removeCoupon(sessionId?: string) {
    const response = await api.delete('/api/phyco/cart/remove-coupon', {
      params: { sessionId },
    });
    return response.data;
  },
};

export default cartService;
