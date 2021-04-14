import React from 'react';
import ButtonGroup from './ButtonGroup';

const defaultClassName = 'border rounded-md px-2 py-1 focus:outline-none text-sm';

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  disabled?: boolean;
  elevated?: boolean;
  label?: string;
  icon?: React.ReactNode;
  onClick?: Function;
  outline?: Boolean;
};

function Button({
  children,
  className = '',
  color = 'white',
  disabled = false,
  elevated = false,
  label = '',
  icon,
  onClick,
  outline = false,
  ...props
}: ButtonProps) {
  const borderClassName = `border-${color}-700`;
  const textClassName = outline ? `text-${color}-700` : 'text-black';
  const colorClassName = outline ? `bg-${color}-100` : `bg-${color}-500`;
  const focusColorClassName = outline ? 'bg-white' : `active:bg-${color}-700`;
  const disabledClassName = disabled
    ? 'cursor-default opacity-50'
    : 'hover:opacity-80';
  const elevatedClassName = elevated ? `bg-${color} hover:bg-gray-100 shadow` : '';
  const onClickHandler = () => onClick && onClick();
  return (
    <button
      disabled={disabled}
      className={`${defaultClassName} ${textClassName} ${borderClassName} ${colorClassName} ${focusColorClassName} ${disabledClassName} ${elevatedClassName} ${className}`}
      onClick={onClickHandler}
      {...props}
    >
      {icon}
      {label}
      {children}
    </button>
  );
}

Button.Group = ButtonGroup;
export default Button;
