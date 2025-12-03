'use client';

import { TdsRadioButton } from '@scania/tegel-react';

interface RadioButtonProps {
  label?: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  name: string;
}

export default function RadioButton({
  label,
  value,
  checked = false,
  onChange,
  disabled = false,
  name,
}: RadioButtonProps) {
  return (
    <TdsRadioButton
      value={value}
      checked={checked}
      onTdsChange={(e: any) => onChange?.(e.detail.value)}
      disabled={disabled}
      name={name}
    >
      {label}
    </TdsRadioButton>
  );
}
