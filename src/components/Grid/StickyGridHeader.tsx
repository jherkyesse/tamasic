
import React, { useContext } from 'react';
import { Grid, CellMeasurer } from 'react-virtualized';
import GridContext from './GridContext';
import { cellHeight } from './config';

const defaultStickyGridHeaderClassName =
  'border-b border-gray-300 outline-none';
const defaultHeaderClassName =
  'border-r border-gray-300 flex justify-center items-center text-xs';

function StickyGridHeader() {
  const {
    columnCount,
    getStickyColumnWidth,
    headerList,
    headerRowCount,
    stickyHeaderRowCount,
    stickyWidth,
    stickyHeaderList,
    stickyHeaderKeyList,
    stickyColumnCount,
  } = useContext(GridContext);

  const height = stickyHeaderRowCount * cellHeight;
  const cellRenderer = ({ columnIndex, rowIndex, key, style, parent }) => {
    const header =
      stickyHeaderList[rowIndex][columnIndex] || {};
    const {
      label,
      background,
      color,
      width = 100,
      left,
      top,
      textAlign,
      row,
    } = header;
    const height = (row || 1) * cellHeight;
    function onChange({ target: { value } }) {
      // if (!setFilterList) return;
      // const newData = [...filterList];
      // newData[columnIndex] = value;
      // setFilterList(newData);
    }
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
      className={defaultStickyGridHeaderClassName}
      cellRenderer={cellRenderer}
      width={stickyWidth}
      height={height}
      rowHeight={cellHeight}
      columnWidth={getStickyColumnWidth}
      rowCount={headerRowCount}
      columnCount={stickyColumnCount}
    />
  );
}

export default StickyGridHeader;
