import useScrollHandling from '@/hooks/useScrollHandling';
import { useEffect, useState } from 'react';

const useTranslateXImage = () => {
  const { scrollPosition, scrollDirection } = useScrollHandling();
  const [translateXPosition, setTranslateXPosition] = useState(80);

  const handleTranslateX = () => {
    if (scrollDirection === 'down' && scrollPosition >= 1500) {
      setTranslateXPosition((prev) => (prev <= 0 ? 0 : prev - 0.4));
    } else if (scrollDirection === 'up') {
      setTranslateXPosition((prev) => (prev >= 80 ? 80 : prev + 0.4));
    }
  };
  useEffect(() => {
    handleTranslateX();
  }, [scrollPosition]);

  return {
    translateXPosition,
  };
};

export default useTranslateXImage;
