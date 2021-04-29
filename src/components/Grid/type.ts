export type GridCellProps = {
  background?: string;
  color?: string;
  editable?: boolean;
  index: number;
  key: string;
  label: string;
  left?: number;
  row?: number;
  state?: string;
  textAlign?: 'left' | 'center' | 'right';
  top?: number;
  type?: string;
  width?: number;
};

export type CellRendererProps = {
  columnIndex: number;
  key: string;
  parent: object;
  rowIndex: number;
  style: { height: number; left: number; top: number; width: number };
};
