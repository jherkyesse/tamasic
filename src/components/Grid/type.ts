export type GridCellProps = {
  background?: string;
  col?: number;
  color?: string;
  disabled?: boolean;
  editable?: boolean;
  key?: string;
  label?: string;
  left?: number;
  row?: number;
  state?: string;
  textAlign?: string;
  top?: number;
  type?: string;
  unfilterable?: boolean;
  unmodifiable?: boolean;
  unsortable?: boolean;
  value?: string | number | boolean;
  width?: number;
};

export type GridDataProps = {
  index: number;
  order?: { value: number | string };
  row?: number;
};

export type CellRendererProps = {
  columnIndex: number;
  key: string;
  parent?: object;
  rowIndex: number;
  style: { height: number; left: number; top: number; width: number };
};
