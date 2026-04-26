import CountdownTimer from '@components/CountDownTimer/CountDownTimer';
import styles from '../styles.module.scss';
import Button from '@components/Button/Button';

function Banner() {
  const { containerBanner, contentBox, title, boxBtn, coutDownBox } = styles;
  const targetDate = '2026-02-17T00:00:00';
  return (
    <>
      <div className={containerBanner}>
        <div className={contentBox}>
          <div className={coutDownBox}>
            <CountdownTimer targetDate={targetDate} />
          </div>
          <div className={title}>The classics make a comeback</div>
          <div className={boxBtn}>
            <Button content='Buy Now'/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
