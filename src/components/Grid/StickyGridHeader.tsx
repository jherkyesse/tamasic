import React, { useContext } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from 'react-icons/fc';
import GridContext from './GridContext';
import { cellHeight, defaultHeaderClassName } from './config';
import { CellRendererProps } from './type';
import FilterInput from './FilterInput';

const defaultStickyGridHeaderClassName =
  'border-b border-r border-gray-300 outline-none !overflow-x-hidden select-none';

function StickyGridHeader() {
  const {
    filterList,
    filterable,
    getStickyColumnWidth,
    headerRowCount,
    isSortAsc,
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
      top,
      textAlign,
      row,
      unsortable,
      width = 100,
    } = (stickyHeaderList[rowIndex] || {})[columnIndex] || {};
    const height = (row || 1) * cellHeight;
    const isSorted = sortKey === key;
    const isColumnKeyRow = rowIndex === stickyHeaderRowCount - 1;
    const onClick = () => {
      if (unsortable || !isColumnKeyRow) return;
      setIsSortAsc(!isSortAsc);
      if (sortKey !== key) setSortKey(key);
    };

    return (
      <div
        key={cellRendererKey}
        role="presentation"
        className={defaultHeaderClassName}
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
