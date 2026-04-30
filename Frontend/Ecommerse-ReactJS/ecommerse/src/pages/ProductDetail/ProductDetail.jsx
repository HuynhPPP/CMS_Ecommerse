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
import ProductDetailSkeleton from '@components/skeletons/ProductDetailSkeleton/ProductDetailSkeleton';
import { handleAddProductToCartCommon } from '@/utils/helper';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { ToastContext } from '@/contexts/ToastProvider';
import Cookies from 'js-cookie';
import { addToCart } from '@/apis/cartService';
import LoadingTextCommon from '@components/LoadingTextCommon/LoadingTextCommon';

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
  const [colorSelected, setColorSelected] = useState(null); // Lưu object màu đang chọn
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

  const handleSelectColor = (color) => {
    setColorSelected(color);
    setSizeSelected(''); // Reset size khi đổi màu
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
      if (dataDetail.colors?.length > 0) {
        setColorSelected(dataDetail.colors[0]);
      }
      setIsLoading(false);
    } catch (error) {
      setData();
      setIsLoading(false);
    }
  };

  const fetchDataRelatedProduct = async (id) => {
    try {
      const dataRelated = await getRelatedProduct(id);
      setDataRelated(dataRelated);
    } catch (error) {
      setDataRelated([]);
    }
  };

  const handleAddToCart = () => {
    if (!colorSelected || !sizeSelected) return;

    // Tìm variant ID nếu cần, hoặc gửi info trực tiếp tùy logic cartService
    handleAddProductToCartCommon(
      userId,
      setIsOpen,
      setType,
      toast,
      sizeSelected,
      param.id,
      quantity,
      setIsLoadingBtn,
      handleGetListProductsCart,
      colorSelected?.id
    );
  };

  const handleBuyNow = () => {
    if (!colorSelected || !sizeSelected) return;

    const body = {
      userId,
      productId: param.id,
      size: sizeSelected,
      colorId: colorSelected?.id,
      quantity,
    };

    setIsLoadingBtnBuyNow(true);
    addProductToCart(body)
      .then((res) => {
        toast.success('Thêm vào giỏ hàng thành công');
        setIsLoadingBtnBuyNow(false);
        handleGetListProductsCart(userId, 'cart');
        navigate('/cart');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Thêm vào giỏ hàng thất bại');
        setIsLoadingBtnBuyNow(false);
      });
  };

  useEffect(() => {
    if (param.id) {
      fetchDataDetailProduct(param.id);
      fetchDataRelatedProduct(param.id);
    }
  }, [param.id]);

  // Lấy giá hiển thị (lấy từ variant đầu tiên của màu đang chọn)
  const currentPrice = colorSelected?.variants?.[0]?.price
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(colorSelected.variants[0].price)
    : 'Liên hệ';

  return (
    <div>
      <MyHeader />
      <div className={container}>
        <MainLayout>
          <div className={functionBox}>
            <div>
              Trang chủ &gt; <span className={specialText}>{data?.name || 'Sản phẩm'}</span>
            </div>
            <div className={btnBack} onClick={() => handleBackPrePage()}>
              &lt; Quay lại trang trước
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
                      <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M7 4V2H17V4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4H7ZM7 6H5V18H19V6H17V8H7V6ZM9 4V6H15V4H9Z' fill='currentColor' />
                        <path d='M12 10L9 13H11V16H13V13H15L12 10Z' fill='currentColor' opacity='0.6' />
                      </svg>
                    </div>
                    <h1 className={styles.errorTitle}>Sản phẩm không tồn tại</h1>
                    <p className={styles.errorDescription}>Chúng tôi không tìm thấy sản phẩm bạn đang tìm kiếm.</p>
                    <div className={styles.errorActions}>
                      <Button content='Trở về trang chủ' onClick={() => navigate('/')} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={contentSection}>
                  <div className={imageBox}>
                    {colorSelected?.images?.map((img, index) => (
                      <ReactImageMagnifier
                        key={index}
                        srcPreview={img.imageUrl}
                        srcOriginal={img.imageUrl}
                        width={295}
                        height={350}
                      />
                    ))}
                    {!colorSelected?.images?.length && <div style={{ width: 295, height: 350, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Không có ảnh</div>}
                  </div>

                  <div className={infoBox}>
                    <h1>{data?.name}</h1>
                    <p className={price}>{currentPrice}</p>
                    <p className={descreption}>{data?.description}</p>

                    {/* Lựa chọn Màu sắc - Thêm mới để phù hợp API */}
                    <p className={titleSize}>Màu sắc: {colorSelected?.color}</p>
                    <div className={boxSize} style={{ marginBottom: '20px' }}>
                      {data?.colors?.map((item, index) => (
                        <div
                          key={index}
                          className={cls(size, {
                            [activeSize]: colorSelected?.id === item.id,
                          })}
                          onClick={() => handleSelectColor(item)}
                          style={{
                            background: item.colorCode,
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: colorSelected?.id === item.id ? '2px solid #333' : '1px solid #ddd',
                            padding: 0
                          }}
                        />
                      ))}
                    </div>

                    <p className={titleSize}>Size: {sizeSelected}</p>
                    <div className={boxSize}>
                      {colorSelected?.variants?.map((item, index) => (
                        <div
                          key={index}
                          className={cls(size, {
                            [activeSize]: sizeSelected === item.size,
                          })}
                          onClick={() => handleSelectSize(item.size)}
                        >
                          {item.size}
                        </div>
                      ))}
                      {sizeSelected && (
                        <p className={btnClear} onClick={handleClearSize}>
                          Hủy chọn
                        </p>
                      )}
                    </div>

                    <div className={functionInfo}>
                      <div className={boxCount}>
                        <div onClick={() => handleSetQuantity('decrease')}>-</div>
                        <div>{quantity}</div>
                        <div onClick={() => handleSetQuantity('increase')}>+</div>
                      </div>
                      <div className={boxAddCart}>
                        <Button
                          content={
                            isLoadingBtn ? <LoadingTextCommon /> : (
                              <>
                                <PiShoppingCart /> THÊM VÀO GIỎ HÀNG
                              </>
                            )
                          }
                          customClassName={(!sizeSelected || !colorSelected) ? disabledBtn : ''}
                          onClick={handleAddToCart}
                        />
                      </div>
                    </div>

                    <div className={orSection}>
                      <div /><span>OR</span><div />
                    </div>

                    <div className={btnBuyNow}>
                      <Button
                        content={
                          isLoadingBtnBuyNow ? <LoadingTextCommon /> : (
                            <>
                              <PiShoppingCart /> MUA NGAY
                            </>
                          )
                        }
                        customClassName={(!sizeSelected || !colorSelected) ? disabledBtn : ''}
                        onClick={handleBuyNow}
                      />
                    </div>

                    <div className={addFunction}>
                      <div><BsHeart /></div>
                      <div><TfiReload /></div>
                    </div>

                    <div>
                      <PaymentMethod />
                    </div>

                    <div className={infoProduct}>
                      <div>Thương hiệu: <span>{data?.brand || 'N/A'}</span></div>
                      <div>SKU: <span>{data?.id}</span></div>
                      <div>Danh mục: <span>{data?.category?.name}</span></div>
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
          {dataRelated.length > 0 && (
            <div className={containerRelated}>
              <h2>Related products</h2>
              <SliderCommon
                data={dataRelated}
                isProductItem
                slidesToShow={4}
              />
            </div>
          )}
        </MainLayout>
      </div>
      <MyFooter />
    </div>
  );
}

export default ProductDetail;
