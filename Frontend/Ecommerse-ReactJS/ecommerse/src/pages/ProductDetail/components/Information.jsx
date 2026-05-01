import styles from '../styles.module.scss';

function InformationProduct({ data }) {
  const { itemInformation, containerInfoProduct, title, content } = styles;

  // Lấy danh sách màu sắc
  const colors = data?.colors?.map((c) => c.color).join(', ') || 'N/A';

  // Lấy danh sách kích thước (size) - cần lọc trùng lặp
  const sizes = Array.from(
    new Set(
      data?.colors?.flatMap((c) => c.variants?.map((v) => v.size) || [])
    )
  ).join(', ') || 'N/A';

  const dataInfo = [
    { id: 1, title: 'Kích cỡ', content: sizes },
    { id: 2, title: 'Màu sắc', content: colors },
    { id: 3, title: 'Chất liệu', content: 'Đang cập nhật' },
  ];

  return (
    <div className={containerInfoProduct}>
      {dataInfo.map((item, index) => (
        <div key={index} className={itemInformation}>
          <div className={title}>{item.title}</div>
          <div className={content}>{item.content}</div>
        </div>
      ))}
    </div>
  );
}

export default InformationProduct;
