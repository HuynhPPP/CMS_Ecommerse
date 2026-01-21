import {
  AiOutlineSafety,
  AiOutlineStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineLink,
} from 'react-icons/ai';
import '../../styles/components/CoreValues.css';

const CORE_VALUES = [
  {
    id: 1,
    icon: AiOutlineSafety,
    title: 'UY TÍN',
    description: 'Giữ vững niềm tin của khách hàng.',
  },
  {
    id: 2,
    icon: AiOutlineStar,
    title: 'CHẤT LƯỢNG',
    description: 'Mỗi sản phẩm là lời nói của chất lượng.',
  },
  {
    id: 3,
    icon: AiOutlineEye,
    title: 'MINH BẠCH',
    description: 'Thông tin rõ ràng, giúp khách hàng hiểu đúng trước khi mua.',
  },
  {
    id: 4,
    icon: AiOutlineHeart,
    title: 'ĐỒNG HÀNH',
    description:
      'Hỗ trợ khách hàng gia đình trong suốt quá trình sử dụng sản phẩm.',
  },
  {
    id: 5,
    icon: AiOutlineLink,
    title: 'KẾT NỐI',
    description:
      'Là cầu nối giữa nhà cung cấp uy tín và người tiêu dùng thông thái.',
  },
];

const CoreValues = () => {
  return (
    <section className='core-values'>
      <div className='container'>
        <div className='core-values-header'>
          <h2 className='core-values-title'>Giá trị cốt lõi</h2>
          <div className='title-icon'>
            <AiOutlineSafety />
          </div>
        </div>

        <div className='core-values-grid'>
          {CORE_VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.id} className='core-value-card'>
                <div className='core-value-icon'>
                  <Icon />
                </div>
                <h3 className='core-value-title'>{value.title}</h3>
                <p className='core-value-description'>{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
