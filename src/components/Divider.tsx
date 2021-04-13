import React from 'react';

const defaultClassName = 'border-t my-3';

const directionMap = {
  vertical: 'y',
  horizontal: 'x',
};

type DividerProps = {
  className?: string;
  color?: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'black' | 'white' | 'gray';
  direction?: 'vertical' | 'horizontal';
};

function Divider({ className = '', direction = 'vertical', color = 'gray' }: DividerProps) {
  const directionClassName = directionMap[direction];
  return <div className={`${defaultClassName} divide-${directionClassName} border-${color}-300 ${className}`} />;
}

export default Divider;
