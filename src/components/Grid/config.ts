import { CellMeasurerCache } from 'react-virtualized';

export const defaultHeaderClassName =
  'border-b border-r border-gray-300 flex justify-center items-center text-xs !overflow-hidden';

export const stickyClassName = 'sticky left-0 bg-white z-50';

export const cellHeight = 24;
export const cellFullHeight = 25; // border-width-bottom: 1px;

export const contextMenuIconSize = 24;

export const columnWidth = 100;
export const cache = new CellMeasurerCache({
  defaultWidth: columnWidth,
  defaultHeight: cellHeight,
  minWidth: 60,
  fixedWidth: true,
  fixedHeight: false,
});

export const perfectScrollbarConfig = {
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 22,
};
