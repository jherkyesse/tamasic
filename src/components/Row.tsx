import React from 'react';

const defaultClassName = 'flex flex-row';
const noWrapClassNameList = ['flex-wrap', 'flex-nowrap'];

type RowProps = {
  alignItems?: 'start' | 'end' | 'center';
  justifyContent?: 'start' | 'end' | 'center' | 'between';
  children?: React.ReactNode;
  className?: string;
  noWrap?: boolean;
};

function Row({
  alignItems = 'start',
  children,
  className = '',
  justifyContent = 'start',
  noWrap = false,
  ...props
}: RowProps) {
  const noWrapClasssName = noWrapClassNameList[+noWrap];
  const alitnItemsClassName = `items-${alignItems}`;
  const justifyContentClassName = `justify-${justifyContent}`;
  return (
    <div
      className={`${defaultClassName} ${noWrapClasssName} ${alitnItemsClassName} ${justifyContentClassName} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Row;
