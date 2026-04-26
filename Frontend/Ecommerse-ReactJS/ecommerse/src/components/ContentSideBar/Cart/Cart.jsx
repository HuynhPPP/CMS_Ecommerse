import HeaderSideBar from '@components/ContentSideBar/components/HeaderSideBar/HeaderSideBar';
import { PiShoppingCart } from 'react-icons/pi';
import styles from './styles.module.scss';
import ItemProduct from '@components/ContentSideBar/components/ItemProduct/ItemProduct';
import Button from '@components/Button/Button';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import LoadingTextCommon from '@components/LoadingTextCommon/LoadingTextCommon';
import cls from 'classnames';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const {
    container,
    total,
    boxBtn,
    containerListProductCart,
    overlayLoading,
    isEmptyCart,
    boxEmptyCart,
    boxBtnEmptyCart,
    containerListItemCart,
  } = styles;

  const { listProductCart, isLoadingProductCart, setIsOpen } =
    useContext(SideBarContext);

  const navigate = useNavigate();

  const handleNavigateToShop = () => {
    navigate('/shop');
    setIsOpen(false);
  };

  const handleNavigateToCart = () => {
    navigate('/cart');
    setIsOpen(false);
  };

  const subTotal = listProductCart.reduce((acc, item) => {
    return acc + item.total;
  }, 0);

  return (
    <div
      className={cls(container, {
        [isEmptyCart]: !listProductCart.length,
      })}
    >
      <HeaderSideBar
        icon={<PiShoppingCart style={{ fontSize: '30px' }} />}
        title='CART'
      />
      {listProductCart.length ? (
        <div className={containerListItemCart}>
          <div style={{ overflowY: 'scroll', height: 'calc(100vh - 250px)' }}>
            {isLoadingProductCart ? (
              <LoadingTextCommon />
            ) : (
              listProductCart.map((item, index) => {
                return (
                  <ItemProduct
                    key={index}
                    item={item}
                    src={item.images[0]}
                    nameProduct={item.name}
                    sizeProduct={item.size}
                    priceProduct={item.price}
                    sku={item.sku}
                    quantity={item.quantity}
                    productId={item.productId}
                    userId={item.userId}
                  />
                );
              })
            )}
          </div>

          <div>
            <div className={total}>
              <p>SUBTOTAL:</p>
              <p>${subTotal.toFixed(2)}</p>
            </div>

            <div className={boxBtn}>
              <Button content={'VIEW CART'} onClick={handleNavigateToCart} />
              <Button content={'CHECKOUT'} isPrimary={false} />
            </div>
          </div>
        </div>
      ) : (
        <div className={boxEmptyCart}>
          <div>No products in the cart</div>
          <div className={boxBtnEmptyCart}>
            <Button
              content={'RETURN TO SHOP'}
              isPrimary={false}
              onClick={handleNavigateToShop}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
