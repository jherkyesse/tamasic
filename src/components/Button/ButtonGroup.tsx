import React from 'react';

const defaultClassName =
  'inline-flex flex-nowrap child:rounded-none not-last:border-r-0 first:rounded-r-none last:rounded-l-none first:rounded-l-md last:rounded-r-md rounded-md';

const directionClassNameMap = {
  horizontal: 'row',
  vertical: 'col',
};

type ButtonGroupProps = {
  children?: React.ReactNode;
  className?: string;
	direction?: 'horizontal' | 'vertical';
	elevated?: boolean;
};

function ButtonGroup({
  children,
  className = '',
	direction = 'horizontal',
  ...props
}: ButtonGroupProps) {
	const directionClassName = directionClassNameMap[direction] || 'row';
  return (
    <div
      role="group"
      className={`${defaultClassName} flex-${directionClassName} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default ButtonGroup;
