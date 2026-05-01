import Button from '@components/Button/Button';
import styles from '../styles.module.scss';
import FormItem from '@/pages/ProductDetail/components/FormItem';

function Review() {
  const {
    containerReview,
    reviews,
    noReview,
    replyForm,
    commentReplyTitle,
    commentNotes,
    commentFormSave,
  } = styles;
  return (
    <div className={containerReview}>
      <div className={reviews}>ĐÁNH GIÁ & NHẬN XÉT</div>

      <p className={noReview}>Chưa có đánh giá nào...</p>

      <div className={replyForm}>
        <div className={commentReplyTitle}>
          BE THE FIRST TO REVIEW "TÊN SẢN PHẨM"
        </div>

        <p className={commentNotes}>
          Địa chỉ email của bạn sẽ không được công khai. Các trường bắt buộc
          được đánh dấu
          <span>*</span>
        </p>

        <form action=''>
          {/* RATING */}
          <FormItem label={'Đánh giá của bạn'} typeChildren={'rating'} isRequired />

          {/* REVIEW */}
          <FormItem
            label={'Nhận xét của bạn'}
            typeChildren={'textarea'}
            isRequired
          />

          {/* NAME */}
          <FormItem label={'Name'} typeChildren={'input'} isRequired />

          {/* EMAIL */}
          <FormItem label={'Email'} typeChildren={'input'} isRequired />

          {/* CHECKBOX */}
          <div className={commentFormSave}>
            <input type='checkbox' />
            <span>
              Lưu tên, email và trang web của tôi trong trình duyệt này cho lần
              bình luận tiếp theo.
            </span>
          </div>

          <Button content={'GỬI'} />
        </form>
      </div>
    </div>
  );
}

export default Review;
