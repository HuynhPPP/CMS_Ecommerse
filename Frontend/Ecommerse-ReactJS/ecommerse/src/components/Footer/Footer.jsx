import { dataMenu } from '@components/Footer/constant';
import styles from './styles.module.scss';
import Logo from '@icons/images/marseille-logo-footer.png';
import LogoPayment from '@icons/images/payment-method-img.png';

function MyFooter() {
  const { container, boxNav } = styles;
  return (
    <div className={container}>
      <div>
        <img src={Logo} alt='' width={160} height={55} />
      </div>

      <div className={boxNav}>
        {dataMenu.map((item, index) => (
          <div key={index}>{item.content}</div>
        ))}
      </div>

      <div>
        <p style={{ textAlign: 'center' }}>Guaranteed safe ckeckout</p>
        <img src={LogoPayment} alt='' />
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        Copyright © 2025 XStore theme. Created by Huynh Phan.
      </div>
    </div>
  );
}

export default MyFooter;
