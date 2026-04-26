import { useContext } from 'react';
import styles from '../../styles.module.scss';
import cls from 'classnames';
import { StepperContext } from '@/contexts/StepperProvider';

function Stepper({ number, content, isDisabled }) {
  const { stepper, numberStep, textStep, isDisabledNumber, isDisabledText } =
    styles;

  const { setCurrentStep, currentStep } = useContext(StepperContext);

  return (
    <div
      className={stepper}
      onClick={() => (number !== 3 ? setCurrentStep(number) : {})}
    >
      <div
        className={cls(numberStep, {
          [isDisabledNumber]: isDisabled,
        })}
      >
        {number}
      </div>
      <div
        className={cls(textStep, {
          [isDisabledText]: isDisabled,
        })}
      >
        {content}
      </div>
    </div>
  );
}

export default Stepper;
