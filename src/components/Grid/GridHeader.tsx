import React, { useContext } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from 'react-icons/fc';
import GridContext from './GridContext';
import FilterInput from './FilterInput';
import { cellHeight, defaultHeaderClassName } from './config';
import { CellRendererProps } from './type';

const defaultGridHeaderClassName =
  'border-b border-gray-300 outline-none !overflow-hidden select-none';

type GridHeaderProps = {
  width: number;
  scrollLeft: number;
};

function GridHeader({ width, scrollLeft }: GridHeaderProps) {
  const {
    columnCount,
    columnPropsList,
    filterable,
    filterList,
    getColumnWidth,
    headerList,
    headerRowCount,
    isSortAsc,
    onChangeFilterList,
    setIsSortAsc,
    setSortKey,
    sortKey,
    stickyColumnCount,
  } = useContext(GridContext);

  const height = (headerRowCount + +filterable) * cellHeight;
  const cellRenderer = ({
    columnIndex,
    rowIndex,
    key: cellRendererKey,
    style,
  }: CellRendererProps) => {
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
      if (sortKey !== key) setSortKey(key);
    };

    return (
      <div
        key={cellRendererKey}
        className={defaultHeaderClassName}
        role="presentation"
        style={{
          ...style,
          background: background || '#ececec',
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
        <div>{label}</div>
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
