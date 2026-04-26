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
      <div className={reviews}>REVIEWS</div>

      <p className={noReview}>There are no reviews yet.</p>

      <div className={replyForm}>
        <div className={commentReplyTitle}>
          BE THE FIRST TO REVIEW "10K YELLOW JACKET"
        </div>

        <p className={commentNotes}>
          Your email address will not be published. Required fields are marked
        </p>

        <form action=''>
          {/* RATING */}
          <FormItem label={'Your rating'} typeChildren={'rating'} isRequired />

          {/* REVIEW */}
          <FormItem
            label={'Your review'}
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
              Save my name, email, and website in this browser for the next time
              I comment.
            </span>
          </div>

          <Button content={'SUBMIT'} />
        </form>
      </div>
    </div>
  );
}

export default Review;
