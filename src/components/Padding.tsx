import React from 'react';
import PropTypes from 'prop-types';

type PaddingProps = {
  childrenMarginValue?: string;
  children?: React.ReactElement | string | Element | React.Component;
  value?: string;
};

function Padding({ childrenMarginValue, children, value }: PaddingProps) {
  const defaultClassName = `p-${value}`;
  const childrenPaddingClassName = `child:my-${value} child:mr-${childrenMarginValue} first:ml-0`;
  return (
    <div className={`${defaultClassName} ${childrenPaddingClassName}`}>
      {children}
    </div>
  );
}

Padding.propTypes = {
  childrenMarginValue: PropTypes.string,
  children: PropTypes.element,
  value: PropTypes.string,
};

Padding.defaultProps = {
  childrenMarginValue: '2',
  children: null,
  value: '1',
};

export default Padding;
