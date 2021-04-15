import React from 'react';

const defaultClassName =
  'flex-1 border border-gray-300 shadow focus:outline-none focus:shadow-inner text-xs resize-none p-1';

type TextareaProps = {
  className?: string;
  onChange?: Function;
  rows?: number;
  value?: string;
};

function Textarea({
  className,
  onChange,
  rows,
  value,
  ...props
}: TextareaProps) {
  const onChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>): void =>
    onChange && onChange(e.target.value);
  return (
    <textarea
      className={`${defaultClassName} ${className}`}
      rows={rows}
      value={value}
      onChange={onChangeValue}
      {...props}
    />
  );
}

export default Textarea;
