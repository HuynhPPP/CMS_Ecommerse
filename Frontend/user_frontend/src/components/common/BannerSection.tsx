import '../../styles/components/BannerSection.css';
import BannerCarousel from './BannerCarousel';
import BannerSidebar from './BannerSidebar';
import banner1 from '../../assets/Banner/banner_1.png';
import banner2 from '../../assets/Banner/banner_2.png';
import bannerSidebar from '../../assets/Banner/banner_sidebar.png';

const BannerSection = () => {
  const mainBanners = [banner1, banner2];

  return (
    <section className='banner-section'>
      <div className='container'>
        <div className='banner-grid'>
          {/* Main Carousel */}
          <BannerCarousel images={mainBanners} />

          {/* Right Sidebar Banner */}
          <BannerSidebar image={bannerSidebar} />
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
