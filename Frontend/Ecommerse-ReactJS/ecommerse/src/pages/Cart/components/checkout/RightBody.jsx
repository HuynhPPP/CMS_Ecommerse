import styles from './styles.module.scss';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import Button from '@components/Button/Button';
import PaymentMethod from '@components/PaymentMethod/PaymentMethod';
import { handleTotalPrice } from '@/utils/helper';

function RightBody({ handleExternalSubmit, register, errors }) {
  const {
    rightBody,
    title,
    itemProduct,
    items,
    totalPrice,
    subTotal,
    payment,
    btnPlaceOrder,
    nameProduct,
    priceProduct,
    sizeProduct,
  } = styles;

  const { listProductCart } = useContext(SideBarContext);

  return (
    <>
      <div className={rightBody}>
        <p className={title}>YOUR ORDER</p>

        <div className={items}>
          {listProductCart.map((item) => (
            <div className={itemProduct} key={item.id}>
              <img src={item.images[0]} alt={item.name} />

              <div>
                <p className={nameProduct}>{item.name}</p>
                <p className={priceProduct}>Price: ${item.price}</p>
                <p className={sizeProduct}>Size: {item.size}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={subTotal}>
          <p>SUBTOTAL</p>
          <p>${handleTotalPrice(listProductCart).toFixed(2)}</p>
        </div>

        <div className={totalPrice}>
          <p>TOTAL</p>
          <p>${handleTotalPrice(listProductCart).toFixed(2)}</p>
        </div>

        <div className={payment}>
          <input 
            type='radio' 
            id='qr' 
            value='QRCODE' 
            {...register('paymentMethod', { required: true })} 
          />
          <label htmlFor='qr'>CHUYỂN KHOẢN / QR CODE</label>
        </div>

        <div>
          <input 
            type='radio' 
            id='cod' 
            value='COD' 
            {...register('paymentMethod', { required: true })} 
          />
          <label htmlFor='cod'> THANH TOÁN KHI NHẬN HÀNG (COD)</label>
        </div>

        {errors.paymentMethod && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>
            * Vui lòng chọn phương thức thanh toán
          </p>
        )}

        <div className={btnPlaceOrder}>
          <Button content='PLACE ORDER' onClick={handleExternalSubmit} />
        </div>

        <PaymentMethod />
      </div>
    </>
  );
}

export default RightBody;
