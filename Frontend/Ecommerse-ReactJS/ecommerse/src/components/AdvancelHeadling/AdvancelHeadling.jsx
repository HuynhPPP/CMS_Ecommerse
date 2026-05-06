import MainLayout from '@components/Layout/Layout';
import styles from './styles.module.scss';

function AdvancelHeadling() {
  const { container, headline, containerMiddleBox, des, title } = styles;
  return (
    <MainLayout>
      <div className={container}>
        <div className={headline}></div>
        <div className={containerMiddleBox}>
          <p className={des}>ĐỪNG BỎ LỠ CÁC KHUYẾN MÃI ĐẶC BIỆT</p>
          <p className={title}>Sản phẩm tốt nhất</p>
        </div>
        <div className={headline}></div>
      </div>
    </MainLayout>
  );
}

export default AdvancelHeadling;
