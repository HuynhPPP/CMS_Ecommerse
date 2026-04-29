import React from 'react';
import styles from '../../styles.module.scss';
import { IoTrashOutline } from 'react-icons/io5';
import SelectBox from '@/pages/OurShop/components/SelectBox';
import LoadingCart from '@/pages/Cart/components/LoadingCart';
import { useNavigate } from 'react-router-dom';

const CartTable = ({ listProductCart, getData, isLoading, getDataDelete }) => {
  const { cartTable } = styles;
  const navigate = useNavigate();

  const handleNavigateToDetail = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  const showOptions = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
  ];

  const getValueSelect = (userId, productId, quantity, size, colorId) => {
    const data = {
      userId,
      productId,
      quantity,
      size,
      colorId,
      isMultiple: true,
    };

    getData(data);
  };

  return (
    <div className={cartTable}>
      <table>
        <thead>
          <tr>
            <th>SẢN PHẨM</th>
            <th />
            <th>GIÁ</th>
            <th>SỐ LƯỢNG</th>
            <th>TỔNG TIỀN</th>
          </tr>
        </thead>
        <tbody>
          {listProductCart.map((item) => (
            <tr key={item.id}>
              <td className={styles.product}>
                <img
                  src={item.images[0]}
                  alt={item.name}
                  onClick={() => handleNavigateToDetail(item.productId)}
                  style={{ cursor: 'pointer' }}
                />
                <div>
                  <p
                    onClick={() => handleNavigateToDetail(item.productId)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.name}
                  </p>
                  <p>Kích cỡ: {item.size}</p>
                  <p>Màu sắc: {item.color}</p>
                </div>
              </td>
              <td>
                <div
                  onClick={() =>
                    getDataDelete({
                      cartItemId: item.cartItemId,
                    })
                  }
                >
                  <IoTrashOutline style={{ cursor: 'pointer' }} />
                </div>
              </td>
              <td>{new Intl.NumberFormat('vi-VN').format(item.price)} VNĐ</td>

              <td>
                <SelectBox
                  options={showOptions}
                  getValues={(e) => {
                    getValueSelect(item.userId, item.productId, e, item.size, item.colorId);
                  }}
                  type='show'
                  defaultValue={item.quantity}
                />
              </td>
              <td>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} VNĐ</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && <LoadingCart />}
    </div>
  );
};

export default CartTable;
