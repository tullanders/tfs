'use client';

import { TdsTextField } from '@scania/tegel-react';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success';
  helper?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export default function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  size = 'md',
  state = 'default',
  helper,
  disabled = false,
  required = false,
  name,
}: TextFieldProps) {
  return (
    <TdsTextField
      label={label}
      placeholder={placeholder}
      value={value}
      onInput={(e: any) => onChange?.(e.target.value)}
      type={type}
      size={size}
      state={state}
      helper={helper}
      disabled={disabled}
      required={required}
      name={name}
    />
  );
}
