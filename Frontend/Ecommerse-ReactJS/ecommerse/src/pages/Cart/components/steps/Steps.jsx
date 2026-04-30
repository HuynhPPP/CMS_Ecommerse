import Stepper from '@/pages/Cart/components/steps/Stepper';
import styles from '../../styles.module.scss';
import { useContext } from 'react';
import { StepperContext } from '@/contexts/StepperProvider';

function Steps() {
  const { containerSteps, steps, line, textNote } = styles;
  const dataSteps = [
    { number: 1, content: 'GIỎ HÀNG' },
    { number: 2, content: 'THANH TOÁN' },
    { number: 3, content: 'TRẠNG THÁI ĐƠN HÀNG' },
  ];
  const { setCurrentStep, currentStep } = useContext(StepperContext);
  return (
    <div className={containerSteps}>
      <div className={steps}>
        {dataSteps.map((item, index) => {
          return (
            <>
              <Stepper
                key={index}
                number={item.number}
                content={item.content}
                isDisabled={index >= currentStep}
                setCurrentStep={setCurrentStep}
              />
              {index !== dataSteps.length - 1 && <div className={line} />}
            </>
          );
        })}
      </div>

      <div className={textNote}>
        Cảm ơn bạn đã lựa chọn sản phẩm của chúng tôi. Hãy tiến hành thanh toán để hoàn tất đơn hàng!
      </div>
    </div>
  );
}

export default Steps;
