import { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const StepperContext = createContext();

export const StepperProvider = ({ children }) => {
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = sessionStorage.getItem('currentStep');
    const params = new URLSearchParams(location.search);
    
    if (savedStep) {
      const parsedStep = parseInt(savedStep);
      // Nếu đang là bước 3 nhưng không có id đơn hàng trên URL, tự động reset về bước 1
      if (parsedStep === 3 && !params.get('id')) {
        return 1;
      }
      return parsedStep;
    }
    return 1;
  });

  useEffect(() => {
    sessionStorage.setItem('currentStep', currentStep);
  }, [currentStep]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (currentStep === 3 && !params.get('id')) {
      setCurrentStep(1);
    }
  }, [location.search]);

  const value = {
    currentStep,
    setCurrentStep,
  };

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  );
};
