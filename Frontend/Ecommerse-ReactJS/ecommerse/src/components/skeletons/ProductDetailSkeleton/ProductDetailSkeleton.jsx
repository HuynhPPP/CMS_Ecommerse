import React from 'react';
import styles from './styles.module.scss';

function ProductDetailSkeleton() {
  const {
    skeletonContainer,
    skeletonImageGallery,
    skeletonImage,
    skeletonInfo,
    skeletonTitle,
    skeletonPrice,
    skeletonDescription,
    skeletonSizeLabel,
    skeletonSizeBox,
    skeletonSize,
    skeletonFunctionBox,
    skeletonQuantity,
    skeletonButton,
    skeletonDivider,
    skeletonIconBox,
    skeletonIcon,
    skeletonInfoLine,
  } = styles;

  return (
    <div className={skeletonContainer}>
      {/* Image Gallery Section */}
      <div className={skeletonImageGallery}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className={skeletonImage} />
        ))}
      </div>

      {/* Product Info Section */}
      <div className={skeletonInfo}>
        {/* Title */}
        <div className={skeletonTitle} />

        {/* Price */}
        <div className={skeletonPrice} />

        {/* Description */}
        <div className={skeletonDescription} />
        <div className={skeletonDescription} style={{ width: '60%' }} />

        {/* Size Label */}
        <div className={skeletonSizeLabel} />

        {/* Size Options */}
        <div className={skeletonSizeBox}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className={skeletonSize} />
          ))}
        </div>

        {/* Quantity & Add to Cart */}
        <div className={skeletonFunctionBox}>
          <div className={skeletonQuantity} />
          <div className={skeletonButton} />
        </div>

        {/* Divider */}
        <div className={skeletonDivider}>
          <div></div>
          <span>OR</span>
          <div></div>
        </div>

        {/* Buy Now Button */}
        <div className={skeletonButton} style={{ width: '100%' }} />

        {/* Icon Actions (Heart, Reload) */}
        <div className={skeletonIconBox}>
          <div className={skeletonIcon} />
          <div className={skeletonIcon} />
        </div>

        {/* Payment Method Placeholder */}
        <div
          className={skeletonButton}
          style={{ width: '100%', height: '60px' }}
        />

        {/* Product Info Lines */}
        <div style={{ marginTop: '20px' }}>
          <div className={skeletonInfoLine} />
          <div className={skeletonInfoLine} />
          <div className={skeletonInfoLine} />
        </div>

        {/* Accordion Placeholders */}
        <div style={{ marginTop: '20px' }}>
          <div
            className={skeletonButton}
            style={{ width: '100%', height: '50px', marginBottom: '10px' }}
          />
          <div
            className={skeletonButton}
            style={{ width: '100%', height: '50px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailSkeleton;
