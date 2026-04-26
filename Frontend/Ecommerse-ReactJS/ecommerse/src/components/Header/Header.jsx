import BoxIcon from './BoxIcon/BoxIcon';
import Logo from '@icons/images/Logo-retina.png';
import { BsHeart } from 'react-icons/bs';
import { TfiReload } from 'react-icons/tfi';
import { PiShoppingCart } from 'react-icons/pi';
import { dataBoxIcon, dataMenu } from './constants';
import Menu from './Menu/Menu';
import styles from './styles.module.scss';
import useScrollHandling from '@/hooks/useScrollHandling';
import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '@/contexts/StoreProvider';

function MyHeader() {
  const {
    containerBoxIcon,
    containerMenu,
    containerHeader,
    containerBox,
    container,
    fixedHeader,
    topHeader,
    boxCart,
    quantity,
  } = styles;

  const { scrollPosition } = useScrollHandling();
  const [fixedPosition, setFixedPosition] = useState(false);
  const {
    setIsOpen,
    setType,
    listProductCart,
    userId,
    handleGetListProductsCart,
  } = useContext(SideBarContext);

  const { userInfo } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleOpenSidebar = (type) => {
    setIsOpen(true);
    setType(type);
  };

  const handleOpenCartSideBar = () => {
    handleGetListProductsCart(userId, 'cart');
    handleOpenSidebar('cart');
  };

  const totalQuantity =
    listProductCart?.length > 0
      ? listProductCart.reduce((total, item) => total + item.quantity, 0)
      : 0;

  useEffect(() => {
    setFixedPosition(scrollPosition > 80);
  }, [scrollPosition]);

  return (
    <div
      className={classNames(container, topHeader, {
        [fixedHeader]: fixedPosition,
      })}
    >
      <div className={containerHeader}>
        <div className={containerBox}>
          <div className={containerBoxIcon}>
            {dataBoxIcon.map((item, index) => {
              return <BoxIcon key={index} type={item.type} href={item.href} />;
            })}
          </div>
          <div className={containerMenu}>
            {dataMenu.slice(0, 3).map((item, index) => {
              return (
                <Menu key={index} content={item.content} href={item.href} />
              );
            })}
          </div>
        </div>
        <div>
          <img
            src={Logo}
            alt='Logo'
            style={{
              width: '153px',
              height: '53px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          />
        </div>
        <div className={containerBox}>
          <div className={containerMenu}>
            {dataMenu.slice(3, dataMenu.length).map((item, index) => {
              return (
                <Menu
                  key={index}
                  content={item.content}
                  href={item.href}
                  setIsOpen={setIsOpen}
                />
              );
            })}
          </div>
          <div className={containerBoxIcon}>
            <TfiReload
              style={{
                fontSize: '20px',
              }}
              onClick={() => handleOpenSidebar('compare')}
            />
            <BsHeart
              style={{
                fontSize: '20px',
              }}
              onClick={() => handleOpenSidebar('wishlist')}
            />
            <div className={boxCart}>
              <PiShoppingCart
                style={{
                  fontSize: '20px',
                }}
                onClick={() => handleOpenCartSideBar()}
              />
              <div className={quantity}>
                {totalQuantity || userInfo?.amountCart || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyHeader;
