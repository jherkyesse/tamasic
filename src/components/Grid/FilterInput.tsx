import React from 'react';
import PropTypes from 'prop-types';

const inputClassName = 'outline-none w-full h-full p-1 disabled:bg-gray-50 italic';

type FilterInputProps = {
  columnIndex: number;
  onChange: (value: string, index: number) => void;
  unfilterable?: boolean;
  value?: string;
};

function FilterInput({ columnIndex, onChange, unfilterable, value }: FilterInputProps) {
  const onChangeValue = ({ target: { value = '' } }) =>
    onChange(value, columnIndex);
  return (
    <input
      disabled={unfilterable}
      className={inputClassName}
      value={value || ''}
      onChange={onChangeValue}
      placeholder={unfilterable ? 'No Filter' : ''}
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
