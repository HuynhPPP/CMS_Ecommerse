import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import '../../styles/components/StarRating.css';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onChange,
  showCount = false,
  count,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className='star-rating'>
      <div className='star-rating__stars'>
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={index}
              type='button'
              className={`star-rating__star ${interactive ? 'star-rating__star--interactive' : ''} ${isFilled ? 'star-rating__star--filled' : ''}`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              {isFilled ? (
                <AiFillStar size={size} />
              ) : (
                <AiOutlineStar size={size} />
              )}
            </button>
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className='star-rating__count'>({count})</span>
      )}
    </div>
  );
};

export default StarRating;
