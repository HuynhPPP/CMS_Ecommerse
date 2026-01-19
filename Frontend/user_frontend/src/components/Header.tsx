import './Header.css';
import logoRadio from '../assets/Logo/logo-moi.png';
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from 'react-icons/ai';

const Header = () => {
  return (
    <header className='header'>
      <div className='container'>
        <div className='header-content'>
          {/* Logo */}
          <div className='logo'>
            <a href='/'>
              <img src={logoRadio} alt='Radio Shop' className='logo-img' />
            </a>
          </div>

          {/* Navigation Menu */}
          <nav className='nav'>
            <a href='/' className='nav-link'>
              TRANG CHỦ
            </a>
            <a href='/products' className='nav-link'>
              TOÀN BỘ DANH MỤC
            </a>
            <a href='/promotions' className='nav-link'>
              KHUYẾN MÃI
            </a>
            <a href='/science' className='nav-link'>
              THÔNG TIN KHOA HỌC
            </a>
            <a href='/events' className='nav-link'>
              SỰ KIỆN
            </a>
            <a href='/contact' className='nav-link'>
              LIÊN HỆ
            </a>
          </nav>

          {/* Header Actions */}
          <div className='header-actions'>
            {/* Wishlist */}
            <button className='btn-icon' aria-label='Yêu thích'>
              <AiOutlineHeart size={22} />
            </button>

            {/* Search */}
            <button className='btn-icon' aria-label='Tìm kiếm'>
              <AiOutlineSearch size={22} />
            </button>

            {/* Cart */}
            <button className='btn-icon btn-cart' aria-label='Giỏ hàng'>
              <AiOutlineShoppingCart size={22} />
              <span className='badge'>0</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
