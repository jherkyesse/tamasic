import React from 'react';
import PropTypes from 'prop-types';
import { IoMdArrowDropdown, IoMdClose } from 'react-icons/io';
import ReactSelect from 'react-select';

const controlClassName = 'flex bg-white items-center justify-between border border-gray-300 relative outline-none';
const optionClassName = 'p-1 hover:bg-gray-100';
const placeholderClassName =
  'absolute left-0 top-0 w-full whitespace-nowrap my-2px pl-1 overflow-hidden overflow-ellipsis text-gray-400';
const multiValueRemoveClassName = 'h-full rounded-sm flex items-center px-2px hover:bg-gray-300 cursor-pointer';
const valueContainerClassName = 'relative flex flex-wrap px-1 w-full overflow-hidden';
const openMenuClassNameMap = {
  true: 'shadow-inner !bg-white',
  false: 'shadow',
};
const hasValueClassNameMap = {
  true: 'bg-white',
  false: 'bg-gray-100',
};

export type DropdownOptionsProps = {
  value?: string;
  label?: string;
  disabled?: boolean;
  isRemoved?: boolean;
};

type DropdownProps = {
  className?: string;
  disabled?: boolean;
  isMulti?: boolean;
  onChange?: (value: string | DropdownOptionsProps[] | null) => void;
  options: { label?: string; value?: string; disabled?: boolean }[];
  placeholder?: string;
  value?: string | string[] | null;
};

type RenderProps = {
  children?: React.ReactChildren;
  cx?: Function;
  data?: DropdownOptionsProps;
  getStyles?: Function;
  hasValue?: boolean;
  innerProps?: object;
  innerRef?: object;
  menuIsOpen?: boolean;
  selectProps?: {
    onChange?: (value?: string | DropdownOptionsProps[] | null) => void;
    isMulti?: boolean;
    value: string | DropdownOptionsProps[];
  };
  value?: string | string[] | null;
};

const Control = ({ children, hasValue, innerProps, innerRef, menuIsOpen }: RenderProps) => (
  <div
    className={`${controlClassName} ${openMenuClassNameMap[String(menuIsOpen)]} ${
      hasValueClassNameMap[String(hasValue)]
    }`}
    {...innerProps}
    {...innerRef}
  >
    {children}
  </div>
);
const IndicatorsContainer = () => <IoMdArrowDropdown className="mx-1" />;
const MenuList = ({ children }: RenderProps) => <div>{children}</div>;
const MultiValueLabel = ({ children }: RenderProps) => <div className="px-1">{children}</div>;
const MultiValueRemove = ({ data, selectProps }: RenderProps) => {
  const { onChange, value } = selectProps || {};
  const onClick = () => {
    if (!onChange) return;
    const selectedValueList = (value as DropdownOptionsProps[]).map(({ value }: DropdownOptionsProps) => ({
      value,
      isRemoved: value === data?.value,
    })) as DropdownOptionsProps[];
    onChange(selectedValueList);
  };
  return (
    <div role="presentation" onClick={onClick} className={multiValueRemoveClassName}>
      <IoMdClose size={10} />
    </div>
  );
};
const Option = ({ children, innerProps, innerRef }: RenderProps) => (
  <div role="presentation" {...innerProps} {...innerRef} className={optionClassName}>
    {children}
  </div>
);
const Placeholder = ({ children }: RenderProps) => <div className={placeholderClassName}>{children}</div>;
const ValueContainer = ({ children }: RenderProps) => <div className={valueContainerClassName}>{children}</div>;
function Dropdown({ className, disabled, isMulti, onChange, options, placeholder, value }: DropdownProps) {
  const defaultValue = isMulti
    ? options.filter((option) => (value || []).includes(option.value!))
    : options.find((option) => option.value === value) || null;
  const onChangeValue = (selectedValue?: DropdownOptionsProps | DropdownOptionsProps[] | null) => {
    if (!onChange) return;
    if (isMulti) {
      const valueList = (selectedValue as DropdownOptionsProps[]).reduce(
        (acc, { isRemoved, value }: DropdownOptionsProps) => (isRemoved ? acc : acc.concat([value])),
        [],
      );
      onChange(valueList);
    } else onChange((selectedValue as DropdownOptionsProps)?.value);
  };

  return (
    <>
      <ReactSelect
        isDisabled={disabled}
        isMulti={isMulti}
        options={options}
        value={defaultValue}
        menuPlacement="auto"
        onChange={onChangeValue}
        className={`text-xs flex-1 ${className}`}
        components={{
          Control,
          IndicatorsContainer,
          MenuList,
          MultiValueLabel,
          MultiValueRemove,
          Option,
          Placeholder,
          ValueContainer,
        }}
        styles={{
          input: (style: object) => ({
            ...style,
            margin: 0,
          }),
          menu: (style: object) => ({
            ...style,
            marginTop: 0,
            marginBottom: 0,
            borderRadius: 0,
          }),
          multiValue: (style: object) => ({
            ...style,
            marginLeft: 0,
            marginRight: '2px',
          }),
          singleValue: (style: object) => ({
            ...style,
            margin: 0,
          }),
        }}
        placeholder={placeholder}
      />
    </>
  );
}

Dropdown.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      disabled: PropTypes.bool,
    }),
  ),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

Dropdown.defaultProps = {
  className: '',
  disable: false,
  isMulti: false,
  onChange: () => {},
  options: [],
  placeholder: '',
  value: null,
};

export default Dropdown;
