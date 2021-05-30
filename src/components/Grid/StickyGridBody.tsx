import React, { useContext, memo } from 'react';
import { Grid } from 'react-virtualized';
import Checkbox from '../Checkbox';
import GridContext from './GridContext';
import { CellRendererProps } from './index.d';
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
    filteredData = [],
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
  const rowCount = filteredData.length;
  const cellRenderer = ({
    key,
    columnIndex,
    rowIndex,
    style,
  }: CellRendererProps) => {
    const headerKey = stickyColumnKeyList[columnIndex];

    const { row = 1 } = filteredData[rowIndex] || {};
    if (row === 0) return null;
    const { changeValue, isDisabled, value } =
      (filteredData[rowIndex] || {})[headerKey] || {};
    const { width = 100, label, type = 'label', textAlign } =
      stickyColumnPropsList[columnIndex] || {};

    const Select = () => {
      const onChecked = (changeValue?: boolean) => {
        const nextData = [...data];
        const { index } = filteredData[rowIndex] || {};
        nextData[index][headerKey] = {
          ...nextData[index][headerKey],
          changeValue,
        };
        onChange && onChange(nextData);
      };
      return (
        <div className="w-full flex justify-center">
          <Checkbox disabled={isDisabled} onChange={onChecked} checked={changeValue} />
        </div>
      );
    };
    const Label = () => {
      return <div className="whitespace-wrap break-words w-full">{value}</div>;
    };
    const renderMap = {
      checkbox: Select,
      label: Label,
      number: Label,
    };
    const Renderer = memo(renderMap[type]);
    return (
      <div
        key={key}
        className={defaultBodyClassName}
        style={{
          ...style,
          width: width || style.width,
          textAlign,
          height: row * cellHeight,
        }}
        role="presentation"
      >
        <Renderer />
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
