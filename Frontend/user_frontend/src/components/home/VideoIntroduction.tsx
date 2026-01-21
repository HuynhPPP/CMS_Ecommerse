import { useState } from 'react';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import '../../styles/components/VideoIntroduction.css';

const VideoIntroduction = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Placeholder video URL - will be replaced with actual video
  const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section className='video-introduction'>
      <div className='container'>
        <div className='video-intro-content'>
          {/* Left Column - Video */}
          <div className='video-column'>
            <div className='video-wrapper'>
              {!isPlaying ? (
                <div className='video-thumbnail' onClick={handlePlayClick}>
                  <div className='video-thumbnail-overlay'>
                    <AiOutlinePlayCircle className='play-icon' />
                    <p className='play-text'>Xem Video Giới Thiệu</p>
                  </div>
                  {/* Placeholder thumbnail */}
                  <div className='video-placeholder'>
                    <span>VIDEO GIỚI THIỆU</span>
                  </div>
                </div>
              ) : (
                <iframe
                  className='video-iframe'
                  src={`${videoUrl}?autoplay=1`}
                  title='Video giới thiệu thương hiệu'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Right Column - Description */}
          <div className='description-column'>
            <div className='video-intro-description'>
              <p>
                <strong>Radio Shop</strong> là đơn vị phân phối chính thức các
                sản phẩm chăm sóc sức khỏe hàng đầu từ các thương hiệu uy tín
                trên thế giới.
              </p>
              <p>
                Với phương châm <em>"Tin là chọn"</em>, chúng tôi cam kết mang
                đến cho khách hàng những sản phẩm chất lượng cao, nguồn gốc rõ
                ràng và dịch vụ tận tâm.
              </p>
              <ul className='video-intro-highlights'>
                <li>✓ Hơn 10 năm kinh nghiệm trong ngành</li>
                <li>✓ Đối tác của 50+ thương hiệu quốc tế</li>
                <li>✓ Phục vụ hơn 100,000 khách hàng tin tưởng</li>
                <li>✓ Sản phẩm được kiểm định chất lượng nghiêm ngặt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoIntroduction;
