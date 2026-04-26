import MyHeader from '@components/Header/Header';
import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';
import Banner from '@pages/OurShop/components/Banner';
import { OurShopProvider } from '@contexts/OurShopProvider';
import { useContext } from 'react';
import Fillter from '@pages/OurShop/components/Fillter';
import ListProducts from '@pages/OurShop/components/ListProducts';
import MyFooter from '@components/Footer/Footer';

function OurShop() {
  const { container, functionBox, specialText, btnBack } = styles;
  const navigate = useNavigate();

  const handleBackPrePage = () => {
    navigate(-1);
  };

  return (
    <OurShopProvider>
      <MyHeader />
      <MainLayout>
        <div className={container}>
          <div className={functionBox}>
            <div>
              Home &gt; <span className={specialText}>Shop</span>
            </div>
            <div className={btnBack} onClick={() => handleBackPrePage()}>
              &lt; Return to previous page
            </div>
          </div>
        </div>

        <Banner />
        <div>
          <Fillter />
          <ListProducts />
        </div>
      </MainLayout>
      <MyFooter />
    </OurShopProvider>
  );
}

export default OurShop;
