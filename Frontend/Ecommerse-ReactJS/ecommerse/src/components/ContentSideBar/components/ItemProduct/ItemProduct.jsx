import { deleteCartItem } from '@/apis/cartService';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { IoCloseOutline } from 'react-icons/io5';
import { useContext, useState } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import LoadingTextCommon from '@components/LoadingTextCommon/LoadingTextCommon';

function ItemProduct({
  src,
  nameProduct,
  sizeProduct,
  priceProduct,
  sku,
  quantity,
  cartItemId,
  userId,
  colorProduct,
  productId,
}) {
  const {
    container,
    boxContent,
    title,
    price,
    boxClose,
    size,
    overlayLoading,
  } = styles;

  const [isRemoveItemCart, setIsRemoveItemCart] = useState(false);
  const { handleGetListProductsCart, setIsOpen } = useContext(SideBarContext);
  const navigate = useNavigate();

  const handleNavigateToDetail = () => {
    if (productId) {
      navigate(`/product/${productId}`);
      setIsOpen(false);
    }
  };

  const handleRemoveItem = () => {
    setIsRemoveItemCart(true);
    deleteCartItem(cartItemId)
      .then((res) => {
        setIsRemoveItemCart(false);
        handleGetListProductsCart(userId, 'cart');
      })
      .catch((err) => {
        setIsRemoveItemCart(false);
      });
  };

  return (
    <div className={container}>
      <img src={src} alt='' onClick={handleNavigateToDetail} style={{ cursor: 'pointer' }} />

      <div className={boxClose}>
        <IoCloseOutline
          onClick={handleRemoveItem}
          style={{
            fontSize: '25px',
            color: 'c1c1c1',
          }}
        />
      </div>

      <div className={boxContent}>
        <div className={title} onClick={handleNavigateToDetail} style={{ cursor: 'pointer' }}>{nameProduct}</div>
        <div className={size}>Kích cỡ: {sizeProduct}</div>
        <div className={size}>Màu sắc: {colorProduct}</div>
        <div className={price}>
          {' '}
          {quantity} x {new Intl.NumberFormat('vi-VN').format(priceProduct)} VNĐ
        </div>

      </div>

      {isRemoveItemCart && (
        <div className={overlayLoading}>
          <LoadingTextCommon />
        </div>
      )}
    </div>
  );
}

export default ItemProduct;
