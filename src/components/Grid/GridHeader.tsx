import React, { useContext } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import GridContext from './GridContext';
import { cellHeight } from './config';

const defaultGridHeaderClassName =
  'border-b border-gray-300 outline-none !overflow-x-hidden';
const defaultHeaderClassName =
  'flex items-center justify-center border-r border-gray-300 text-xs';

type GridHeaderProps = {
  width: number;
  scrollLeft: number;
};

function GridHeader({ width, scrollLeft }: GridHeaderProps) {
  const {
    columnCount,
    getColumnWidth,
    getHeaderRowWidth,
    headerList,
    headerRowCount,
  } = useContext(GridContext);
  const headerHeight = headerRowCount * cellHeight;
  const cellRenderer = ({ columnIndex, rowIndex, key, style, parent }) => {
    const header = headerList[rowIndex][columnIndex] || {};
    if (!Object.keys(header).length) return null;
    const { label, background, color, width = 100, left } = header;
    function onChange({ target: { value } }) {
      // if (!setFilterList) return;
      // const newData = [...filterList];
      // newData[columnIndex] = value;
      // setFilterList(newData);
    }
    return (
      <div
        key={key}
        style={{
          ...style,
          background,
          color,
          width: width || style.width,
          left: left || style.left,
        }}
        role="presentation"
        className={defaultHeaderClassName}
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
      height={headerHeight}
      rowHeight={getHeaderRowWidth}
      columnWidth={getColumnWidth}
      rowCount={headerRowCount}
      columnCount={columnCount}
      scrollLeft={scrollLeft}
    />
  );
}

export default GridHeader;
