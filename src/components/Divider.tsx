import React from 'react';

const defaultClassName = 'border-t my-3';

const directionMap = {
  vertical: 'y',
  horizontal: 'x',
};

type DividerProps = {
  className?: string;
  color?:
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'black'
    | 'white'
    | 'gray';
  direction?: 'vertical' | 'horizontal';
  type?: 'solid' | 'dashed' | 'dotted' | 'double';
};

function Divider({
  className = '',
  direction = 'vertical',
  color = 'gray',
  type = 'solid',
}: DividerProps) {
  const directionClassName = directionMap[direction];
  return (
    <div
      className={`${defaultClassName} divide-${directionClassName} divide-${type} border-${color}-300 ${className}`}
    />
  );
}

export default Divider;
