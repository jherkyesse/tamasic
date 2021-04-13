import React from 'react';

const colorMap = {};
const defaultClassName = 'rounded-full px-2 py-1 text-xs text-white';

type BadgeProps = {
  className?: string;
  children?: React.ReactNode | string;
  color?: string;
  label?: string;
};

function Badge({ className = '', children, color = 'gray', label, ...props }: BadgeProps) {
  const colorClassName = colorMap[color] || color;
  return (
    <span className={`${defaultClassName} bg-${colorClassName}-500 ${className}`} {...props}>
      {children}
      {label}
    </span>
  );
}

export default Badge;
