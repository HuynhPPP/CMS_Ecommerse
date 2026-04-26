import Banner from '@components/Banner/Banner';
import MyHeader from '@components/Header/Header';
import styles from './styles.module.scss';
import AdvancelHeadling from '@components/AdvancelHeadling/AdvancelHeadling';
import Infor from '@components/Infor/Infor';
import HeadingListProduct from '@components/HeadingListProduct/HeadingListProduct';
import { useEffect, useState } from 'react';
import { getProducts } from '@/apis/productsService';
import PopularProduct from '@components/PopularProduct/PopularProduct';
import SaleHomePage from '@components/SaleHomePage/SaleHomePage';
import MyFooter from '@components/Footer/Footer';

function HomePage() {
  const [listProducts, setListProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const query = {
      sortType: 0,
      page: 1,
      limit: 10,
    };
    setIsLoading(true);
    getProducts(query)
      .then((res) => {
        setListProducts(res.contents);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div>
        <MyHeader />
        <Banner />
        <Infor />
        <AdvancelHeadling />
        <HeadingListProduct
          data={listProducts.slice(0, 2)}
          isLoading={isLoading}
        />
        <PopularProduct
          data={listProducts.slice(2, listProducts.length)}
          isLoading={isLoading}
        />
        <SaleHomePage />
        <MyFooter />
      </div>
    </>
  );
}

export default HomePage;
