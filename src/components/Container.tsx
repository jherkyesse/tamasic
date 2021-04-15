import React from 'react';

type ContainerProps = {
  className?: string;
  children?: React.ReactNode;
};

function Container({ className = '', children, ...props }: ContainerProps) {
  return (
    <div className={`w-full p-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Container;
