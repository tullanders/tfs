'use client';

interface DatalistOption {
  value: string;
  label?: string;
}

interface DatalistProps {
  id: string;
  label?: string;
  placeholder?: string;
  options: DatalistOption[];
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  autoComplete?: string;
}

export default function Datalist({
  id,
  label,
  placeholder,
  options,
  size = 'md',
  required = false,
  name,
  value,
  onChange,
  autoComplete = 'off',
}: DatalistProps) {
  const datalistId = `datalist-${id}`;
  
  // Size mapping
  const sizeClass = size === 'sm' ? 'tds-text-sm' : size === 'lg' ? 'tds-text-lg' : 'tds-text-md';

  return (
    <div className="tds-form-group" style={{ marginBottom: '16px' }}>
      {label && (
        <div slot="label">
          {label}
          {required && <span style={{ color: 'var(--tds-red)' }}> *</span>}
        </div>
      )}
      <input
        id={id}
        type="text"
        name={name}
        value={value}
        list={datalistId}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange?.(e.target.value)}
        className={`tds-text-field ${sizeClass}`}
        
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--tds-blue)';
          e.target.style.outline = '2px solid var(--tds-blue-light)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--tds-grey-400)';
          e.target.style.outline = 'none';
        }}
      />
      <datalist id={datalistId}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </datalist>
    </div>
  );
}