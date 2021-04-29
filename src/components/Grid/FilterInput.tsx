import React from 'react';
import PropTypes from 'prop-types';

const inputClassName = 'outline-none w-full h-full p-1';

type FilterInputProps = {
  columnIndex: number;
  onChange: (value: string, index: number) => void;
  value?: string;
};

function FilterInput({ columnIndex, onChange, value }: FilterInputProps) {
  const onChangeValue = ({ target: { value = '' } }) =>
    onChange(value, columnIndex);
  return (
    <input
      className={inputClassName}
      value={value || ''}
      onChange={onChangeValue}
    />
  );
}

FilterInput.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

FilterInput.defaultProps = {
  onChange: () => {},
  value: '',
};

export default FilterInput;
