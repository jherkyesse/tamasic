import React from 'react';
import PropTypes from 'prop-types';

const defaultCheckboxClassName = 'flex flex-nowrap items-center cursor-pointer hover:text-gray-700';
const defaultCheckboxInputClassName = 'checked:bg-red-600 checked:border-transparent pointer-events-none';
const defaultCheckboxLabelClassName = 'flex-1 pl-1 text-xs';
const disabledClassNameMap = {
  true: 'opacity-50 pointer-events-none',
  false: '',
};

type CheckboxProps = {
  disabled?: boolean;
  label?: string;
  checked?: boolean;
  onChange?: (value?: boolean) => void;
};

function Checkbox({ disabled, label, checked, onChange }: CheckboxProps) {
  const onClick = () => onChange && !disabled && onChange(!checked);
  return (
    <div
      role="presentation"
      className={`${defaultCheckboxClassName} ${disabledClassNameMap[String(disabled)]}`}
      onClick={onClick}
    >
      <input type="checkbox" className={defaultCheckboxInputClassName} checked={checked} disabled={disabled} readOnly />
      {!!label && <span className={defaultCheckboxLabelClassName}>{label}</span>}
    </div>
  );
}

Checkbox.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  disabled: false,
  label: '',
  checked: false,
  onChange: null,
};

export default Checkbox;
