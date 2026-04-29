import { addToCart } from '@/apis/cartService';

export const handleAddProductToCartCommon = (
  userId,
  setIsOpen,
  setType,
  toast,
  sizeChoose,
  productId,
  quantity,
  setIsLoading,
  handleGetListProductsCart,
  colorId
) => {
  if (!userId) {
    setIsOpen(true);
    setType('login');
    toast.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
    return;
  }

  if (!sizeChoose) {
    toast.warning('Vui lòng chọn kích thước (size)');
    return;
  }

  const data = {
    userId,
    productId,
    size: sizeChoose,
    quantity,
    colorId,
  };
  setIsLoading(true);
  addToCart(data)
    .then((res) => {
      setIsOpen(true);
      setType('cart');
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
      setIsLoading(false);
      handleGetListProductsCart(userId, 'cart');
    })
    .catch((err) => {
      console.log(err);
      toast.error('Thêm vào giỏ hàng thất bại!');
      setIsLoading(false);
    });
};

export const handleTotalPrice = (listProductCart) => {
  return listProductCart.reduce((acc, item) => {
    return acc + item.total;
  }, 0);
};
