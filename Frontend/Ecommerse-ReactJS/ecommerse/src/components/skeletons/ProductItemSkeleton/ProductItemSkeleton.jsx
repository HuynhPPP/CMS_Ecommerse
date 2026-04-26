import React from 'react';
import styles from './styles.module.scss';
import cls from 'classnames';

function ProductItemSkeleton({ isShowGrid = true, isHomePage = true }) {
  // Destructure để code gọn hơn
  const {
    productCard,
    containerItem,
    skeletonImage,
    skeletonContent,
    content,
    skeletonTitle,
    skeletonBrand,
    skeletonPrice,
    skeletonButton,
    skeletonSizeBox,
    skeletonSize,
    textCenter,
  } = styles;

  return (
    // Chọn wrapper class dựa trên isShowGrid
    <div className={isShowGrid ? productCard : containerItem}>
      {/* Hình ảnh: CSS Modules sẽ tự handle style dựa trên parent (productCard hoặc containerItem) */}
      <div className={skeletonImage} />

      <div className={isShowGrid ? skeletonContent : content}>
        {/* Phần Size (Chỉ hiện khi không phải HomePage và là dạng List/Detail) */}
        {!isHomePage && !isShowGrid && (
          <div className={skeletonSizeBox}>
            {[...Array(4)].map((_, index) => (
              <div key={index} className={skeletonSize} />
            ))}
          </div>
        )}

        {/* Title */}
        <div
          className={cls(skeletonTitle, {
            [textCenter]: !isHomePage && isShowGrid,
          })}
        />

        {/* Brand (Chỉ hiện khi không phải HomePage) */}
        {!isHomePage && (
          <div className={cls(skeletonBrand, { [textCenter]: isShowGrid })} />
        )}

        {/* Price */}
        <div
          className={cls(skeletonPrice, {
            [textCenter]: !isHomePage && isShowGrid,
          })}
        />

        {/* Button (Chỉ hiện khi không phải HomePage) */}
        {!isHomePage && <div className={skeletonButton} />}
      </div>
    </div>
  );
}

export default ProductItemSkeleton;
