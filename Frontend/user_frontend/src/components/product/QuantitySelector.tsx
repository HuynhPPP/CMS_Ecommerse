import { useState } from 'react';
import '../../styles/components/QuantitySelector.css';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
}: QuantitySelectorProps) => {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className='quantity-selector'>
      <button
        type='button'
        className='quantity-selector__button'
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label='Decrease quantity'
      >
        −
      </button>
      <input
        type='number'
        className='quantity-selector__input'
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        aria-label='Quantity'
      />
      <button
        type='button'
        className='quantity-selector__button'
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label='Increase quantity'
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
