 

import React, { useContext, useEffect } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import GridContext from './GridContext';

const defaultStickyGridBodyClassName = 'outline-none';
const defaultBodyClassName = 'border-r border-b border-gray-300 text-xs p-1';

type StickyGridBodyProps = {
  scrollLeft: number;
};

function StickyGridBody({ scrollTop }: StickyGridBodyProps) {
  const {
    cache,
    stickyColumnCount,
    stickyColumnPropsList,
    data,
    getStickyColumnWidth,
    stickyHeaderKeyList,
    height,
    rowCount,
    stickyWidth,
  } = useContext(GridContext);
  useEffect(() => {
    cache?.clearAll();
  }, [])
  const cellRenderer = ({ key, parent, columnIndex, rowIndex, style }) => {
    const label = data[rowIndex][stickyHeaderKeyList[columnIndex]];
    const { width = 100 } = stickyColumnPropsList[columnIndex] || {};
    
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
          style={{
            ...style,
            width: width || style.width,
          }}
          role="presentation"
        >
          <div className="whitespace-wrap break-words">{label}</div>
          {/* {filterable && (
            <input value={filterList[columnIndex]} onChange={onChange} />
          )} */}
        </div>
      </CellMeasurer>
    );
  };
  return (
    <>
      <Grid
        className={defaultStickyGridBodyClassName}
        cellRenderer={cellRenderer}
        width={stickyWidth}
        height={height}
        rowHeight={cache?.rowHeight}
        columnWidth={getStickyColumnWidth}
        deferredMeasurementCache={cache}
        rowCount={rowCount || 1}
        columnCount={stickyColumnCount}
        scrollTop={scrollTop}
      />
    </>
  );
}

export default StickyGridBody;
