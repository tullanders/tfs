'use client';

import { TdsDropdown, TdsDropdownOption } from '@scania/tegel-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success';
  helper?: string;
  disabled?: boolean;
  name?: string;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
  size = 'md',
  state = 'default',
  helper,
  disabled = false,
  name,
}: DropdownProps) {
  return (
    <TdsDropdown
      label={label}
      value={value}
      onTdsChange={(e: any) => onChange?.(e.detail.value)}
      placeholder={placeholder}
      size={size}
      helper={helper}
      disabled={disabled}
      name={name}
    >
      {options.map((option) => (
        <TdsDropdownOption key={option.value} value={option.value}>
          {option.label}
        </TdsDropdownOption>
      ))}
    </TdsDropdown>
  );
}
