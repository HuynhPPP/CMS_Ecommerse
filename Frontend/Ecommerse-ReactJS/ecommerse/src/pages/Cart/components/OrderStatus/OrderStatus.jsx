import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderDetail } from '@/apis/oderService';
import QrPayment from '../QrPayment/QrPayment';
import Button from '@components/Button/Button';

function OrderStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOrderDetail(id)
        .then((res) => {
          setOrder(res.order || res);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading)
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Đang tải thông tin đơn hàng...
      </div>
    );

  if (!order)
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Không tìm thấy đơn hàng
      </div>
    );

  if (order?.paymentMethod === 'QRCODE') {
    return <QrPayment />;
  }

  // Format thời gian đặt hàng
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Màn hình Cảm ơn cho COD
  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ color: '#4BB543', fontSize: '32px', marginBottom: '10px' }}>
          Cảm ơn bạn đã đặt hàng!
        </h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Đơn hàng <strong>#{order.id}</strong> của bạn đã được tiếp nhận lúc <strong>{formatTime(order.createdAt)}</strong> và đang trong quá trình xử lý.
        </p>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3
          style={{
            fontSize: '20px',
            borderBottom: '2px solid #eee',
            paddingBottom: '10px',
            marginBottom: '20px',
            fontWeight: '600'
          }}
        >
          Chi tiết đơn hàng
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Sản phẩm</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Số lượng</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Giá</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, index) => {
              const variant = item.variant;
              const productName = variant?.color?.product?.name || `Sản phẩm #${item.productVariantId}`;
              const size = variant?.size;
              const color = variant?.color?.color;
              const image = variant?.color?.images?.[0]?.imageUrl;

              return (
                <tr key={index}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {image && (
                        <img
                          src={image}
                          alt={productName}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: '500' }}>{productName}</div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                          Size: {size} | Color: {color}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    x{item.quantity}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>
                    {new Intl.NumberFormat('vi-VN').format(item.price)} VNĐ
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan='2'
                style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}
              >
                Tổng cộng:
              </td>
              <td
                style={{
                  padding: '12px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  color: '#d9534f',
                  fontSize: '18px'
                }}
              >
                {new Intl.NumberFormat('vi-VN').format(order.totalAmount)} VNĐ
              </td>
            </tr>
            <tr>
              <td
                colSpan='2'
                style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}
              >
                Phương thức thanh toán:
              </td>
              <td
                style={{
                  padding: '12px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}
              >
                Thanh toán khi nhận hàng (COD)
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <Button content='TIẾP TỤC MUA SẮM' onClick={() => navigate('/shop')} />
        <Button
          content='XEM LỊCH SỬ ĐƠN HÀNG'
          onClick={() => navigate('/order')}
          isPrimary={false}
        />
      </div>
    </div>
  );
}

export default OrderStatus;
