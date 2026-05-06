import { useState } from 'react';
import styles from '../styles.module.scss';
import { optimizeCloudinaryUrl } from '@/utils/helper';

function InformationProduct({ data }) {
  const [showSizeChart, setShowSizeChart] = useState(false);

  const {
    containerInfoProduct,
    itemInformation,
    title,
    content,
    sizeChartLink,
    sizeChartOverlay,
    modalContent,
    closeBtn
  } = styles;

  return (
    <div className={containerInfoProduct}>
      {/* 1. Kích cỡ */}
      <div className={itemInformation}>
        <div className={title}>Kích cỡ:</div>
        <div className={content}>
          {Array.from(new Set(data?.colors?.flatMap((c) => c.variants?.map((v) => v.size) || []))).join(', ') || 'N/A'}
        </div>
      </div>

      {/* 2. Màu sắc */}
      <div className={itemInformation}>
        <div className={title}>Màu sắc:</div>
        <div className={content}>
          {data?.colors?.map((c) => c.color).join(', ') || 'N/A'}
        </div>
      </div>

      {/* 3. Thông tin bổ sung */}
      {data?.moreDetails?.map((item, idx) => (
        <div className={itemInformation} key={idx}>
          <div className={title}>{idx === 0 ? 'Thông tin bổ sung:' : ''}</div>
          <div className={content}>{item}</div>
        </div>
      ))}

      {/* 4. Size & Fit */}
      {data?.sizeAndFit?.map((item, idx) => (
        <div className={itemInformation} key={idx}>
          <div className={title}>{idx === 0 ? 'Size & Fit:' : ''}</div>
          <div className={content}>{item}</div>
        </div>
      ))}

      {/* 5. Bảng size */}
      {data?.sizeChartImage && (
        <div className={itemInformation}>
          <div className={title}>Bảng quy đổi:</div>
          <div className={content}>
            <span className={sizeChartLink} onClick={() => setShowSizeChart(true)}>
              Xem bảng quy đổi kích cỡ
            </span>
          </div>
        </div>
      )}

      {/* 6. Cam kết */}
      {data?.guarantee && (
        <div className={itemInformation}>
          <div className={title}>Cam kết & Đổi trả:</div>
          <div className={content}>{data.guarantee}</div>
        </div>
      )}

      {/* Modal Bảng Size (CSS Thuần) */}
      {showSizeChart && (
        <div className={sizeChartOverlay} onClick={() => setShowSizeChart(false)}>
          <div className={modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={closeBtn} onClick={() => setShowSizeChart(false)}>&times;</span>
            <img src={optimizeCloudinaryUrl(data.sizeChartImage, 1200)} alt="Size Chart" />
          </div>
        </div>
      )}
    </div>
  );
}

export default InformationProduct;
