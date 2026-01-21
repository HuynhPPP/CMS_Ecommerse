import { useState } from 'react';
import '../../styles/components/ImageGallery.css';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  onImageClick?: (images: string[], index: number) => void;
}

const ImageGallery = ({
  images,
  productName,
  onImageClick,
}: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className='image-gallery'>
        <div className='image-gallery__main'>
          <img
            src='https://via.placeholder.com/600?text=No+Image'
            alt={productName}
            className='image-gallery__main-image'
          />
        </div>
      </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleMainImageClick = () => {
    if (onImageClick) {
      onImageClick(images, selectedIndex);
    }
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className='image-gallery'>
      {/* Main Image */}
      <div className='image-gallery__main'>
        <button
          className='image-gallery__nav image-gallery__nav--prev'
          onClick={handlePrevious}
          aria-label='Previous image'
        >
          ‹
        </button>

        <div
          className='image-gallery__main-wrapper'
          onClick={handleMainImageClick}
        >
          <img
            src={images[selectedIndex]}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            className='image-gallery__main-image'
          />
          <div className='image-gallery__zoom-hint'>Click để phóng to</div>
        </div>

        <button
          className='image-gallery__nav image-gallery__nav--next'
          onClick={handleNext}
          aria-label='Next image'
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className='image-gallery__thumbnails'>
          {images.map((image, index) => (
            <button
              key={index}
              className={`image-gallery__thumbnail ${index === selectedIndex ? 'image-gallery__thumbnail--active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt={`${productName} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
