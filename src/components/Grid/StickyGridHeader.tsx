import React, { useContext } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import GridContext from './GridContext';
import { cellHeight, defaultHeaderClassName } from './config';
import { CellRendererProps } from './type';
import FilterInput from './FilterInput';

const defaultStickyGridHeaderClassName =
  'border-b border-gray-300 outline-none !overflow-x-hidden';

function StickyGridHeader() {
  const {
    columnCount,
    filterList,
    filterable,
    getStickyColumnWidth,
    headerList,
    headerRowCount,
    onChangeFilterList,
    setFilterList,
    stickyHeaderRowCount,
    stickyWidth,
    stickyHeaderList,
    stickyHeaderKeyList,
    stickyColumnPropsList,
    stickyColumnCount,
  } = useContext(GridContext);

  const height = (stickyHeaderRowCount + +filterable) * cellHeight;
  const cellRenderer = ({
    columnIndex,
    rowIndex,
    key,
    style,
  }: CellRendererProps) => {
    if (filterable && rowIndex === headerRowCount) {
      const { width, left, top } = stickyColumnPropsList[columnIndex];
      return (
        <div
          key={key}
          className={defaultHeaderClassName}
          style={{
            ...style,
            width: width || style.width,
            left: left ?? style.left,
            top: top ?? style.top,
          }}
          role="presentation"
        >
          {filterable && rowIndex === headerRowCount && (
            <FilterInput
              columnIndex={columnIndex}
              key={key}
              value={filterList[columnIndex]}
              onChange={onChangeFilterList}
            />
          )}
        </div>
      );
    }

    const { label, background, color, width = 100, left, top, textAlign, row } =
      (stickyHeaderList[rowIndex] || {})[columnIndex] || {};
    const height = (row || 1) * cellHeight;

    return (
      <div
        key={key}
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
        }}
        role="presentation"
      >
        <div>{label}</div>
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
