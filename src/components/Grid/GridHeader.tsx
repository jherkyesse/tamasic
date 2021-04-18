import React, { useContext } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import GridContext from './GridContext';
import { cache } from './config';

type GridHeaderProps = {
  width: number;
  scrollLeft: number;
};

function GridHeader({ width, scrollLeft }: GridHeaderProps) {
  const { columnCount, headerList, headerRowCount, height } = useContext(
    GridContext,
  );
  const getColumnWidth = ({ index }) =>
    headerList[headerList.length - 1].map(({ width = 100 }) => width)[index];
  const renderHeaderCell = ({ columnIndex, rowIndex, key, style, parent }) => {
    const header = headerList[rowIndex][columnIndex] || {};
    console.log('header', header);
    if (!Object.keys(header).length) return null;
    const { label, background, color, width = 100, left } = header;
    function onChange({ target: { value } }) {
      // if (!setFilterList) return;
      // const newData = [...filterList];
      // newData[columnIndex] = value;
      // setFilterList(newData);
    }
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        columnIndex={columnIndex}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          style={{
            ...style,
            background,
            color,
            width: width || style.width,
            left: left || style.left,
          }}
          role="presentation"
        >
          <div>{label}</div>
          {/* {filterable && (
            <input value={filterList[columnIndex]} onChange={onChange} />
          )} */}
        </div>
      </CellMeasurer>
    );
  };
  return (
    <Grid
      cellRenderer={renderHeaderCell}
      width={width}
      height={height}
      rowHeight={cache.rowHeight}
      columnWidth={getColumnWidth}
      deferredMeasurementCache={cache}
      rowCount={headerRowCount}
      columnCount={columnCount}
      scrollLeft={scrollLeft}
    />
  );
}

export default GridHeader;
