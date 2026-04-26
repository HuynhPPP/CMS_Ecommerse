import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import Slider from 'react-slick';
import { SlArrowLeft } from 'react-icons/sl';
import { SlArrowRight } from 'react-icons/sl';
import './styles.css';
import ProductItem from '@components/ProductItem/ProductItem';

function SliderCommon({ data, isProductItem = false, slidesToShow = 1 }) {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    nextArrow: <SlArrowRight />,
    prevArrow: <SlArrowLeft />,
  };
  return (
    <Slider {...settings}>
      {data.map((item, index) => {
        const srcImage = !item.image ? item.images[0] : item.image;

        return (
          <>
            {isProductItem ? (
              <ProductItem
                src={srcImage}
                prevSrc={srcImage}
                name={item.name}
                price={item.price}
                details={item}
                isHomePage={false}
                slideItem={true}
              />
            ) : (
              <img src={srcImage} key={index} alt='test' />
            )}
          </>
        );
      })}
    </Slider>
  );
}

export default SliderCommon;
