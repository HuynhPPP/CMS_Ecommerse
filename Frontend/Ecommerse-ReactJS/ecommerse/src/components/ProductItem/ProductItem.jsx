import styles from './styles.module.scss';
import cls from 'classnames';
import Button from '@components/Button/Button';
import { useContext, useEffect, useState } from 'react';
import { OurShopContext } from '@/contexts/OurShopProvider';
import Cookies from 'js-cookie';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { ToastContext } from '@/contexts/ToastProvider';
import LoadingTextCommon from '@components/LoadingTextCommon/LoadingTextCommon';
import { LiaShoppingBagSolid } from 'react-icons/lia';
import { TfiReload } from 'react-icons/tfi';
import { PiShoppingCartLight } from 'react-icons/pi';
import { IoEyeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { handleAddProductToCartCommon } from '@/utils/helper';

function ProductItem({
  src,
  prevSrc,
  name,
  price,
  details,
  isHomePage = true,
  slideItem = false,
}) {
  // const { isShowGrid } = useContext(OurShopContext);
  const [sizeChoose, setSizeChoose] = useState('');
  const ourShopStore = useContext(OurShopContext);
  const [isShowGrid, setIsShowGrid] = useState(ourShopStore?.isShowGrid);
  const userId = Cookies.get('userId');
  const {
    setIsOpen,
    setType,
    listProductCart,
    handleGetListProductsCart,
    setProductDetail,
  } = useContext(SideBarContext);
  const { toast } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    boxImg,
    showImgWhenHover,
    ShowFunctionWhenHover,
    boxIcon,
    title,
    priceClass,
    boxSize,
    size,
    textCenter,
    boxBtn,
    content,
    containerItem,
    leftBtn,
    largImg,
    isActiveSize,
    btnClear,
  } = styles;

  const handleChooseSize = (size) => {
    setSizeChoose(size);
  };

  const handleClearSize = () => {
    setSizeChoose('');
  };

  const handleAddToCart = () => {
    handleAddProductToCartCommon(
      userId,
      setIsOpen,
      setType,
      toast,
      sizeChoose,
      details.id,
      1,
      setIsLoading,
      handleGetListProductsCart
    );
  };

  const handleShowProductSideBar = () => {
    setIsOpen(true);
    setType('detail');
    setProductDetail(details);
  };

  const handleNavigateToProductDetail = () => {
    console.log(details.id);
    const path = `/product/${details.id}`;
    navigate(path);
  };

  const getAvailableSizes = () => {
    if (!details.colors) return [];
    return Array.from(
      new Set(details.colors.flatMap(c => c.variants.map(v => v.size)))
    );
  };

  useEffect(() => {
    if (isHomePage) {
      setIsShowGrid(true);
    } else {
      setIsShowGrid(ourShopStore?.isShowGrid);
    }
  }, [isHomePage, ourShopStore?.isShowGrid]);

  useEffect(() => {
    if (slideItem) {
      setIsShowGrid(true);
    }
  }, [slideItem]);

  const availableSizes = getAvailableSizes();

  return (
    <div className={isShowGrid ? '' : containerItem}>
      <div
        onClick={handleNavigateToProductDetail}
        className={cls(boxImg, {
          [largImg]: !isShowGrid,
        })}
      >
        <img src={src} alt='' />
        <img src={prevSrc} alt='' className={showImgWhenHover} />
        <div className={ShowFunctionWhenHover}>
          <div className={boxIcon}>
            <LiaShoppingBagSolid
              style={{
                fontSize: '25px',
              }}
            />
          </div>
          <div className={boxIcon}>
            <TfiReload
              style={{
                fontSize: '20px',
              }}
            />
          </div>
          <div className={boxIcon}>
            <PiShoppingCartLight
              style={{
                fontSize: '20px',
              }}
            />
          </div>
          <div className={boxIcon} onClick={handleShowProductSideBar}>
            <IoEyeOutline
              style={{
                fontSize: '20px',
              }}
            />
          </div>
        </div>
      </div>

      <div
        className={isShowGrid ? '' : content}
        style={{
          marginTop: slideItem && '10px',
        }}
      >
        {!isHomePage && availableSizes.length > 0 && (
          <div className={boxSize}>
            {availableSizes.map((sizeName, index) => {
              return (
                <div
                  key={index}
                  className={cls(size, {
                    [isActiveSize]: sizeChoose === sizeName,
                  })}
                  onClick={(e) => {
                    e.stopPropagation(); // Chặn sự kiện click nhảy vào trang chi tiết
                    handleChooseSize(sizeName);
                  }}
                >
                  {sizeName}
                </div>
              );
            })}
          </div>
        )}

        {sizeChoose && (
          <div className={btnClear} onClick={() => handleClearSize()}>
            clear
          </div>
        )}

        <div
          className={cls(title, {
            [textCenter]: !isHomePage,
          })}
        >
          {name}
        </div>

        {!isHomePage && (
          <div
            className={textCenter}
            style={{
              color: '#888',
            }}
          >
            Brand 01
          </div>
        )}

        <div
          className={cls(priceClass, {
            [textCenter]: !isHomePage,
          })}
          style={{
            color: isHomePage ? '#333' : '#888',
          }}
        >
          ${price}
        </div>

        {!isHomePage && (
          <div
            className={cls(boxBtn, {
              [leftBtn]: !isShowGrid,
            })}
          >
            <Button
              content={isLoading ? <LoadingTextCommon /> : 'ADD TO CART'}
              onClick={handleAddToCart}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductItem;
