import { createContext, useEffect, useState } from 'react';
import { getCart } from '@/apis/cartService';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

export const SideBarContext = createContext();

export const SideBarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('');
  const [listProductCart, setListProductCart] = useState([]);
  const [isLoadingProductCart, setIsLoadingProductCart] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const userId = Cookies.get('userId');

  const handleGetListProductsCart = (id, type) => {
    if (id && type === 'cart') {
      setIsLoadingProductCart(true);
      getCart(id)
        .then((res) => {
          // res chính là đối tượng cart từ Backend { items: [...] }
          const items = res.items || [];
          const formattedItems = items.map((item) => {
            const product = item.variant.color.product;
            const color = item.variant.color;
            return {
              cartItemId: item.id,
              productVariantId: item.variant.id, // Bổ sung ID biến thể
              id: item.variant.id, // Alias để Checkout.jsx dễ lấy
              productId: product.id,
              name: product.name,
              price: item.variant.price,
              quantity: item.quantity,
              size: item.variant.size,
              color: color.color,
              colorId: color.id,
              images: color.images.map(img => img.imageUrl),
              sku: `SKU-${product.id}-${item.variant.id}`,
              total: item.variant.price * item.quantity
            };
          });
          setListProductCart(formattedItems);
          setIsLoadingProductCart(false);
        })
        .catch((err) => {
          console.error('Fetch cart error:', err);
          setListProductCart([]);
          setIsLoadingProductCart(false);
        });
    }
  };

  const value = {
    userId,
    isOpen,
    setIsOpen,
    type,
    setType,
    listProductCart,
    setListProductCart,
    isLoadingProductCart,
    handleGetListProductsCart,
    setIsLoadingProductCart,
    productDetail,
    setProductDetail,
  };

  return (
    <SideBarContext.Provider value={value}>{children}</SideBarContext.Provider>
  );
};
