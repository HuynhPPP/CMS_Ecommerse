import './Footer.css';
import logoRadio from '../assets/Logo/logo-radio.png';
import { FaFacebook, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='container'>
        {/* Headers Row */}
        <div className='footer-headers'>
          <h3 className='footer-section-title'>MẠNG XÃ HỘI</h3>
          <h3 className='footer-section-title'>DỊCH VỤ KHÁCH HÀNG</h3>
          <h3 className='footer-section-title'>THÔNG TIN LIÊN HỆ</h3>
        </div>

        {/* Content Row */}
        <div className='footer-content'>
          {/* Logo & Social Media Column */}
          <div className='footer-column'>
            <img src={logoRadio} alt='Radio Shop' className='footer-logo' />
            <div className='social-links'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='social-link social-facebook'
              >
                <FaFacebook size={28} />
                <span>Facebook</span>
              </a>
              <a
                href='https://shopee.vn'
                target='_blank'
                rel='noopener noreferrer'
                className='social-link social-shopee'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 48 48'
                  width='28'
                  height='28'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M33.055 43.5h-18.11a4 4 0 0 1-3.973-3.537l-2.588-22.19h31.232l-2.588 22.19a4 4 0 0 1-3.973 3.537M13.352 17.773V15.16a10.66 10.66 0 0 1 21.32 0v2.613' />
                  <path d='M19.529 36.983c1.154.865 2.308 1.153 4.615 1.153h1.154a3.75 3.75 0 0 0 0-7.5h-2.596a3.75 3.75 0 0 1 0-7.5h1.154c2.596 0 3.75.289 4.615 1.154' />
                </svg>
                <span>Shoppe</span>
              </a>
              <a
                href='https://tiktok.com'
                target='_blank'
                rel='noopener noreferrer'
                className='social-link social-tiktok'
              >
                <FaTiktok size={28} />
                <span>Tik tok</span>
              </a>
            </div>
          </div>

          {/* Customer Services Column */}
          <div className='footer-column'>
            <ul className='footer-links'>
              <li>
                <a href='/products'>Sản phẩm</a>
              </li>
              <li>
                <a href='/promotions'>Khuyến mãi</a>
              </li>
            </ul>
          </div>

          {/* Contact Information Column */}
          <div className='footer-column'>
            <div className='contact-info'>
              <p>
                <strong>Địa chỉ công ty:</strong> Số 46, số đường 5, Khu dân cư
                Vạn Phúc, Phường Hiệp Bình Phước, Thành phố Thủ Đức, Thành phố
                Hồ Chí Minh, Việt Nam
              </p>
              <p>
                <strong>Kho hàng tại Cần Thơ:</strong> Số 24, Đường số 6, KDC
                Xây Dựng, Phường Hưng Thanh, Quận Cái Răng, TP Cần Thơ
              </p>
              <p>
                <strong>SĐT:</strong> 0899.179.178
              </p>
              <p>
                <strong>Email:</strong> saigonradio1108@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
