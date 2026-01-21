import { useState } from 'react';
import { AiOutlineLeft, AiOutlineRight, AiOutlineStar } from 'react-icons/ai';
import '../../styles/components/CustomerTestimonials.css';

// Placeholder testimonial data
const TESTIMONIALS = [
  {
    id: 1,
    customerName: 'Chị Nguyễn Thị Hương',
    location: 'TP. Hồ Chí Minh',
    rating: 5,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    comment:
      'Sản phẩm rất tốt, tôi đã sử dụng được 3 tháng và thấy sức khỏe cải thiện rõ rệt.',
  },
  {
    id: 2,
    customerName: 'Anh Trần Văn Nam',
    location: 'Hà Nội',
    rating: 5,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    comment:
      'Dịch vụ tư vấn nhiệt tình, giao hàng nhanh. Tôi rất hài lòng với Radio Shop.',
  },
  {
    id: 3,
    customerName: 'Chị Lê Thị Mai',
    location: 'Đà Nẵng',
    rating: 5,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    comment:
      'Sản phẩm chính hãng, giá cả hợp lý. Tôi sẽ tiếp tục ủng hộ Radio Shop.',
  },
];

const CustomerTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? TESTIMONIALS.length - 1 : prev - 1
    );
    setIsVideoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === TESTIMONIALS.length - 1 ? 0 : prev + 1
    );
    setIsVideoPlaying(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsVideoPlaying(false);
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section className='customer-testimonials'>
      <div className='container'>
        <div className='testimonials-header'>
          <h2 className='testimonials-title'>Khách Hàng Nói Gì Về Chúng Tôi</h2>
          <p className='testimonials-subtitle'>
            Hàng ngàn khách hàng hài lòng với sản phẩm và dịch vụ
          </p>
        </div>

        <div className='testimonials-carousel'>
          {/* Video Section */}
          <div className='testimonial-video-section'>
            <div className='testimonial-video-wrapper'>
              {!isVideoPlaying ? (
                <div
                  className='testimonial-video-thumbnail'
                  onClick={handlePlayVideo}
                >
                  <div className='video-play-overlay'>
                    <div className='play-button'>▶</div>
                  </div>
                  <div className='video-thumbnail-placeholder'>
                    <span>VIDEO FEEDBACK</span>
                  </div>
                </div>
              ) : (
                <iframe
                  className='testimonial-video-iframe'
                  src={`${currentTestimonial.videoUrl}?autoplay=1`}
                  title={`Video feedback - ${currentTestimonial.customerName}`}
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className='testimonial-info-section'>
            <div className='testimonial-rating'>
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <AiOutlineStar key={i} className='star-icon' />
              ))}
            </div>

            <p className='testimonial-comment'>
              "{currentTestimonial.comment}"
            </p>

            <div className='testimonial-customer'>
              <h4 className='customer-name'>
                {currentTestimonial.customerName}
              </h4>
              <p className='customer-location'>{currentTestimonial.location}</p>
            </div>

            {/* Navigation */}
            <div className='testimonial-navigation'>
              <button
                className='nav-button nav-prev'
                onClick={handlePrev}
                aria-label='Previous testimonial'
              >
                <AiOutlineLeft />
              </button>

              <div className='testimonial-dots'>
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                className='nav-button nav-next'
                onClick={handleNext}
                aria-label='Next testimonial'
              >
                <AiOutlineRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
