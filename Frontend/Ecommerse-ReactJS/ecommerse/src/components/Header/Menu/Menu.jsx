import { useContext, useState } from 'react';
import styles from '../styles.module.scss';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { StoreContext } from '@/contexts/StoreProvider';
import { useNavigate } from 'react-router-dom';

function Menu({ title, content, href }) {
  const { menu, subMenu } = styles;
  const { setIsOpen, setType } = useContext(SideBarContext);
  const { userInfo, handleLogOut } = useContext(StoreContext);
  const [isShowSubMenu, setIsShowSubMenu] = useState(false);
  const navigate = useNavigate();

  const handleClickShowLogin = () => {
    if (content === 'Sign in' && !userInfo) {
      setIsOpen(true);
      setType('login');
    }

    if (content === 'Our Shop') {
      navigate('/shop');
    }

    if (content === 'About us') {
      navigate('/about-us');
    }
  };

  const handleRenderText = () => {
    if (content === 'Sign in' && userInfo) {
      return `Xin chào: ${userInfo.username}`;
    } else {
      return title;
    }
  };

  const handleHover = () => {
    if (content === 'Sign in' && userInfo) {
      setIsShowSubMenu(true);
    }
  };

  return (
    <div
      className={menu}
      onMouseEnter={handleHover}
      onClick={handleClickShowLogin}
    >
      {handleRenderText(content)}

      {isShowSubMenu && (
        <div
          onMouseLeave={() => setIsShowSubMenu(false)}
          className={subMenu}
        >
          {userInfo?.role === 'ADMIN' && (
            <div
              className={styles.subMenuItem}
              onClick={(e) => {
                e.stopPropagation();
                window.open('https://cms-ecommerse.vercel.app/', '_blank');
              }}
            >
              🛠 Admin Dashboard
            </div>
          )}
          <div
            className={styles.subMenuItem}
            onClick={(e) => {
              e.stopPropagation(); // Chặn sự kiện click nhảy vào thẻ cha
              handleLogOut();
            }}
          >
            LOG OUT
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
