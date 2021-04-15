import React from 'react';

const defaultClassName =
  'flex-1 border border-gray-300 shadow focus:outline-none focus:shadow-inner text-xs p-1';

type InputProps = {
  className?: string;
  onChange: (value: string) => void;
  value?: string;
};

function Input({ className = '', onChange, value, ...props }: InputProps) {
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>): void =>
    onChange(e.target.value);
  return (
    <input
      className={`${defaultClassName} ${className}`}
      value={value}
      onChange={onChangeValue}
      {...props}
    />
  );
}

export default Input;
