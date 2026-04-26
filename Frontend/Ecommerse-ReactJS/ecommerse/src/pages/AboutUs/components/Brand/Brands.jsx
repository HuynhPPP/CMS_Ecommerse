import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import brand1 from '@assets/images/Brand/brand1.png';
import brand2 from '@assets/images/Brand/brand2.png';
import brand3 from '@assets/images/Brand/brand3.png';
import brand4 from '@assets/images/Brand/brand4.png';
import brand5 from '@assets/images/Brand/brand5.png';
import styles from './styles.module.scss';

function Brands() {
  const dataBrands = [
    {
      id: '1',
      url: brand1,
    },
    {
      id: '2',
      url: brand2,
    },
    {
      id: '3',
      url: brand3,
    },
    {
      id: '4',
      url: brand4,
    },
    {
      id: '5',
      url: brand5,
    },
    {
      id: '6',
      url: brand1,
    },
    {
      id: '7',
      url: brand2,
    },
    {
      id: '8',
      url: brand3,
    },
    {
      id: '9',
      url: brand4,
    },
    {
      id: '10',
      url: brand5,
    },
  ];
  return (
    <div className={styles.brandsContainer}>
      <Swiper
        spaceBetween={80}
        slidesPerView={5}
        navigation={true}
        modules={[Navigation]}
        loop={true}
      >
        {dataBrands.map((item) => (
          <SwiperSlide key={item.id}>
            <img src={item.url} alt='brand' />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Brands;
