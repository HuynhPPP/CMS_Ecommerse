import Stepper from '@/pages/Cart/components/steps/Stepper';
import styles from '../../styles.module.scss';
import { useContext } from 'react';
import { StepperContext } from '@/contexts/StepperProvider';

function Steps() {
  const { containerSteps, steps, line, textNote } = styles;
  const dataSteps = [
    { number: 1, content: 'SHOPPING CART' },
    { number: 2, content: 'CHECKOUT' },
    { number: 3, content: 'ORDER STATUS' },
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
        You are out of time! Checkout now to avoid losing your order!
      </div>
    </div>
  );
}

export default Steps;
