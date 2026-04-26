import styles from './styles.module.scss';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import Button from '@components/Button/Button';
import PaymentMethod from '@components/PaymentMethod/PaymentMethod';
import { handleTotalPrice } from '@/utils/helper';

function RightBody({ handleExternalSubmit }) {
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
          <input type='radio' id='qr' name='fav_language' value='qr' />
          <label for='qr'>QR CODE</label>
        </div>

        <div>
          <input type='radio' id='cod' name='fav_language' value='cod' /> {''}
          <label for='cod'>Cash on delivery</label>
        </div>

        <div className={btnPlaceOrder}>
          <Button content='PLACE ORDER' onClick={handleExternalSubmit} />
        </div>

        <PaymentMethod />
      </div>
    </>
  );
}

export default RightBody;
