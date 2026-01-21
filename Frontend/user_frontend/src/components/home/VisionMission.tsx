import { AiOutlineEye, AiOutlineCheckCircle } from 'react-icons/ai';
import '../../styles/components/VisionMission.css';
import coupleRadioImg from '../../assets/about/couple-radio.png';

const VisionMission = () => {
  return (
    <section className='vision-mission'>
      <div className='container'>
        <div className='vision-mission-content'>
          {/* Left Column - Image */}
          <div className='vision-mission-image'>
            <div className='image-wrapper'>
              <img src={coupleRadioImg} alt='Khách hàng tin tưởng Radio Shop' />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className='vision-mission-text'>
            {/* Vision */}
            <div className='vm-item vision-item'>
              <div className='vm-header'>
                <div className='vm-icon vision-icon'>
                  <AiOutlineEye />
                </div>
                <h3 className='vm-title'>Tầm nhìn</h3>
              </div>
              <div className='vm-timeline'>
                <div className='timeline-dot'></div>
                <div className='timeline-line'></div>
              </div>
              <p className='vm-description'>
                Trở thành{' '}
                <span className='highlight'>
                  kênh mua sắm qua sóng radio và nền tảng trực tuyến đáng tin
                  cậy hàng đầu Việt Nam
                </span>
                , nơi mỗi khán thính giả đều yên tâm khi tìm hiểu và lựa chọn
                sản phẩm, góp phần nâng cao chất lượng cuộc sống.
              </p>
            </div>

            {/* Mission */}
            <div className='vm-item mission-item'>
              <div className='vm-header'>
                <div className='vm-icon mission-icon'>
                  <AiOutlineCheckCircle />
                </div>
                <h3 className='vm-title'>Sứ mệnh</h3>
              </div>
              <div className='vm-timeline'>
                <div className='timeline-dot'></div>
              </div>
              <ul className='vm-list'>
                <li>
                  Cung cấp thông tin sản phẩm{' '}
                  <span className='highlight'>
                    đầy đủ, rõ ràng và chính xác
                  </span>
                  .
                </li>
                <li>
                  Giới thiệu{' '}
                  <span className='highlight'>
                    sản phẩm chất lượng cao, nguồn gốc minh bạch
                  </span>
                  .
                </li>
                <li>
                  Giúp khách hàng{' '}
                  <span className='highlight'>
                    loại bỏ nỗi lo hàng giả, hàng nhái
                  </span>
                  .
                </li>
                <li>
                  Kết nối tin cậy giữa{' '}
                  <span className='highlight'>
                    doanh nghiệp uy tín và người tiêu dùng thông thái
                  </span>
                  .
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
