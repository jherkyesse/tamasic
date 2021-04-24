import React, { forwardRef, RefObject } from 'react';
import PropTypes from 'prop-types';

const defaultClassName =
  'w-full border border-gray-300 shadow focus:outline-none focus:shadow-inner text-xs p-1';

type InputProps = {
  className: string;
  onChange: Function;
  onKeyDown: () => void;
  onMouseDown: () => void;
  placeholder: string;
  value: string;
  ref?: RefObject<HTMLInputElement>;
};

function Input({
  className,
  onChange,
  onKeyDown,
  onMouseDown,
  placeholder,
  ref,
  value,
  ...props
}: InputProps) {
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>): void =>
    onChange && onChange(e.target.value, e);
  return (
    <input
      ref={ref}
      className={`${defaultClassName} ${className}`}
      value={value}
      onChange={onChangeValue}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      placeholder={placeholder}
      {...props}
    />
  );
}

Input.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseDown: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  ref: PropTypes.object,
};

Input.defaultProps = {
  className: '',
  onChange: () => {},
  onKeyDown: () => {},
  onMouseDown: () => {},
  placeholder: '',
  value: '',
  ref: null,
};

export default forwardRef((props: InputProps, ref) => Input({ ...props, ref }));
