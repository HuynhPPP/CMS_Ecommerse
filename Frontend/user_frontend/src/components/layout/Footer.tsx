import { Link } from 'react-router-dom';
import '../../styles/layout/Footer.css';
import logoRadio from '../../assets/Logo/logo-radio.png';
import {
  FaFacebook,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import { SiShopee } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className='container'>
        <div className='footer-main'>
          {/* Company Info Column */}
          <div className='footer-column footer-column--brand'>
            <img src={logoRadio} alt='Radio Shop' className='footer-logo' />
            <p className='footer-tagline'>
              Chuyên cung cấp thiết bị điện tử, linh kiện chất lượng cao với giá
              cả hợp lý
            </p>
            <div className='footer-social'>
              <h4 className='footer-social-title'>Kết nối với chúng tôi</h4>
              <div className='social-links'>
                <a
                  href='https://facebook.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-link social-facebook'
                  aria-label='Facebook'
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href='https://shopee.vn'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-link social-shopee'
                  aria-label='Shopee'
                >
                  <SiShopee size={24} />
                </a>
                <a
                  href='https://tiktok.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-link social-tiktok'
                  aria-label='TikTok'
                >
                  <FaTiktok size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className='footer-column'>
            <h3 className='footer-title'>Liên Kết Nhanh</h3>
            <ul className='footer-links'>
              <li>
                <Link to='/'>Trang Chủ</Link>
              </li>
              <li>
                <Link to='/products'>Sản Phẩm</Link>
              </li>
              <li>
                <Link to='/about'>Giới Thiệu</Link>
              </li>
              <li>
                <Link to='/contact'>Liên Hệ</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div className='footer-column'>
            <h3 className='footer-title'>Dịch Vụ Khách Hàng</h3>
            <ul className='footer-links'>
              <li>
                <Link to='/shipping'>Chính Sách Vận Chuyển</Link>
              </li>
              <li>
                <Link to='/returns'>Chính Sách Đổi Trả</Link>
              </li>
              <li>
                <Link to='/warranty'>Chính Sách Bảo Hành</Link>
              </li>
              <li>
                <Link to='/privacy'>Chính Sách Bảo Mật</Link>
              </li>
              <li>
                <Link to='/terms'>Điều Khoản Sử Dụng</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className='footer-column'>
            <h3 className='footer-title'>Thông Tin Liên Hệ</h3>
            <div className='footer-contact'>
              <div className='contact-item'>
                <FaMapMarkerAlt className='contact-icon' />
                <div className='contact-text'>
                  <strong>Địa chỉ công ty:</strong>
                  <p>
                    Số 46, Đường 5, KDC Vạn Phúc, P. Hiệp Bình Phước, TP. Thủ
                    Đức, TP. HCM
                  </p>
                </div>
              </div>
              <div className='contact-item'>
                <FaMapMarkerAlt className='contact-icon' />
                <div className='contact-text'>
                  <strong>Kho hàng Cần Thơ:</strong>
                  <p>
                    Số 24, Đường 6, KDC Xây Dựng, P. Hưng Thanh, Q. Cái Răng,
                    TP. Cần Thơ
                  </p>
                </div>
              </div>
              <div className='contact-item'>
                <FaPhone className='contact-icon' />
                <div className='contact-text'>
                  <a href='tel:0899179178'>0899.179.178</a>
                </div>
              </div>
              <div className='contact-item'>
                <FaEnvelope className='contact-icon' />
                <div className='contact-text'>
                  <a href='mailto:saigonradio1108@gmail.com'>
                    saigonradio1108@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='footer-bottom'>
          <div className='footer-copyright'>
            <p>© {currentYear} Radio Shop. All rights reserved.</p>
          </div>
          <div className='footer-payment'>
            <span>Phương thức thanh toán:</span>
            <div className='payment-methods'>
              <span className='payment-badge'>💳 Visa</span>
              <span className='payment-badge'>💳 MasterCard</span>
              <span className='payment-badge'>🏦 Chuyển khoản</span>
              <span className='payment-badge'>💵 Tiền mặt</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
