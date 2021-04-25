import React from 'react';
import ButtonGroup from './ButtonGroup';

const defaultClassName = 'border shadow text-black dark:text-white rounded-sm px-2 py-1 focus:outline-none text-sm';

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
  const textClassName = outline ? `text-${color}-700 dark:text-${color}-500` : '';
  const colorClassName = outline ? `bg-${color}-100 dark:bg-black` : `bg-${color}-500 dark:bg-${color}-800`;
  const focusColorClassName = outline ? '' : `active:bg-${color}-700`;
  const disabledClassName = disabled
    ? 'cursor-default opacity-50 dark:opacity-60'
    : 'hover:opacity-80';
  const elevatedClassName = elevated ? `bg-${color} dark:bg-${color}-100 hover:bg-gray-100 dark:hover:bg-black` : '';
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
