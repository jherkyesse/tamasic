import React, { useContext } from 'react';
import { Grid } from 'react-virtualized';
import GridContext from './GridContext';
import { CellRendererProps } from './type';
import { cellHeight } from './config';

const defaultStickyGridClassName = 'outline-none !overflow-hidden';
const defaultBodyClassName =
  'border-r border-b border-gray-300 dark:border-gray-400 text-black dark:text-gray-200 text-xs p-1 flex items-center';

type StickyGridBodyProps = {
  scrollTop: number;
};

function StickyGridBody({ scrollTop }: StickyGridBodyProps) {
  const {
    data = [],
    filterData = [],
    getStickyColumnWidth,
    getStickyRowWidth,
    height,
    onChange,
    overscanRowCount,
    stickyColumnCount,
    stickyColumnPropsList = [],
    stickyColumnKeyList = [],
    stickyWidth,
  } = useContext(GridContext);
  const rowCount = filterData.length;
  const cellRenderer = ({
    key,
    columnIndex,
    rowIndex,
    style,
  }: CellRendererProps) => {
    const headerKey = stickyColumnKeyList[columnIndex];

    const { row = 1 } = filterData[rowIndex] || {};
    if (row === 0) return null;
    const { value, changeValue } =
      (filterData[rowIndex] || {})[headerKey] || {};
    const { width = 100, type = 'label', textAlign } =
      stickyColumnPropsList[columnIndex] || {};

    const Checkbox = (defaultValue: boolean) => {
      const onChecked = () => {
        const nextData = [...data];
        const { index } = filterData[rowIndex] || {};
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
      <div
        key={`${type}-${key}`}
        className={defaultBodyClassName}
        style={{
          ...style,
          width: width || style.width,
          textAlign,
          height: row * cellHeight,
        }}
        role="presentation"
      >
        <div className="whitespace-wrap break-words w-full">
          {((renderMap[type] && renderMap[type](changeValue ?? value)) ||
            changeValue) ??
            value}
        </div>
      </div>
    );
  };
  return (
    <Grid
      className={defaultStickyGridClassName}
      cellRenderer={cellRenderer}
      width={stickyWidth}
      height={height}
      rowHeight={getStickyRowWidth}
      columnWidth={getStickyColumnWidth}
      overscanRowCount={overscanRowCount}
      rowCount={rowCount || 1}
      columnCount={stickyColumnCount}
      scrollTop={scrollTop}
    />
  );
}

export default StickyGridBody;
