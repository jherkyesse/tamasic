import React, { useContext } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import GridContext from './GridContext';
import FilterInput from './FilterInput';
import { cellHeight, defaultHeaderClassName } from './config';
import { CellRendererProps } from './type';

const defaultGridHeaderClassName =
  'border-b border-gray-300 outline-none !overflow-hidden';

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
    onChangeFilterList,
    stickyColumnCount,
  } = useContext(GridContext);

  const height = (headerRowCount + +filterable) * cellHeight;
  const cellRenderer = ({
    columnIndex,
    rowIndex,
    key,
    style,
  }: CellRendererProps) => {
    if (filterable && rowIndex === headerRowCount) {
      const { width, left, top } = columnPropsList[columnIndex];
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
              columnIndex={columnIndex + stickyColumnCount}
              key={key}
              value={filterList[columnIndex+ stickyColumnCount]}
              onChange={onChangeFilterList}
            />
          )}
        </div>
      );
    }
    const { label, background, color, width = 100, left, top, textAlign, row } =
      headerList[rowIndex][columnIndex] || {};
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
        {/* {filterable && (
            <input value={filterList[columnIndex]} onChange={onChange} />
          )} */}
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
