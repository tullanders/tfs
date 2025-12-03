'use client';

import { TdsToggle } from '@scania/tegel-react';

interface ToggleProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
}

export default function Toggle({
  label,
  checked = false,
  onChange,
  disabled = false,
  name,
}: ToggleProps) {
  return (
    <TdsToggle
      checked={checked}
      onChange={(e: any) => onChange?.(e.detail.checked)}
      disabled={disabled}
      name={name}
    >
      {label}
    </TdsToggle>
  );
}
