'use client';

import { TdsButton } from '@scania/tegel-react';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Button({ text, variant = 'primary', size = 'md', onClick }: ButtonProps) {
  return (
    <TdsButton 
      text={text}
      variant={variant} 
      size={size}
      onClick={onClick}
    />
  );
}
