import StarRating from '../common/StarRating';
import '../../styles/components/ReviewList.css';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
  averageRating?: number;
  totalReviews?: number;
}

const ReviewList = ({
  reviews,
  averageRating,
  totalReviews,
}: ReviewListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <div className='review-list review-list--empty'>
        <p>
          Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
        </p>
      </div>
    );
  }

  return (
    <div className='review-list'>
      {averageRating !== undefined && totalReviews !== undefined && (
        <div className='review-list__summary'>
          <div className='review-list__average'>
            <span className='review-list__average-score'>
              {averageRating.toFixed(1)}
            </span>
            <StarRating rating={averageRating} size={20} />
            <span className='review-list__total'>
              ({totalReviews} đánh giá)
            </span>
          </div>
        </div>
      )}

      <div className='review-list__items'>
        {reviews.map((review) => (
          <div key={review.id} className='review-item'>
            <div className='review-item__header'>
              <div className='review-item__author'>
                <div className='review-item__avatar'>
                  {review.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className='review-item__name'>{review.customerName}</div>
                  <div className='review-item__date'>
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} size={16} />
            </div>
            {review.comment && (
              <p className='review-item__comment'>{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
