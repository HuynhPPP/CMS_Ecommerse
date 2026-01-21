import { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import '../../styles/components/PromotionalPopup.css';
import promotionalBanner from '../../assets/promotions/promotional_banner.png';

interface PromotionalPopupProps {
  autoCloseDuration?: number; // in seconds
}

const PromotionalPopup = ({
  autoCloseDuration = 20,
}: PromotionalPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user has chosen not to show popup again
    const hidePopup = localStorage.getItem('hidePromotionalPopup');
    if (hidePopup === 'true') {
      return;
    }

    // Show popup after a short delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Auto close after specified duration
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, autoCloseDuration * 1000);

    return () => clearTimeout(autoCloseTimer);
  }, [isVisible, autoCloseDuration]);

  const handleClose = () => {
    setIsVisible(false);
    if (dontShowAgain) {
      localStorage.setItem('hidePromotionalPopup', 'true');
    }
  };

  const handlePopupClick = () => {
    // Navigate to promotion page
    window.location.href = '/products?promotion=buy2get1';
  };

  if (!isVisible) return null;

  return (
    <div className='promotional-popup-overlay' onClick={handleClose}>
      <div
        className='promotional-popup-content'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className='promotional-popup-close'
          onClick={handleClose}
          aria-label='Close popup'
        >
          <AiOutlineClose />
        </button>

        {/* Promotional Banner */}
        <div
          className='promotional-popup-banner'
          onClick={handlePopupClick}
          role='button'
          tabIndex={0}
        >
          <img
            src={promotionalBanner}
            alt='Chương trình khuyến mãi - Mua 2 Tặng 1'
          />
        </div>

        {/* Don't Show Again Checkbox */}
        <div className='promotional-popup-footer'>
          <label className='dont-show-checkbox'>
            <input
              type='checkbox'
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span>Không hiển thị lại</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPopup;
