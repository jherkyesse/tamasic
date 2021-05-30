import React, { useContext, memo } from 'react';
import { Grid } from 'react-virtualized';
import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa } from 'react-icons/fc';
import Checkbox from '../Checkbox';
import GridContext from './GridContext';
import FilterInput from './FilterInput';
import { cellHeight, defaultHeaderClassName } from './config';
import { CellRendererProps } from './index.d';

const defaultGridHeaderClassName =
  'border-b border-gray-300 dark:border-gray-400 outline-none !overflow-hidden select-none';

type GridHeaderProps = {
  width: number;
  scrollLeft: number;
};

function GridHeader({ width, scrollLeft }: GridHeaderProps) {
  const {
    columnCount,
    columnPropsList,
    data,
    filterable,
    filterList,
    filteredData,
    getColumnWidth,
    headerList,
    headerRowCount,
    isSortAsc,
    onChange,
    onChangeFilterList,
    setIsSortAsc,
    setSortKey,
    sortKey,
    stickyColumnCount,
  } = useContext(GridContext);

  const height = (headerRowCount + +filterable) * cellHeight;
  const cellRenderer = ({ columnIndex, rowIndex, key: cellRendererKey, style }: CellRendererProps) => {
    if (filterable && rowIndex === headerRowCount) {
      const { width, unfilterable } = columnPropsList[columnIndex];
      return (
        <div
          key={cellRendererKey}
          className={defaultHeaderClassName}
          style={{
            ...style,
            width: width || style.width,
          }}
          role="presentation"
        >
          <FilterInput
            unfilterable={unfilterable}
            columnIndex={columnIndex + stickyColumnCount}
            value={filterList[columnIndex + stickyColumnCount]}
            onChange={onChangeFilterList}
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
      row,
      top,
      type = 'label',
      textAlign,
      unsortable,
      width = 100,
    } = headerList[rowIndex][columnIndex] || {};
    const height = (row || 1) * cellHeight;
    const isSorted = sortKey === key;
    const isColumnKeyRow = rowIndex === headerRowCount - 1;
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
      dropdown: Label,
      label: Label,
      number: Label,
      multiline: Label,
    };
    const Renderer = memo(renderMap[type]);
    return (
      <div
        key={cellRendererKey}
        className={defaultHeaderClassName}
        role="presentation"
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
      className={defaultGridHeaderClassName}
      cellRenderer={cellRenderer}
      width={width}
      height={height}
      rowHeight={cellHeight}
      columnWidth={getColumnWidth}
      rowCount={headerRowCount + +filterable}
      columnCount={columnCount}
      scrollLeft={scrollLeft}
    />
  );
}

export default GridHeader;
