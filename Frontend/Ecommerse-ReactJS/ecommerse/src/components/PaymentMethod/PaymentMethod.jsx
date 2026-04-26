import styles from './styles.module.scss';
// Import payment method images
import visaImg from '@/assets/images/Payment/visa.jpeg';
import masterCardImg from '@/assets/images/Payment/master-card.jpeg';
import paypalImg from '@/assets/images/Payment/paypal.jpeg';
import americanExpressImg from '@/assets/images/Payment/american-express.jpeg';
import maestroImg from '@/assets/images/Payment/maestro.jpeg';
import bitcoinImg from '@/assets/images/Payment/bitcoin.jpeg';

function PaymentMethod() {
  const {
    containerMethod,
    titleMethod,
    ImgpaymentMethods,
    boxImgMethods,
    textSecure,
  } = styles;

  // Payment methods data
  const paymentMethodsList = [
    { id: 1, name: 'Visa', image: visaImg },
    { id: 2, name: 'MasterCard', image: masterCardImg },
    { id: 3, name: 'PayPal', image: paypalImg },
    { id: 4, name: 'American Express', image: americanExpressImg },
    { id: 5, name: 'Maestro', image: maestroImg },
    { id: 6, name: 'Bitcoin', image: bitcoinImg },
  ];
  return (
    <>
      <div className={containerMethod}>
        <div className={titleMethod}>
          Guaranteed <span>Safe</span> checkout
        </div>
        <div className={boxImgMethods}>
          {paymentMethodsList.map((method) => (
            <img
              key={method.id}
              src={method.image}
              alt={method.name}
              title={method.name}
              className={ImgpaymentMethods}
            />
          ))}
        </div>
      </div>
      <div className={textSecure}>Your Payment is 100% Secure</div>
    </>
  );
}

export default PaymentMethod;
