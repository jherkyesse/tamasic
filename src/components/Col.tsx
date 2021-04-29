import React from 'react';
import PropTypes from 'prop-types';

const defaultClassName = 'flex flex-col p-1';

type ColProps = {
  alignItems?: 'start' | 'end' | 'center';
  justifyContent?: 'start' | 'end' | 'center' | 'between';
  children?: React.ReactNode;
  className?: string;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
};

function Col({
  alignItems,
  children,
  className,
  justifyContent,
  sm,
  md,
  lg,
  ...props
}: ColProps) {
  const alignItemsClassName = `items-${alignItems}`;
  const justifyContentClassName = `justify-${justifyContent}`;
  const gridColsClassName = `w-full sm:w-${sm}/12 md:w-${md}/12 lg:w-${lg}/12`;
  return (
    <div
      className={`${defaultClassName} ${alignItemsClassName} ${justifyContentClassName} ${gridColsClassName} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Col.propTypes = {
  alignItems: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  justifyContent: PropTypes.string,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
};

Col.defaultProps = {
  alignItems: 'start',
  children: null,
  className: '',
  justifyContent: 'start',
  sm: 12,
  md: 12,
  lg: 12,
};

export default Col;
