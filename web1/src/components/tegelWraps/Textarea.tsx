'use client';

import { TdsTextarea } from '@scania/tegel-react';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  maxLength?: number;
  state?: 'default' | 'error' | 'success';
  helper?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  maxLength,
  state = 'default',
  helper,
  disabled = false,
  required = false,
  name,
}: TextareaProps) {
  return (
    <TdsTextarea
      label={label}
      placeholder={placeholder}
      value={value}
      onInput={(e: any) => onChange?.(e.target.value)}
      rows={rows}
      maxLength={maxLength}
      state={state}
      helper={helper}
      disabled={disabled}
      name={name}
    />
  );
}
