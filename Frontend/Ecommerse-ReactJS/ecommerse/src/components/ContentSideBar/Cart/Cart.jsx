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

  const { listProductCart, isLoadingProductCart, setIsOpen, userId } =
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

  const handleNavigateToCheckout = () => {
    navigate('/cart'); // Hiện tại page checkout nằm trong /cart stepper
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
        title='GIỎ HÀNG'
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
                    src={item.images[0]}
                    nameProduct={item.name}
                    sizeProduct={item.size}
                    priceProduct={item.price}
                    quantity={item.quantity}
                    cartItemId={item.cartItemId}
                    userId={userId}
                    colorProduct={item.color}
                    productId={item.productId}
                  />
                );
              })
            )}
          </div>

          <div>
            <div className={total}>
              <p>TỔNG TIỀN:</p>
              <p>{new Intl.NumberFormat('vi-VN').format(subTotal)} VNĐ</p>
            </div>

            <div className={boxBtn}>
              <Button content={'XEM GIỎ HÀNG'} onClick={handleNavigateToCart} />
              <Button content={'THANH TOÁN'} isPrimary={false} onClick={handleNavigateToCheckout} />
            </div>
          </div>
        </div>
      ) : (
        <div className={boxEmptyCart}>
          <div>Giỏ hàng trống</div>
          <div className={boxBtnEmptyCart}>
            <Button
              content={'QUAY LẠI CỬA HÀNG'}
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
