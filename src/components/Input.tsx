import React from 'react';

type InputProps = {
  type?: string | 'text';
  value?: string;
  onChange: (value: string) => void;
};

function Input({ type, value, onChange }: InputProps) {
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    onChange(value);
  };
  return <input type={type} value={value} onChange={onChangeValue} />;
}

export default Input;
