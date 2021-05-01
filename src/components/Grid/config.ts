import { CellMeasurerCache } from 'react-virtualized';

export const tableClassName =
  'select-none table-fixed border-0 outline-none border-spacing-0 border-separate cursor-cell';
export const tableTheadClassName = 'border-b-1 border-gray-300';
export const tableTheadTrClassName = 'last:border-r-0';
export const tableTheadThClassName =
  'sticky h-24px top-0 border-b border-r p-1 bg-gray-300 z-40';
export const tableTbodyClassName = 'w-full';
export const tableTbodyTrClassName = 'last:border-r-0';
export const tableTbodyTdClassName =
  'relative border-r border-b align-baseline whitespace-nowrap px-5px py-3px leading-5 z-0';

export const defaultHeaderClassName =
  'border-b border-r border-gray-300 flex justify-center items-center text-xs';

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
