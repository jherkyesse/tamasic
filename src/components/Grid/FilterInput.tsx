import React from 'react';
import PropTypes from 'prop-types';
import { CgUnavailable } from 'react-icons/cg';

const inputClassName =
  'outline-none w-full h-full p-1 bg-white dark:bg-gray-900 disabled:bg-gray-50 dark:disabled:bg-gray-800 italic';

type FilterInputProps = {
  columnIndex: number;
  onChange: (value: string, index: number) => void;
  unfilterable?: boolean;
  value?: string;
};

function FilterInput({
  columnIndex,
  onChange,
  unfilterable,
  value,
}: FilterInputProps) {
  const onChangeValue = ({ target: { value = '' } }) =>
    onChange(value, columnIndex);
  return (
    <>
      <input
        disabled={unfilterable}
        className={inputClassName}
        value={value || ''}
        onChange={onChangeValue}
      />
      {unfilterable && <CgUnavailable className="absolute text-gray-500" size={16} />}
    </>
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
