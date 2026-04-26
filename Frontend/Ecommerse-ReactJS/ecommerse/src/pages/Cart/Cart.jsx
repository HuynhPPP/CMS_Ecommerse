import MyFooter from '@components/Footer/Footer';
import Headers from '@components/Header/Header';
import Steps from './components/steps/Steps';
import styles from './styles.module.scss';
import MainLayout from '@components/Layout/Layout';
import { StepperProvider } from '@/contexts/StepperProvider';
import ContentStep from '@/pages/Cart/components/ContentSstep';

function Cart() {
  const { container } = styles;

  return (
    <StepperProvider>
      <Headers />
      <div className={container}>
        <Steps />
        <MainLayout>
          <ContentStep />
        </MainLayout>
      </div>
      <MyFooter />
    </StepperProvider>
  );
}

export default Cart;
