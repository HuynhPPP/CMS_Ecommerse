import type { ReactNode } from 'react';
import '../../styles/components/HeroSection.css';
import BannerCarousel from '../common/BannerCarousel';
import BannerSidebar from '../common/BannerSidebar';
import banner1 from '../../assets/Banner/banner_1.png';
import banner2 from '../../assets/Banner/banner_2.png';
import bannerSidebar from '../../assets/Banner/banner_sidebar.png';

interface HeroSectionProps {
  children: ReactNode;
}

const HeroSection = ({ children }: HeroSectionProps) => {
  const mainBanners = [banner1, banner2];

  return (
    <div className='hero-section-wrapper'>
      <div className='container'>
        <div className='hero-main-grid'>
          {/* Left Sidebar Banner - Sticky */}
          <BannerSidebar image={bannerSidebar} alt='Left Sidebar Banner' />

          {/* Main Content Column */}
          <div className='hero-content-column'>
            {/* Banner Carousel */}
            <BannerCarousel images={mainBanners} />

            {/* All Page Content */}
            <div className='hero-page-content'>{children}</div>
          </div>

          {/* Right Sidebar Banner - Sticky */}
          <BannerSidebar image={bannerSidebar} alt='Right Sidebar Banner' />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
