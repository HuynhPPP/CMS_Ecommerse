import { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import '../../styles/components/ProductImageModal.css';

interface ProductImageModalProps {
  images: string[];
  visible: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const ProductImageModal = ({
  images,
  visible,
  onClose,
  initialIndex = 0,
}: ProductImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!visible) {
      setIsZoomed(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [visible, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!visible) return null;

  return (
    <div className='image-modal-overlay' onClick={handleBackdropClick}>
      <div className='image-modal-container'>
        {/* Close Button */}
        <button
          className='modal-btn modal-close'
          onClick={onClose}
          aria-label='Đóng'
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            className='modal-btn modal-prev'
            onClick={handlePrevious}
            aria-label='Ảnh trước'
          >
            <AiOutlineLeft size={28} />
          </button>
        )}

        {/* Image Display */}
        <div className='modal-image-wrapper'>
          <img
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            className={`modal-image ${isZoomed ? 'zoomed' : ''}`}
            onClick={toggleZoom}
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            className='modal-btn modal-next'
            onClick={handleNext}
            aria-label='Ảnh tiếp theo'
          >
            <AiOutlineRight size={28} />
          </button>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className='modal-counter'>
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className='modal-thumbnails'>
            {images.map((img, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsZoomed(false);
                }}
                aria-label={`Xem ảnh ${index + 1}`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageModal;
