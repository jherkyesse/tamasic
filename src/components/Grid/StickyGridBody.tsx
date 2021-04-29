import React, { useContext, useEffect } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import GridContext from './GridContext';
import { CellRendererProps } from './type';
import { cellHeight } from './config';

const defaultStickyGridClassName = 'outline-none !overflow-hidden';
const defaultBodyClassName = 'border-r border-b border-gray-300 text-xs p-1';

type StickyGridBodyProps = {
  scrollTop: number;
};

function StickyGridBody({ scrollTop }: StickyGridBodyProps) {
  const {
    cache,
    data = [],
    filterData = [],
    getStickyColumnWidth,
    height,
    onChange,
    stickyColumnCount,
    stickyColumnPropsList = [],
    stickyColumnKeyList = [],
    stickyWidth,
  } = useContext(GridContext);
  const rowCount = filterData.length;
  const cellRenderer = ({
    key,
    parent,
    columnIndex,
    rowIndex,
    style,
  }: CellRendererProps) => {
    const headerKey = stickyColumnKeyList[columnIndex];

    console.log('filterData', filterData, rowIndex);
    
    const { value, changeValue } = filterData[rowIndex][headerKey] || {};
    const { width = 100, type, textAlign } =
      stickyColumnPropsList[columnIndex] || {};

    const Checkbox = (defaultValue: boolean) => {
      const onChecked = () => {
        const nextData = [...data];
        const { index } = filterData[rowIndex];
        nextData[index][headerKey] = {
          ...nextData[index][headerKey],
          changeValue: !defaultValue,
        };

        onChange && onChange(nextData);
      };
      return (
        <input type="checkbox" onChange={onChecked} checked={changeValue} />
      );
    };
    const renderMap = {
      checkbox: Checkbox,
    };

    return (
      // <CellMeasurer
      //   key={key}
      //   cache={cache}
      //   columnIndex={columnIndex}
      //   parent={parent}
      //   rowIndex={rowIndex}
      // >
        <div
        key={key}
          className={defaultBodyClassName}
          style={{
            ...style,
            width: width || style.width,
            textAlign,
          }}
          role="presentation"
        >
          <div className="whitespace-wrap break-words">
            {((renderMap[type] && renderMap[type](changeValue ?? value)) ||
              changeValue) ??
              value}
          </div>
        </div>
      // </CellMeasurer>
    );
  };
  useEffect(() => {
    cache.clearAll();
  }, [cache]);
  return (
    <>
      <Grid
        className={defaultStickyGridClassName}
        cellRenderer={cellRenderer}
        width={stickyWidth}
        height={height}
        // rowHeight={cache.rowHeight}
        rowHeight={cellHeight}
        columnWidth={getStickyColumnWidth}
        // deferredMeasurementCache={cache}
        rowCount={rowCount || 1}
        columnCount={stickyColumnCount}
        scrollTop={scrollTop}
      />
    </>
  );
}

export default StickyGridBody;
