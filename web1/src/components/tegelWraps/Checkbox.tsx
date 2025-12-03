'use client';

import { TdsCheckbox } from '@scania/tegel-react';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
}

export default function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  name,
  value,
}: CheckboxProps) {
  return (
    <TdsCheckbox
      checked={checked}
      onTdsChange={(e: any) => onChange?.(e.detail.checked)}
      disabled={disabled}
      name={name}
      value={value}
    >
      {label}
    </TdsCheckbox>
  );
}
