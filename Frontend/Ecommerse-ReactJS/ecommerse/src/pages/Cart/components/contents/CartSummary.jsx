import Button from '@components/Button/Button';
import styles from '../../styles.module.scss';
import cls from 'classnames';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import LoadingCart from '@/pages/Cart/components/LoadingCart';
import PaymentMethod from '@components/PaymentMethod/PaymentMethod';
import { StepperContext } from '@/contexts/StepperProvider';
import { handleTotalPrice } from '@/utils/helper';

function CartSummary() {
  const {
    containerSummary,
    title,
    boxTotal,
    subTotal,
    price,
    totals,
    space,
    containerRight,
  } = styles;

  const { listProductCart, isLoadingProductCart } = useContext(SideBarContext);
  const { setCurrentStep } = useContext(StepperContext);

  const handleProceedToCheckout = () => {
    setCurrentStep(2);
  };

  return (
    <>
      <div className={containerRight}>
        <div className={containerSummary}>
          <div className={title}>TỔNG ĐƠN HÀNG</div>

          <div className={cls(boxTotal, subTotal)}>
            <div>TẠM TÍNH</div>
            <div className={price}>
              {new Intl.NumberFormat('vi-VN').format(handleTotalPrice(listProductCart))} VNĐ
            </div>
          </div>

          <div className={cls(boxTotal, totals)}>
            <div>TỔNG TIỀN</div>
            <div>{new Intl.NumberFormat('vi-VN').format(handleTotalPrice(listProductCart))} VNĐ</div>
          </div>

          <Button
            content={'THANH TOÁN'}
            onClick={handleProceedToCheckout}
          />
          <div className={space}></div>
          <Button content={'TIẾP TỤC MUA SẮM'} isPrimary={false} />
          {isLoadingProductCart && <LoadingCart />}
        </div>

        <PaymentMethod />
      </div>
    </>
  );
}

export default CartSummary;
