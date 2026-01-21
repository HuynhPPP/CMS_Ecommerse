import '../../styles/components/BannerSidebar.css';

interface BannerSidebarProps {
  image: string;
  alt?: string;
}

const BannerSidebar = ({
  image,
  alt = 'Sidebar Banner',
}: BannerSidebarProps) => {
  return (
    <div className='banner-sidebar'>
      <img src={image} alt={alt} />
    </div>
  );
};

export default BannerSidebar;
