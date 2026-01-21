import {
  AiOutlineCheckCircle,
  AiOutlineTruck,
  AiOutlineDollar,
  AiOutlineGift,
} from 'react-icons/ai';
import '../../styles/components/WhyChooseUs.css';

const FEATURES = [
  {
    id: 1,
    icon: AiOutlineCheckCircle,
    title: 'Sản Phẩm Chính Hãng',
    description: '100% sản phẩm nhập khẩu chính hãng, có nguồn gốc rõ ràng',
  },
  {
    id: 2,
    icon: AiOutlineTruck,
    title: 'Giao Hàng Toàn Quốc',
    description: 'Miễn phí vận chuyển cho đơn hàng từ 500.000đ',
  },
  {
    id: 3,
    icon: AiOutlineDollar,
    title: 'Giá Cả Cạnh Tranh',
    description:
      'Cam kết giá tốt nhất thị trường, hoàn tiền nếu phát hiện giá rẻ hơn',
  },
  {
    id: 4,
    icon: AiOutlineGift,
    title: 'Ưu Đãi Hấp Dẫn',
    description: 'Nhiều chương trình khuyến mãi và quà tặng giá trị',
  },
];

const WhyChooseUs = () => {
  return (
    <section className='why-choose-us'>
      <div className='container'>
        <div className='why-choose-us-header'>
          <h2 className='why-choose-us-title'>Tại Sao Chọn Chúng Tôi?</h2>
          <p className='why-choose-us-subtitle'>
            Cam kết mang đến trải nghiệm mua sắm tốt nhất
          </p>
        </div>

        <div className='features-grid'>
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className='feature-card'>
                <div className='feature-icon-wrapper'>
                  <Icon className='feature-icon' />
                </div>
                <h3 className='feature-title'>{feature.title}</h3>
                <p className='feature-description'>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
