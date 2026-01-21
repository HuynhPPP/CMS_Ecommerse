import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import '../../styles/components/HeroSection.css';
import banner1 from '../../assets/Banner/banner_1.png';
import banner2 from '../../assets/Banner/banner_2.png';
import bannerSidebar from '../../assets/Banner/banner_sidebar.png';

interface HeroSectionProps {
  children: ReactNode;
}

const HeroSection = ({ children }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mainBanners = [banner1, banner2];

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, mainBanners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mainBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + mainBanners.length) % mainBanners.length
    );
  };

  return (
    <div className='hero-section-wrapper'>
      <div className='container'>
        <div className='hero-main-grid'>
          {/* Left Sidebar Banner - Sticky */}
          <div className='hero-sidebar hero-sidebar-left'>
            <img src={bannerSidebar} alt='Sidebar Banner' />
          </div>

          {/* Main Content Column */}
          <div className='hero-content-column'>
            {/* Banner Carousel */}
            <section className='hero-banner-carousel'>
              <div
                className='hero-carousel'
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className='carousel-wrapper'>
                  <div
                    className='carousel-track'
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {mainBanners.map((banner, index) => (
                      <div key={index} className='carousel-slide'>
                        <img src={banner} alt={`Banner ${index + 1}`} />
                      </div>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
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
                    {mainBanners.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* All Page Content */}
            <div className='hero-page-content'>{children}</div>
          </div>

          {/* Right Sidebar Banner - Sticky */}
          <div className='hero-sidebar hero-sidebar-right'>
            <img src={bannerSidebar} alt='Sidebar Banner' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
