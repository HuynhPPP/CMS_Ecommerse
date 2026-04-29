import { useContext } from 'react';
import { StepperContext } from '@/contexts/StepperProvider';
import Contents from '@/pages/Cart/components/contents/Contents';
import Checkout from '@/pages/Cart/components/checkout/Checkout';
import OrderStatus from '@/pages/Cart/components/OrderStatus/OrderStatus';

function ContentStep() {
  const { currentStep } = useContext(StepperContext);
  console.log(currentStep);

  const handleRenderContent = () => {
    switch (currentStep) {
      case 1:
        return <Contents />;
      case 2:
        return <Checkout />;
      case 3:
        return <OrderStatus />;
      default:
        return <Contents />;
    }
  };
  return <>{handleRenderContent()}</>;
}

export default ContentStep;
