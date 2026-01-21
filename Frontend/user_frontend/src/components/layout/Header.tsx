import { Link } from 'react-router-dom';
import '../../styles/layout/Header.css';
import logoRadio from '../../assets/Logo/logo-moi.png';
import CategoryMenu from './CategoryMenu';
import { CartIcon } from '../cart';
import { WishlistIcon } from '../wishlist';
import SearchBar from '../common/SearchBar';

const Header = () => {
  return (
    <header className='header'>
      <div className='container'>
        <div className='header-content'>
          {/* Logo */}
          <div className='logo'>
            <Link to='/'>
              <img src={logoRadio} alt='Radio Shop' className='logo-img' />
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className='nav'>
            <Link to='/' className='nav-link'>
              TRANG CHỦ
            </Link>
            <CategoryMenu />
            <Link to='/promotions' className='nav-link'>
              KHUYẾN MÃI
            </Link>
            <Link to='/science' className='nav-link'>
              THÔNG TIN KHOA HỌC
            </Link>
            <Link to='/events' className='nav-link'>
              SỰ KIỆN
            </Link>
            <Link to='/contact' className='nav-link'>
              LIÊN HỆ
            </Link>
          </nav>

          {/* Header Actions */}
          <div className='header-actions'>
            {/* Wishlist */}
            <WishlistIcon />

            {/* Search */}
            <SearchBar />

            {/* Cart */}
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
