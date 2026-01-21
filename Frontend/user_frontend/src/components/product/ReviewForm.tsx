import { useState } from 'react';
import StarRating from '../common/StarRating';
import '../../styles/components/ReviewForm.css';

interface ReviewFormProps {
  onSubmit: (data: {
    customerName: string;
    customerEmail?: string;
    rating: number;
    comment: string;
  }) => void;
  isSubmitting?: boolean;
}

const ReviewForm = ({ onSubmit, isSubmitting = false }: ReviewFormProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !comment.trim() || rating === 0) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    onSubmit({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || undefined,
      rating,
      comment: comment.trim(),
    });

    // Reset form
    setCustomerName('');
    setCustomerEmail('');
    setRating(5);
    setComment('');
  };

  return (
    <form className='review-form' onSubmit={handleSubmit}>
      <h3 className='review-form__title'>Viết đánh giá của bạn</h3>

      <div className='review-form__field'>
        <label htmlFor='rating' className='review-form__label'>
          Đánh giá <span className='review-form__required'>*</span>
        </label>
        <StarRating
          rating={rating}
          onChange={setRating}
          interactive
          size={24}
        />
      </div>

      <div className='review-form__field'>
        <label htmlFor='customerName' className='review-form__label'>
          Tên của bạn <span className='review-form__required'>*</span>
        </label>
        <input
          type='text'
          id='customerName'
          className='review-form__input'
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder='Nhập tên của bạn'
          required
        />
      </div>

      <div className='review-form__field'>
        <label htmlFor='customerEmail' className='review-form__label'>
          Email (không bắt buộc)
        </label>
        <input
          type='email'
          id='customerEmail'
          className='review-form__input'
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder='email@example.com'
        />
      </div>

      <div className='review-form__field'>
        <label htmlFor='comment' className='review-form__label'>
          Nhận xét <span className='review-form__required'>*</span>
        </label>
        <textarea
          id='comment'
          className='review-form__textarea'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Chia sẻ trải nghiệm của bạn về sản phẩm...'
          rows={5}
          required
        />
      </div>

      <button
        type='submit'
        className='review-form__submit'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
    </form>
  );
};

export default ReviewForm;
