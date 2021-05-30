import React, { useContext, memo } from 'react';
import { Grid } from 'react-virtualized';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from 'react-icons/fc';
import GridContext from './GridContext';
import { cellHeight, defaultHeaderClassName } from './config';
import { CellRendererProps } from './index.d';
import FilterInput from './FilterInput';
import Checkbox from '../Checkbox';

const defaultStickyGridHeaderClassName =
  'border-b border-r border-gray-300 outline-none !overflow-x-hidden select-none';

function StickyGridHeader() {
  const {
    data,
    filteredData,
    filterList,
    filterable,
    getStickyColumnWidth,
    headerRowCount,
    isSortAsc,
    onChange,
    onChangeFilterList,
    setIsSortAsc,
    setSortKey,
    sortKey,
    stickyHeaderRowCount,
    stickyWidth,
    stickyHeaderList,
    stickyColumnPropsList,
    stickyColumnCount,
  } = useContext(GridContext);

  const height = (stickyHeaderRowCount + +filterable) * cellHeight;
  const cellRenderer = ({
    columnIndex,
    rowIndex,
    key: cellRendererKey,
    style,
  }: CellRendererProps) => {
    if (filterable && rowIndex === stickyHeaderRowCount) {
      const { width, left, unfilterable } = stickyColumnPropsList[columnIndex];
      return (
        <div
          key={cellRendererKey}
          className={defaultHeaderClassName}
          style={{
            ...style,
            width: width || style.width,
            left: left ?? style.left,
          }}
          role="presentation"
        >
          <FilterInput
            columnIndex={columnIndex}
            value={filterList[columnIndex]}
            onChange={onChangeFilterList}
            unfilterable={unfilterable}
          />
        </div>
      );
    }
    const {
      background,
      color,
      label,
      left,
      key,
      textAlign,
      top,
      type = 'label',
      row,
      unsortable,
      width = 100,
    } = (stickyHeaderList[rowIndex] || {})[columnIndex] || {};
    if (row === 0) return null;
    const height = (row || 1) * cellHeight;
    const isSorted = sortKey === key;
    const isColumnKeyRow = rowIndex === stickyHeaderRowCount - 1;
    const onClick = () => {
      if (unsortable || !isColumnKeyRow) return;
      setIsSortAsc(!isSortAsc);
      if (sortKey !== key) setSortKey(key!);
    };
    const Select = () => {
      const isUnchecked = !!filteredData.find((item) => !item[key!]?.changeValue);
      const onChecked = (changeValue?: boolean) => {
        const nextData = [...data];
        filteredData.forEach((item) => {
          const { index } = item;
          nextData[index][key!] = {
            ...nextData[index][key!],
            changeValue,
          };
        });

        onChange && onChange(nextData);
      };
      return <Checkbox onChange={onChecked} checked={!isUnchecked} />;
    };
    const Label = () => {
      return <div>{label}</div>;
    };
    const renderMap = {
      checkbox: Select,
      label: Label,
      number: Label,
    };
    const Renderer = memo(renderMap[type]);
    return (
      <div
        key={cellRendererKey}
        role="presentation"
        className={defaultHeaderClassName}
        style={{
          ...style,
          background: background,
          color,
          width: width || style.width,
          height: height ?? style.height,
          left: left ?? style.left,
          top: top ?? style.top,
          textAlign: textAlign || 'center',
          cursor: unsortable || !isColumnKeyRow ? 'default' : 'pointer',
        }}
        onClick={onClick}
      >
        <Renderer />
        {isSorted &&
          (isSortAsc ? (
            <FcAlphabeticalSortingAz size={20} className="mx-1" />
          ) : (
            <FcAlphabeticalSortingZa size={20} className="mx-1" />
          ))}
      </div>
    );
  };

  return (
    <Grid
      className={defaultStickyGridHeaderClassName}
      cellRenderer={cellRenderer}
      width={stickyWidth}
      height={height}
      rowHeight={cellHeight}
      columnWidth={getStickyColumnWidth}
      rowCount={headerRowCount + +filterable}
      columnCount={stickyColumnCount}
    />
  );
}

export default StickyGridHeader;
