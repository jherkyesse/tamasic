
import React from 'react';

const defaultClassName = 'flex flex-col';

type ColProps = {
  alignItems?: 'start' | 'end' | 'center';
  justifyContent?: 'start' | 'end' | 'center' | 'between';
  children?: React.ReactNode;
  className?: string;
  xs?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
};

function Col({
  alignItems = 'start',
  children,
  className = '',
  justifyContent = 'start',
  xs = 12,
  sm = 6,
  md = 4,
  lg = 3,
  ...props
}: ColProps) {
  const alitnItemsClassName = `items-${alignItems}`;
  const justifyContentClassName = `justify-${justifyContent}`;
  const gridColsClassName = `xs:w-${xs}/12 sm:w-${sm}/12 md:w-${md}/12 lg:w-${lg}/12`;
  return (
    <div
      className={`${defaultClassName} ${alitnItemsClassName} ${justifyContentClassName} ${gridColsClassName} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Col;
