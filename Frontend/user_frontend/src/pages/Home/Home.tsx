import {
  PromotionalPopup,
  HeroSection,
  AboutSection,
  BrandShowcase,
  FeaturedProducts,
  VideoIntroduction,
  VisionMission,
  WhyChooseUs,
  CustomerTestimonials,
  CoreValues,
} from '../../components';
import '../../styles/pages/Home.css';

const Home = () => {
  return (
    <div className='home-page'>
      {/* Promotional Popup - Shows on page load */}
      <PromotionalPopup autoCloseDuration={20} />

      {/* Hero Section - Wraps all content with banner carousel and side ads */}
      <HeroSection>
        {/* About Radio Shop */}
        <AboutSection />

        {/* Video Introduction */}
        <VideoIntroduction />

        {/* Brand Showcase */}
        <BrandShowcase />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Vision & Mission */}
        <VisionMission />

        {/* Core Values */}
        <CoreValues />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Customer Testimonials */}
        <CustomerTestimonials />
      </HeroSection>
    </div>
  );
};

export default Home;
