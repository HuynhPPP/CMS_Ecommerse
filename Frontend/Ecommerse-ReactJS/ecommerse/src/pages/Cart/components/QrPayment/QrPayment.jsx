import { useEffect, useState } from 'react';
import { getOrderDetail } from '@/apis/oderService';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import bidvBank from '@/assets/images/logo_bidv.png';
import cls from 'classnames';
import { toast } from 'react-toastify';

function QrPayment() {
  const {
    container,
    header,
    progressBar,
    progressFill,
    timer,
    content,
    leftSection,
    qrTitle,
    qrWrapper,
    qrContainer,
    qrImage,
    scanLine,
    qrCorner,
    qrWarning,
    actionButtons,
    button,
    buttonPrimary,
    buttonSecondary,
    rightSection,
    detailsTitle,
    paymentDetails,
    bankInfo,
    bankLogo,
    bankName,
    accountHolder,
    detailRow,
    detailLabel,
    detailValue,
    copyIcon,
    totalAmount,
    totalLabel,
    totalValue,
    instructions,
    instructionTitle,
    instructionList,
    waitingStatus,
    spinner,
  } = styles;

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [isSuccess, setIsSuccess] = useState(false);

  const id = params.get('id');
  const amount = params.get('totalAmount');
  const qrCodeImage = `https://qr.sepay.vn/img?acc=96247BQDS3&bank=BIDV&amount=${amount}&des=${id}`;

  const handleGetDetailOrder = async () => {
    if (!id || id === 'null') {
      toast.error('Không tìm thấy thông tin đơn hàng hợp lệ!');
      return;
    }
    try {
      const res = await getOrderDetail(id);
      // Backend trả về status là 'PENDING', 'SUCCESS', 'CANCELLED', v.v.
      if (res.status === 'SUCCESS' || res.status === 'success') {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }

      return res.status;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const status = await handleGetDetailOrder();

      if (status && status !== 'pending') {
        clearInterval(intervalId);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  // Timer state (9:32 countdown)
  const [timeLeft, setTimeLeft] = useState(572); // 9 minutes 32 seconds
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle timer expiration
  useEffect(() => {
    if (isExpired) {
      const confirmReturn = window.confirm(
        'Thời gian thanh toán đã hết hạn!\n\nBạn có muốn quay lại giỏ hàng để thực hiện thanh toán lại không?'
      );

      if (confirmReturn) {
        navigate('/cart');
      }
    }
  }, [isExpired, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={container}>
      {/* Header with progress bar and timer */}
      <div className={header}>
        <h2>Thông Tin Thanh Toán</h2>
        <div className={timer}>
          <span>⏱</span> {formatTime(timeLeft)}
        </div>
        <div className={progressBar}>
          <div
            className={progressFill}
            style={{ width: `${(timeLeft / 572) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className={content}>
        {/* Left Section - QR Code */}
        <div className={leftSection}>
          <h3 className={qrTitle}>Quét Mã QR Để Thanh Toán</h3>

          <div className={qrWrapper}>
            <div className={cls(qrContainer, { expired: isExpired })}>
              {/* QR Corner decorations */}
              <div className={cls(qrCorner, 'top-left')}></div>
              <div className={cls(qrCorner, 'top-right')}></div>
              <div className={cls(qrCorner, 'bottom-left')}></div>
              <div className={cls(qrCorner, 'bottom-right')}></div>

              {/* QR Code Image */}
              <img src={qrCodeImage} alt='QR Code' className={qrImage} />

              {/* Scanning animation line */}
              {!isExpired && <div className={scanLine}></div>}

              {/* Expired overlay */}
              {isExpired && (
                <div className={styles.expiredOverlay}>
                  <div className={styles.expiredIcon}>⏱️</div>
                  <div className={styles.expiredText}>Hết hạn</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Payment Details */}
        <div className={rightSection}>
          <h3 className={detailsTitle}>Chi Tiết Thanh Toán</h3>

          <div className={paymentDetails}>
            {/* Bank Information */}
            <div className={bankInfo}>
              <img src={bidvBank} alt='BIDV Bank' className={bankLogo} />
              <div>
                <div className={bankName}>BIDV Bank</div>
                <div className={accountHolder}>Chuyển Khoản Ngân Hàng</div>
              </div>
            </div>

            {/* Account Details */}
            <div className={detailRow}>
              <span className={detailLabel}>Chủ Tài Khoản</span>
              <span className={detailValue}>HUYNH TAN KHUONG</span>
            </div>

            <div className={detailRow}>
              <span className={detailLabel}>Số Tài Khoản</span>
              <span className={detailValue}>8827344011</span>
            </div>

            <div className={detailRow}>
              <span className={detailLabel}>Số Tiền</span>
              <span className={detailValue}> {new Intl.NumberFormat('vi-VN').format(amount)} VNĐ</span>
            </div>

            <div className={detailRow}>
              <span className={detailLabel}>Nội Dung Chuyển Khoản</span>
              <span className={detailValue}>ID đơn hàng - {id}</span>
            </div>

            {/* Total Amount */}
            <div className={totalAmount}>
              <span className={totalLabel}>Tổng Tiền</span>

              <span className={totalValue}>
                {new Intl.NumberFormat('vi-VN').format(amount)} VNĐ
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className={instructions}>
            <div className={instructionTitle}>⚠ Cách thanh toán</div>
            <ol className={instructionList}>
              <li>Mở ứng dụng ngân hàng của bạn</li>
              <li>Quét mã QR hoặc sử dụng nút "Mở trong Ứng dụng Ngân hàng"</li>
              <li>
                Nhập chính xác: <strong>ID đơn hàng - {id}</strong> vào nội dung chuyển khoản
              </li>
              <li>Hoàn tất thanh toán</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrPayment;
