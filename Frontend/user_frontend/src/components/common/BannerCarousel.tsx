import { useState, useEffect } from 'react';
import '../../styles/components/BannerCarousel.css';

interface BannerCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

const BannerCarousel = ({
  images,
  autoPlayInterval = 5000,
}: BannerCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, images.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className='banner-carousel'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className='carousel-wrapper'>
        <div
          className='carousel-track'
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className='carousel-slide'>
              <img src={image} alt={`Banner ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              className='carousel-btn carousel-btn-prev'
              onClick={prevSlide}
              aria-label='Previous slide'
            >
              ‹
            </button>
            <button
              className='carousel-btn carousel-btn-next'
              onClick={nextSlide}
              aria-label='Next slide'
            >
              ›
            </button>

            {/* Dot Indicators */}
            <div className='carousel-dots'>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BannerCarousel;
