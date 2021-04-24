import React, { useMemo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { IoMdArrowDropdown } from 'react-icons/io';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from 'react-virtualized';
import { isElementAtTop } from '../../utils/helpers';
import Input from '../Input';

const defaultDropdownClassName =
  'shadow border border-gray-300 bg-white outline-none';
const iconClassName =
  'absolute top-0 right-0 p-1 pointer-events-none transform duration-100 flex items-center';
const defaultDropdownOptionClassName =
  'bg-white p-1 text-xs border-b border-gray-100 flex items-center hover:bg-gray-100';
const defaultOptionHeight = 26;
const cache = new CellMeasurerCache({
  fixedWidth: true,
  fixedHeight: false,
});

type DropdownProps = {
  containerClassName: string;
  dropdownClassName: string;
  listProps: object;
  maxHeight: number;
  onChange: Function;
  options: Array<{ key: string; label: string; disabled: boolean }>;
  placeholder: string;
  value?: string;
};

type RowRendererProps = {
  index: number;
  key: string;
  parent: object;
  style: object;
};

type DropdownOptionProps = {
  label?: string;
  key?: string;
  disabled?: boolean;
};

function Dropdown({
  containerClassName,
  dropdownClassName,
  listProps,
  maxHeight,
  onChange,
  options,
  placeholder,
  value,
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [scrollToIndex, setScrollToIndex] = useState();
  const [isAtTop, setIsAtTop] = useState(true);
  const [searchInputValue, setSearchInputValue]: [string, Function] = useState(
    value || '',
  );
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const filterOptions = useMemo(() => {
    const filterOptions = options.filter((option) =>
      (option.label || '')
        .toLowerCase()
        .includes((searchInputValue || '').toLowerCase()),
    );
    cache.clearAll();
    return filterOptions;
  }, [searchInputValue]);
  const { height, rowCount } = useMemo(() => {
    const rowCount = filterOptions.length;
    const height = (rowCount || 1) * defaultOptionHeight;
    cache.clearAll();
    return { height: Math.min(height, maxHeight), rowCount };
  }, [filterOptions]);
  const onFocus = () => setIsOpenDropdown(true);
  const onBlur = () => setIsOpenDropdown(false);

  const onKeyUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollToIndex(
      scrollToIndex > 0 ? scrollToIndex - 1 : filterOptions.length - 1,
    );
  };
  const onKeyDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollToIndex(
      scrollToIndex < filterOptions.length - 1 ? scrollToIndex + 1 : 0,
    );
  };
  const onKeyEnter = () => {
    if (scrollToIndex === -1 || typeof scrollToIndex !== 'number') return;
    const { key, label } = filterOptions[scrollToIndex] || {};
    if (key === undefined || key === null) return;
    onChange(key);
    setSearchInputValue(label);
    onBlur();
  };
  const onInputKeyDown = (e) => {
    const { code } = e;
    const onKeyDownMap = {
      ArrowUp: onKeyUp,
      ArrowDown: onKeyDown,
      Enter: onKeyEnter,
    };
    if (onKeyDownMap[code]) onKeyDownMap[code](e);
  };
  const rowRenderer = ({
    index,
    key: renderKey,
    parent,
    style,
  }: RowRendererProps) => {
    const { label, key, disabled }: DropdownOptionProps =
      filterOptions[index] || {};
    const onClick = () => {
      onChange(key);
      setSearchInputValue(label);
      onBlur();
      setScrollToIndex(index);
    };
    if (!rowCount)
      return (
        <div
          key={renderKey}
          style={style}
          className="text-xs p-1 text-gray-300 text-center"
        >
          No Data
        </div>
      );
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={renderKey}
        parent={parent}
        rowIndex={index}
      >
        <div
          className={`${defaultDropdownOptionClassName} ${
            disabled ? 'disabled:opacity-50' : ''
          } ${scrollToIndex === index ? 'bg-gray-300' : ''}`}
          onClick={onClick}
          onKeyDown={() => {}}
          role="listbox"
          style={style}
          tabIndex={0}
        >
          <span>{label}</span>
        </div>
      </CellMeasurer>
    );
  };
  const outsideClickHandler = (e: MouseEvent) => {
    if (
      containerRef &&
      containerRef.current &&
      !containerRef.current.contains(e.target)
    )
      onBlur();
  };
  useEffect(() => {
    if (isOpenDropdown) {
      const isAtTop = isElementAtTop(inputRef?.current);
      setIsAtTop(isAtTop);
      console.log('isAtTop', isAtTop);
      document.addEventListener('mousedown', outsideClickHandler);
      return () =>
        document.removeEventListener('mousedown', outsideClickHandler);
    } else {
      const { label } =
        filterOptions.find((option) => option.label === searchInputValue) || {};
      setSearchInputValue(label || '');
      if (inputRef && inputRef.current) inputRef.current.blur();
      return;
    }
  }, [isOpenDropdown]);
  return (
    <div
      ref={containerRef}
      className={`relative w-full z-1 ${containerClassName}`}
    >
      <Input
        ref={inputRef}
        className="pr-5"
        onChange={setSearchInputValue}
        onMouseDown={onFocus}
        onKeyDown={onInputKeyDown}
        placeholder={placeholder}
        value={searchInputValue || ''}
      />
      <div
        className={`${iconClassName} ${
          isOpenDropdown ? 'rotate-180' : 'rotate-0'
        }`}
      >
        <IoMdArrowDropdown />
      </div>
      {isOpenDropdown && (
        <div
          className={`absolute left-0 w-full ${
            isOpenDropdown ? '' : 'hidden'
          } ${isAtTop ? 'top-full' : 'bottom-full'}`}
        >
          <AutoSizer disableHeight>
            {({ width }: { width: number }) => (
              <List
                deferredMeasurementCache={cache}
                className={`${defaultDropdownClassName} ${dropdownClassName}`}
                height={maxHeight}
                rowCount={rowCount || 1}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                scrollToIndex={scrollToIndex}
                width={width}
                {...listProps}
              />
            )}
          </AutoSizer>
        </div>
      )}
    </div>
  );
}

Dropdown.propTypes = {
  containerClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  listProps: PropTypes.object,
  maxHeight: PropTypes.number,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    }),
  ),
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

Dropdown.defaultProps = {
  containerClassName: '',
  dropdownClassName: '',
  listProps: {},
  maxHeight: 150,
  onChange: () => {},
  options: [],
  placeholder: '',
  value: '',
};

export default Dropdown;
