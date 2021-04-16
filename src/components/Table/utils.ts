interface SelectTableProps {
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
}

export function isMultiSelected({
  fromX,
  fromY,
  toX,
  toY,
}: SelectTableProps): boolean {
  return fromX !== toX || fromY !== toY;
}
