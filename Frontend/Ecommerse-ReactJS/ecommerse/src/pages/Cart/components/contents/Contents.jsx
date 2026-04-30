import CartSummary from '@/pages/Cart/components/contents/CartSummary';
import styles from '../../styles.module.scss';
import CartTable from './CartTable';
import Button from '@components/Button/Button';
import { IoTrashOutline } from 'react-icons/io5';
import { useContext, useEffect } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import {
  addToCart,
  deleteCartItem,
  clearCart,
} from '@/apis/cartService';
import { PiShoppingCartLight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

function Contents() {
  const {
    containerContents,
    cartTableWrapper,
    cartSummaryWrapper,
    boxFooter,
    boxCoupon,
    boxBtnClear,
    boxEmptyCart,
    titleEmpty,
    boxBtnEmpty,
  } = styles;

  const {
    listProductCart,
    handleGetListProductsCart,
    isLoadingProductCart,
    setIsLoadingProductCart,
    setListProductCart,
    userId,
  } = useContext(SideBarContext);

  const navigate = useNavigate();

  const handleReplaceQuantity = (data) => {
    setIsLoadingProductCart(true);
    addToCart(data)
      .then((res) => {
        console.log(res);
        handleGetListProductsCart(data.userId, 'cart');
      })
      .catch((err) => {
        setIsLoadingProductCart(false);
        console.log(err);
      })
      .finally(() => {
        setIsLoadingProductCart(false);
      });
  };

  const handleDeleteItemCart = (data) => {
    setIsLoadingProductCart(true);
    deleteCartItem(data.cartItemId)
      .then((res) => {
        handleGetListProductsCart(userId, 'cart');
      })
      .catch((err) => {
        setIsLoadingProductCart(false);
        console.log(err);
      })
      .finally(() => {
        setIsLoadingProductCart(false);
      });
  };

  const handleDeleteCart = () => {
    setIsLoadingProductCart(true);
    clearCart(userId)
      .then((res) => {
        handleGetListProductsCart(userId, 'cart');
      })
      .catch((err) => {
        setIsLoadingProductCart(false);
        console.log(err);
      })
      .finally(() => {
        setIsLoadingProductCart(false);
      });
  };

  const handleNavigateToShop = () => {
    navigate('/shop');
  };

  useEffect(() => {
    if (userId) {
      handleGetListProductsCart(userId, 'cart');
    } else {
      setListProductCart([]);
    }
  }, [userId]);

  return (
    <>
      {listProductCart.length > 0 ? (
        <div className={containerContents}>
          <div className={cartTableWrapper}>
            <CartTable
              listProductCart={listProductCart}
              getData={handleReplaceQuantity}
              isLoading={isLoadingProductCart}
              getDataDelete={handleDeleteItemCart}
            />

            <div className={boxFooter}>
              <div className={boxCoupon}>
                <input type='text' placeholder='Mã giảm giá' />
                <Button content={'OK'} isPrimary={false} />
              </div>

              <div className={boxBtnClear}>
                <Button
                  content={
                    <>
                      <IoTrashOutline style={{ fontSize: '18px' }} /> XÓA GIỎ HÀNG
                    </>
                  }
                  isPrimary={false}
                  onClick={handleDeleteCart}
                />
              </div>
            </div>
          </div>
          <div className={cartSummaryWrapper}>
            <CartSummary />
          </div>
        </div>
      ) : (
        <div className={boxEmptyCart}>
          <PiShoppingCartLight
            style={{
              fontSize: '50px',
            }}
          />
          <div className={titleEmpty}>GIỎ HÀNG CỦA BẠN TRỐNG</div>
          <div>
            Chúng tôi mời bạn tham khảo các mặt hàng trong cửa hàng của chúng tôi.
            Chắc chắn bạn sẽ tìm thấy thứ gì đó cho riêng mình!
          </div>
          <div className={boxBtnEmpty}>
            <Button content={'QUAY LẠI CỬA HÀNG'} onClick={handleNavigateToShop} />
          </div>
        </div>
      )}
    </>
  );
}

export default Contents;
