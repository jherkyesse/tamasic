import { createContext } from 'react';

type GridContextProps = {
  cache?: object;
  columnCount?: number;
  columnPropsList?: Array<object>;
  data?: Array<object>;
  getColumnWidth?: Function;
  getHeaderRowWidth?: Function;
  getStickyColumnWidth?: Function;
  headerList?: Array<any>;
  headerKeyList?: Array<string>;
  headerRowCount?: number;
  height?: number;
  onChange?: Function;
  rowCount?: number;
  selectable?: boolean;
  stickyColumnCount?: number;
  stickyColumnPropsList?: Array<object>;
  stickyHeaderList?: Array<object>;
  stickyHeaderKeyList?: Array<string>;
  stickyHeaderRowCount?: number;
  stickyWidth?: number;
};

const GridContext = createContext({} as GridContextProps);
const GridProvider = GridContext.Provider;
const GridConsumer = GridContext.Consumer;

export default GridContext;
export { GridProvider, GridConsumer };
