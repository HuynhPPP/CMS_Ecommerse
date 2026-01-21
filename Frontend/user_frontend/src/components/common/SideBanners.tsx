import '../../styles/components/SideBanners.css';
import bannerSidebar from '../../assets/Banner/banner_sidebar.png';

interface SideBannersProps {
  children: React.ReactNode;
}

const SideBanners = ({ children }: SideBannersProps) => {
  return (
    <div className='side-banners-wrapper'>
      <div className='side-banners-container'>
        {/* Left Sidebar Banner */}
        <div className='side-banner side-banner-left'>
          <img src={bannerSidebar} alt='Left Sidebar Banner' />
        </div>

        {/* Main Content */}
        <div className='side-banners-content'>{children}</div>

        {/* Right Sidebar Banner */}
        <div className='side-banner side-banner-right'>
          <img src={bannerSidebar} alt='Right Sidebar Banner' />
        </div>
      </div>
    </div>
  );
};

export default SideBanners;
