import CartSummary from '@/pages/Cart/components/contents/CartSummary';
import styles from '../../styles.module.scss';
import CartTable from './CartTable';
import Button from '@components/Button/Button';
import { IoTrashOutline } from 'react-icons/io5';
import { useContext, useEffect } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import {
  addProductToCart,
  removeProductFromCart,
  deleteCart,
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
    addProductToCart(data)
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
    removeProductFromCart(data)
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

  const handleDeleteCart = () => {
    setIsLoadingProductCart(true);
    deleteCart({ userId })
      .then((res) => {
        console.log(res);
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
                <input type='text' placeholder='Coupon code' />
                <Button content={'OK'} isPrimary={false} />
              </div>

              <div className={boxBtnClear}>
                <Button
                  content={
                    <div>
                      <IoTrashOutline /> CLEAR SHOPPING CART
                    </div>
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
          <div className={titleEmpty}>YOUR SHOPPING CART IS EMPTY</div>
          <div>
            We invite you to get acquainted with an assortment of our shop.
            Surely you can find something for yourself!
          </div>
          <div className={boxBtnEmpty}>
            <Button content={'RETURN TO SHOP'} onClick={handleNavigateToShop} />
          </div>
        </div>
      )}
    </>
  );
}

export default Contents;
