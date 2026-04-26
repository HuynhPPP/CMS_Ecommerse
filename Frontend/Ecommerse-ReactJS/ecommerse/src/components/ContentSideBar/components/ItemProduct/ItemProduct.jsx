import { removeProductFromCart } from '@/apis/cartService';
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
  productId,
  userId,
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
  const { handleGetListProductsCart } = useContext(SideBarContext);

  const handleRemoveItem = () => {
    setIsRemoveItemCart(true);
    removeProductFromCart({ userId, productId })
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
      <img src={src} alt='' />

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
        <div className={title}>{nameProduct}</div>
        <div className={size}>Size: {sizeProduct}</div>
        <div className={price}>
          {' '}
          {quantity} x ${priceProduct}
        </div>
        <div className={price}>SKU: {sku}</div>
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
