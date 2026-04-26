import MyHeader from '@components/Header/Header';
import styles from './styles.module.scss';
import MainLayout from '@components/Layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import MyFooter from '@components/Footer/Footer';
import { BsHeart } from 'react-icons/bs';
import { TfiReload } from 'react-icons/tfi';
import { PiShoppingCart } from 'react-icons/pi';
import Button from '@components/Button/Button';
import PaymentMethod from '@components/PaymentMethod/PaymentMethod';
import AccordionMenu from '@components/AccordionMenu';
import { useContext, useEffect, useState } from 'react';
import InformationProduct from '@/pages/ProductDetail/components/Information';
import Review from '@/pages/ProductDetail/components/Review';
import SliderCommon from '@components/SliderCommon/SliderCommon';
import ReactImageMagnifier from 'simple-image-magnifier/react';
import cls from 'classnames';
import { getDetailProduct, getRelatedProduct } from '@/apis/productsService';
import LoadingTextCommon from '@components/LoadingTextCommon/LoadingTextCommon';
import ProductDetailSkeleton from '@components/skeletons/ProductDetailSkeleton/ProductDetailSkeleton';
import { toast } from 'react-toastify';
import { handleAddProductToCartCommon } from '@/utils/helper';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { ToastContext } from '@/contexts/ToastProvider';
import Cookies from 'js-cookie';
import { addProductToCart } from '@/apis/cartService';

function ProductDetail() {
  const {
    container,
    functionBox,
    specialText,
    btnBack,
    btnBuyNow,
    contentSection,
    imageBox,
    infoBox,
    price,
    descreption,
    boxSize,
    size,
    titleSize,
    functionInfo,
    boxAddCart,
    boxCount,
    orSection,
    addFunction,
    infoProduct,
    containerRelated,
    activeSize,
    btnClear,
    disabledBtn,
    emptyProduct,
  } = styles;

  const navigate = useNavigate();

  const handleBackPrePage = () => {
    navigate(-1);
  };

  const [menuSelected, setMenuSelected] = useState(1);
  const [sizeSelected, setSizeSelected] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState();
  const [dataRelated, setDataRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [isLoadingBtnBuyNow, setIsLoadingBtnBuyNow] = useState(false);
  const param = useParams();

  const { setIsOpen, setType, handleGetListProductsCart } =
    useContext(SideBarContext);
  const { toast } = useContext(ToastContext);
  const userId = Cookies.get('userId');

  const dataAccordionMenu = [
    {
      id: 1,
      titleMenu: 'ADDITIONAL INFORMATION',
      contentAccordion: <InformationProduct />,
    },
    {
      id: 2,
      titleMenu: 'REVIEW (0)',
      contentAccordion: <Review />,
    },
  ];

  const handleSetMenuSelected = (id) => {
    setMenuSelected(id);
  };

  const handleSelectSize = (size) => {
    setSizeSelected(size);
  };

  const handleClearSize = () => {
    setSizeSelected('');
  };

  const handleSetQuantity = (type) => {
    if (type === 'increase') {
      setQuantity(quantity + 1);
    } else {
      setQuantity(quantity > 1 ? quantity - 1 : 1);
    }
  };

  const fetchDataDetailProduct = async (id) => {
    setIsLoading(true);
    try {
      const dataDetail = await getDetailProduct(id);
      setData(dataDetail);
      setIsLoading(false);
    } catch (error) {
      // toast.error('Failed to fetch product details');
      setData();
      setIsLoading(false);
    }
  };

  const fetchDataRelatedProduct = async (id) => {
    setIsLoading(true);
    try {
      const dataRelated = await getRelatedProduct(id);
      setDataRelated(dataRelated);
      setIsLoading(false);
    } catch (error) {
      setDataRelated([]);
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    handleAddProductToCartCommon(
      userId,
      setIsOpen,
      setType,
      toast,
      sizeSelected,
      param.id,
      quantity,
      setIsLoadingBtn,
      handleGetListProductsCart
    );
  };

  const handleBuyNow = () => {
    const data = {
      userId,
      productId: param.id,
      size: sizeSelected,
      quantity,
    };

    setIsLoadingBtnBuyNow(true);
    addProductToCart(data)
      .then((res) => {
        toast.success('Add Product to cart successfully');
        setIsLoadingBtnBuyNow(false);
        handleGetListProductsCart(userId, 'cart');
        navigate('/cart');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Add Product to cart failed');
        setIsLoadingBtnBuyNow(false);
      });
  };

  useEffect(() => {
    if (param.id) {
      fetchDataDetailProduct(param.id);
      fetchDataRelatedProduct(param.id);
    }
  }, [param.id]);

  return (
    <div>
      <MyHeader />
      <>
        <div className={container}>
          <MainLayout>
            <div className={functionBox}>
              <div>
                Home &gt; <span className={specialText}>Men</span>
              </div>
              <div className={btnBack} onClick={() => handleBackPrePage()}>
                &lt; Return to previous page
              </div>
            </div>

            {isLoading ? (
              <ProductDetailSkeleton />
            ) : (
              <>
                {!data ? (
                  <div className={emptyProduct}>
                    <div className={styles.errorContent}>
                      <div className={styles.errorIcon}>
                        <svg
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M7 4V2H17V4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4H7ZM7 6H5V18H19V6H17V8H7V6ZM9 4V6H15V4H9Z'
                            fill='currentColor'
                          />
                          <path
                            d='M12 10L9 13H11V16H13V13H15L12 10Z'
                            fill='currentColor'
                            opacity='0.6'
                          />
                        </svg>
                      </div>
                      <h1 className={styles.errorTitle}>Product Not Found</h1>
                      <p className={styles.errorDescription}>
                        We couldn't find the product you're looking for. It may
                        have been removed, sold out, or the link might be
                        incorrect.
                      </p>
                      <div className={styles.errorActions}>
                        <Button
                          content='Go to Home'
                          onClick={() => navigate('/')}
                        />
                        <button
                          className={styles.btnSecondary}
                          onClick={() => navigate(-1)}
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={contentSection}>
                    <div className={imageBox}>
                      {data?.images.map((src, index) => {
                        return (
                          <ReactImageMagnifier
                            key={index}
                            srcPreview={src}
                            srcOriginal={src}
                            width={295}
                            height={350}
                          />
                        );
                      })}
                    </div>
                    <div className={infoBox}>
                      <h1>{data?.name}</h1>
                      <p className={price}>{data?.price}</p>
                      <p classnName={descreption}>{data?.description}</p>

                      <p className={titleSize}>Size {sizeSelected}</p>
                      <div className={boxSize}>
                        {data?.size.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className={cls(size, {
                                [activeSize]: sizeSelected === item.name,
                              })}
                              onClick={() => handleSelectSize(item.name)}
                            >
                              {item.name}
                            </div>
                          );
                        })}
                        {sizeSelected && (
                          <p className={btnClear} onClick={handleClearSize}>
                            clear
                          </p>
                        )}
                      </div>

                      <div className={functionInfo}>
                        <div className={boxCount}>
                          <div onClick={() => handleSetQuantity('decrease')}>
                            -
                          </div>
                          <div>{quantity}</div>
                          <div onClick={() => handleSetQuantity('increase')}>
                            +
                          </div>
                        </div>
                        <div className={boxAddCart}>
                          <Button
                            content={
                              <>
                                {isLoadingBtn ? (
                                  <LoadingTextCommon />
                                ) : (
                                  <>
                                    <PiShoppingCart /> ADD TO CART
                                  </>
                                )}
                              </>
                            }
                            customClassName={!sizeSelected ? disabledBtn : ''}
                            onClick={handleAddToCart}
                          />
                        </div>
                      </div>

                      <div className={orSection}>
                        <div></div>
                        <span>OR</span>
                        <div></div>
                      </div>

                      <div className={btnBuyNow}>
                        <Button
                          content={
                            <>
                              {isLoadingBtnBuyNow ? (
                                <LoadingTextCommon />
                              ) : (
                                <>
                                  <PiShoppingCart /> BUY NOW
                                </>
                              )}
                            </>
                          }
                          customClassName={!sizeSelected ? disabledBtn : ''}
                          onClick={handleBuyNow}
                        />
                      </div>

                      <div className={addFunction}>
                        <div>
                          <BsHeart />
                        </div>
                        <div>
                          <TfiReload />
                        </div>
                      </div>

                      <div>
                        <PaymentMethod />
                      </div>

                      <div className={infoProduct}>
                        <div>
                          Brand: <span>Adidas</span>
                        </div>
                        <div>
                          SKU: <span>123456789</span>
                        </div>
                        <div>
                          Category: <span>Men</span>
                        </div>
                      </div>

                      {dataAccordionMenu.map((item, index) => (
                        <AccordionMenu
                          key={index}
                          titleMenu={item.titleMenu}
                          contentAccordion={item.contentAccordion}
                          onClick={() => handleSetMenuSelected(item.id)}
                          isSelected={menuSelected === item.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* RELATED PRODUCTS */}
            {dataRelated.length ? (
              <div className={containerRelated}>
                <h2>Related products</h2>

                <SliderCommon
                  data={dataRelated}
                  isProductItem
                  slidesToShow={4}
                />
              </div>
            ) : (
              <></>
            )}
          </MainLayout>
        </div>
      </>
      {/* <MyFooter /> */}
      <MyFooter />
    </div>
  );
}

export default ProductDetail;
