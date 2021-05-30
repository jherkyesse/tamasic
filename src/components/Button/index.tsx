import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from './ButtonGroup';
import Spinner from '../Spinner';

const defaultClassName =
  'flex items-center border shadow text-black dark:text-white rounded-sm px-2 py-2px focus:outline-none active:shadow-inner text-xs select-none';

const loadingClassNameMap = {
  true: 'cursor-not-allowed shadow-inner',
  false: '',
};

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  disabled?: boolean;
  elevated?: boolean;
  label?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: Function;
  outline?: Boolean;
};

function Button({
  children,
  className,
  color,
  disabled,
  elevated,
  label,
  loading,
  icon,
  onClick,
  outline,
  ...props
}: ButtonProps) {
  const borderClassName = `border-${color}-700`;
  const textClassName = outline ? `text-${color}-700 dark:text-${color}-500` : '';
  const colorClassName = outline ? `bg-${color}-100 dark:bg-black` : `bg-${color}-500 dark:bg-${color}-800`;
  const focusColorClassName = outline ? '' : `active:bg-${color}-700`;
  const disabledClassName = disabled ? 'cursor-default opacity-50 dark:opacity-60' : 'hover:opacity-80';
  const elevatedClassName = elevated ? `bg-${color} dark:bg-${color}-100 hover:bg-gray-100 dark:hover:bg-black` : '';
  const loadingClassName = loadingClassNameMap[String(loading)];
  const onClickHandler = () => onClick && onClick();
  return (
    <button
      disabled={disabled || loading}
      className={`${defaultClassName} ${textClassName} ${borderClassName} ${colorClassName} ${focusColorClassName} ${disabledClassName} ${elevatedClassName} ${loadingClassName} ${className}`}
      onClick={onClickHandler}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="mr-1" />
          {label}
        </>
      ) : (
        `${icon} ${label} ${children}`
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  elevated: PropTypes.bool,
  label: PropTypes.string,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  outline: PropTypes.bool,
};

Button.defaultProps = {
  children: '',
  className: '',
  color: 'white',
  disabled: false,
  elevated: false,
  label: '',
  loading: false,
  icon: '',
  onClick: null,
  outline: false,
};

Button.Group = ButtonGroup;
export default Button;
