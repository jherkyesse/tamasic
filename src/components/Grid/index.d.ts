export type GridCellProps = {
  background?: string;
  col?: number;
  color?: string;
  disabled?: boolean;
  editable?: boolean;
  key?: string;
  label?: string;
  left?: number;
  multiRow?: number;
  row?: number;
  state?: string;
  textAlign?: 'left' | 'center' | 'right';
  top?: number;
  type?: string;
  unfilterable?: boolean;
  unmodifiable?: boolean;
  unsortable?: boolean;
  value?: string | number | boolean;
  width?: number;
  [key: string]: any;
};

export type GridDataProps = {
  index: number;
  order?: { value: number };
  row?: number;
  [key: string]: any;
};

export type CellRendererProps = {
  columnIndex: number;
  key: string;
  parent?: object;
  rowIndex: number;
  style: { height: number; left: number; top: number; width: number };
};
