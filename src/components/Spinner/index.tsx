import React from 'react';
import PropTypes from 'prop-types';

const defaultSpinnerClassName =
  'inline-block border-4 rounded-full border-gray-400 border-t-blue-900 animate-spin';

function Spinner({
  className,
  size,
}: {
  className?: string;
  size?: string | number;
}) {
  const sizeClassName = `h-${size} w-${size}`;
  return (
    <div
      className={`${defaultSpinnerClassName} ${sizeClassName} ${className}`}
    />
  );
}

Spinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Spinner.defaultProps = {
  className: '',
  size: 3,
};

export default Spinner;
