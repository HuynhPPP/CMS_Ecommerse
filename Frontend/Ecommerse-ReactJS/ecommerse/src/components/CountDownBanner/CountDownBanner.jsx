import CountdownTimer from '@components/CountDownTimer/CountDownTimer';
import styles from './styles.module.scss';
import Button from '@components/Button/Button';
import { useEffect, useState } from 'react';
import { getSettings } from '@/apis/settingService';

function CountDownBanner() {
  const { container, containerTimer, title, boxBtn } = styles;
  const [targetDate, setTargetDate] = useState(null);

  useEffect(() => {
    getSettings().then(res => {
      if (res.countdownDate) {
        setTargetDate(res.countdownDate);
      }
    }).catch(err => {
      console.log('Lỗi khi lấy countdown:', err);
      // Fallback
      setTargetDate("0000-00-00T00:00:00")
    });
  }, []);

  return (
    <div className={container}>
      <div className={containerTimer}>
        {targetDate && <CountdownTimer targetDate={targetDate} />}
      </div>
      <p className={title}>The classics make a comeback</p>
      <div className={boxBtn}>
        <Button content={'Mua ngay'} />
      </div>
    </div>
  );
}

export default CountDownBanner;
