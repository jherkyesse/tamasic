import { createContext } from 'react';
import { CellMeasurerCacheInterface } from 'react-virtualized';
import { GridCellProps, GridDataProps } from './type';

type GridContextProps = {
  cache?: CellMeasurerCacheInterface;
  columnCount: number;
  columnKeyList: Array<string>;
  columnPropsList: Array<GridCellProps>;
  columnWidthList: Array<number>;
  data?: Array<GridDataProps>;
  filterable: boolean;
  filterList: Array<string>;
  filterData: Array<GridDataProps>;
  getColumnWidth?: ({ index }: { index: number }) => void;
  getHeaderRowWidth?: ({ index }: { index: number }) => void;
  getStickyColumnWidth?: ({ index }: { index: number }) => void;
  headerList: Array<Array<GridCellProps>>;
  headerKeyList: Array<Array<string>>;
  headerRowCount: number;
  height?: number;
  isSortAsc?: boolean;
  onChange?: Function;
  onChangeFilterList?: (value: string, index: number) => void;
  overscanColumnCount?: number;
  overscanRowCount?: number;
  readOnly: boolean;
  rowCount: number;
  selectable?: boolean;
  setColumnWidthList: Function;
  setIsSortAsc: (isSortAsc: boolean) => void;
  setSortKey: (sortKey?: string) => void;
  sortable?: boolean;
  sortKey?: string;
  stickyColumnCount: number;
  stickyColumnPropsList: Array<GridCellProps>;
  stickyHeaderList: Array<Array<GridCellProps>>;
  stickyHeaderKeyList: Array<Array<string>>;
  stickyHeaderRowCount: number;
  stickyColumnKeyList: Array<string>;
  stickyWidth?: number;
};

const GridContext = createContext({} as GridContextProps);
const GridProvider = GridContext.Provider;
const GridConsumer = GridContext.Consumer;

export default GridContext;
export { GridProvider, GridConsumer };
