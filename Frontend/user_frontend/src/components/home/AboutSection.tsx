import { Link } from 'react-router-dom';
import '../../styles/components/AboutSection.css';
import customerServiceImg from '../../assets/about/customer-service.png';
import deliveryImg from '../../assets/about/delivery.png';
import shoppingImg from '../../assets/about/shopping.png';

const AboutSection = () => {
  return (
    <section className='about-section'>
      <div className='container'>
        <div className='about-content'>
          {/* Left Column - Text Content */}
          <div className='about-text'>
            <h2 className='about-title'>RADIO SHOP</h2>

            <div className='about-description'>
              <p>
                Đây là trang thông tin thuốc sở hữu của{' '}
                <span className='highlight'>kênh Radio Shopping</span>, được xây
                dựng nhằm giúp Quý khán thính giả dễ dàng tìm hiểu chi tiết hơn
                về các sản phẩm đã và đang được tư vấn, giới thiệu trên sóng.
              </p>

              <p>
                Các sản phẩm trên Radio Shopping{' '}
                <span className='highlight'>
                  đều đảm bảo chất lượng, uy tín và nguồn gốc rõ ràng
                </span>
                , được cam kết bởi những{' '}
                <span className='highlight'>nhà cung cấp đáng tin cậy</span>{' '}
                hàng đầu. Chúng tôi thấu hiểu nỗi lo của nhiều khách hàng trước
                vấn nạn hàng giả, hàng nhái, vì vậy mọi sản phẩm giới thiệu đều
                được kiểm chứng và lựa chọn kỹ lưỡng.
              </p>

              <p>
                Tại đây, Quý khán thính giả có thể xem lại thông tin sản phẩm,
                tìm hiểu công dụng, thành phần, cách sử dụng, cũng như nhận thêm
                tư vấn đầy đủ và minh bạch trước khi quyết định mua hàng.
              </p>
            </div>

            <p className='about-tagline'>
              Radio Shopping – Nghe là thích, tìm hiểu là tin!
            </p>

            <Link to='/about' className='btn-learn-more'>
              Xem Thêm
            </Link>
          </div>

          {/* Right Column - Images Grid */}
          <div className='about-images'>
            <div className='about-image-item about-image-large'>
              <img
                src={customerServiceImg}
                alt='Dịch vụ khách hàng chuyên nghiệp'
              />
              <div className='image-overlay'>
                <span>Tư Vấn Tận Tâm</span>
              </div>
            </div>

            <div className='about-image-item'>
              <img src={deliveryImg} alt='Giao hàng nhanh chóng' />
              <div className='image-overlay'>
                <span>Giao Hàng Tận Nơi</span>
              </div>
            </div>

            <div className='about-image-item'>
              <img src={shoppingImg} alt='Mua sắm tiện lợi' />
              <div className='image-overlay'>
                <span>Mua Sắm Dễ Dàng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
