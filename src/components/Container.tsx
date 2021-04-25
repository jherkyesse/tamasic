import React from 'react';

type ContainerProps = {
  className?: string;
  children?: React.ReactNode;
};

function Container({ className = '', children, ...props }: ContainerProps) {
  return (
    <div className={`w-full bg-white dark:bg-gray-900 p-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Container;
