import React, { useContext } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import GridContext from './GridContext';
import { cellHeight } from './config';

const defaultGridBodyClassName = 'outline-none';
const defaultBodyClassName = 'border-r border-b border-gray-300 p-1 text-xs';

type GridBodyProps = {
  width: number;
  onScroll: Function;
  scrollLeft: number;
  scrollTop: number;
};

function GridBody({ width, onScroll, scrollLeft, scrollTop }: GridBodyProps) {
  const {
    cache,
    columnCount,
    columnPropsList,
    data,
    getColumnWidth,
    headerKeyList,
    height,
    rowCount,
  } = useContext(GridContext);
  const cellRenderer = ({ columnIndex, rowIndex, key, style, parent }) => {
    const label = data[rowIndex][headerKeyList[columnIndex]];
    const { width = 100 } = columnPropsList[columnIndex] || {};
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
          className={defaultBodyClassName}
          style={{ ...style, width: width || style.width }}
          role="presentation"
        >
          <div className="w-full break-words">{label}</div>
          {/* {filterable && (
            <input value={filterList[columnIndex]} onChange={onChange} />
          )} */}
        </div>
      </CellMeasurer>
    );
  };
  return (
    <Grid
      className={defaultGridBodyClassName}
      cellRenderer={cellRenderer}
      width={width}
      height={height}
      rowHeight={cache?.rowHeight}
      overscanColumnCount={10}
      columnWidth={getColumnWidth}
      deferredMeasurementCache={cache}
      rowCount={rowCount || 1}
      columnCount={columnCount}
      scrollLeft={scrollLeft}
      scrollTop={scrollTop}
      onScroll={onScroll}
    />
  );
}

export default GridBody;
