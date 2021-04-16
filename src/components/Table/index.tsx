import React, { useState, useEffect, useRef } from 'react';
import Scrollbar from '../Scrollbar';
import CellTextarea from './CellTextarea';
import { TableProvider } from './TableContext';
import { isMultiSelected } from './utils';
import {
  tableClassName,
  tableTheadClassName,
  tableTheadTrClassName,
  tableTheadThClassName,
  tableTbodyClassName,
  tableTbodyTrClassName,
  tableTbodyTdClassName,
  stickyClassName,
  cellHeight,
} from './config';

type TableProps = {
  data?: { [key: string]: string }[];
  headerKeyList: string[];
  headerList: { [key: string]: string }[];
  onChange?: Function;
};

type TableCellProps = {
  isEdited?: boolean;
  isSelected?: boolean;
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
  copyboardList?: string[];
};

function Table({
  data = [],
  headerKeyList = [],
  headerList = [],
  onChange,
}: TableProps) {
  const rowCount = data.length;
  const columnCount = headerList.length;
  const stickyMap = headerList.flat().reduce((acc, { key, sticky }) => {
    if (sticky) acc[key] = sticky;
    return acc;
  }, {});

  const [state, setState] = useState({
    isEdited: false,
    isSelected: false,
    copyboardList: [''],
    fromX: undefined,
    fromY: undefined,
    toX: undefined,
    toY: undefined,
  });
  const {
    isEdited,
    isSelected,
    copyboardList = [],
    fromX,
    fromY,
    toX,
    toY,
  } = state as TableCellProps;
  function resetSelectedCell() {
    setState({ ...state, fromX: undefined, fromY: undefined });
  }

  function keyUp() {
    if (!fromX || fromY === 0) return;
    const newY = fromY! - 1;
    setState({ ...state, fromY: newY, toX: undefined, toY: newY });
  }
  function keyDown() {
    if (!fromX || fromY === rowCount - 1) return;
    const newY = fromY! + 1;
    setState({ ...state, fromY: newY, toX: undefined, toY: newY });
  }
  function keyLeft() {
    if (!fromX || fromX === 0) return;
    const newX = fromX - 1;
    // if (newX < contentEditableActiveLeftCellX) return;
    setState({ ...state, fromX: newX, toX: newX, toY: undefined });
  }
  function keyRight() {
    if (!fromX || fromX === columnCount - 1) return;
    const newX = fromX + 1;
    setState({ ...state, fromX: newX, toX: newX, toY: undefined });
  }
  function selectKeyUp() {
    if (toY === 0) return;
    setState({ ...state, toY: toY! - 1, isSelected: false });
  }
  function selectKeyDown() {
    if (toY === rowCount) return;
    setState({ ...state, toY: toY! + 1, isSelected: false });
  }
  function selectKeyLeft() {
    // if (toX === 0 || toX === contentEditableActiveLeftCellX)
    //   return;
    setState({ ...state, toX: toX! - 1, isSelected: false });
  }
  function selectKeyRight() {
    if (toX === columnCount) return;
    setState({ ...state, toX: toX! + 1, isSelected: false });
  }

  const move = {
    ArrowLeft: keyLeft,
    ArrowRight: keyRight,
    ArrowUp: keyUp,
    ArrowDown: keyDown,
  };
  const moveUpDown = {
    ArrowUp: keyUp,
    ArrowDown: keyDown,
  };
  const moveSelect = {
    ArrowLeft: selectKeyLeft,
    ArrowRight: selectKeyRight,
    ArrowUp: selectKeyUp,
    ArrowDown: selectKeyDown,
  };

  function onCopy() {}
  function onCut() {}
  function onPaste(e) {
    if (!isMultiSelected({ fromX, toX, fromY, toY })) {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain');
      document.execCommand('insertHTML', false, text);
    } else {
      const startX = Math.min(fromX!, toX!);
      const startY = Math.min(fromY!, toY!);
      const nextData = [...data];
      for (let j = startY; j <= Math.max(fromY!, toY!); j++) {
        for (let i = startX; i <= Math.max(fromX!, toX!); i++) {
          if (
            i - startX < copyboardList[0].length &&
            j - startY < copyboardList.length
          )
            nextData[j][headerList[i]?.key] = (copyboardList[j - startY] || {})[
              i - startX
            ];
        }
      }
      resetSelectedCell();
      onChange(nextData);
    }
  }

  function onKeyDown(e) {
    console.log('e', e);

    const { key, code, shiftKey, ctrlKey } = e;
    if (ctrlKey) {
      if (key === 'c') onCopy();
      else if (key === 'x') onCut();
      else if (key === 'v') onPaste(e);
      return;
    }
    if (isEdited && key === 'Escape') setState({ ...state, isEdited: false });
    else if (
      !isEdited &&
      (key === 'Delete' || key === 'Backspace') &&
      onChange
    ) {
      const nextData = [...data];
      for (let i = Math.min(toX!, fromX!); i <= Math.max(toX!, fromX!); i++) {
        for (let j = Math.min(fromY!, toY!); j <= Math.max(fromY!, toY!); j++) {
          nextData[j] = {
            ...nextData[j],
            [headerList[i]?.key]: '',
          };
        }
      }
      console.log(nextData);

      onChange(nextData);
      return;
    }
    // if (gridEdit && key === 'Escape') setGridEdit(false);
    // if (!gridEdit && (key === 'Delete' || key === 'Backspace')) {
    //   const nextData = [...data];
    //   for (
    //     let i = Math.min(toX, fromX);
    //     i <= Math.max(toX, fromX);
    //     i++
    //   ) {
    //     for (
    //       let j = Math.min(fromY, toY);
    //       j <= Math.max(fromY, toY);
    //       j++
    //     ) {
    //       nextData[j] = {
    //         ...nextData[j],
    //         [headerList[i]?.key]: '',
    //       };
    //     }
    //   }
    //   onChangeValue(nextData);
    //   return;
    // }
    if (isEdited) {
      if (shiftKey) return;
      if (moveUpDown[key]) {
        e.preventDefault();
        e.stopPropagation();
        setState({ ...state, isEdited: false });
        moveUpDown[key]();
        // const gridScrollContainer = findDOMNode(gridRef.current);
        // if (!gridScrollContainer) return;
        // gridScrollContainer.focus();
      }
    } else if (move[key]) {
      e.preventDefault();
      e.stopPropagation();
      if (shiftKey) {
        // select multi grid
        moveSelect[key]();
      } else {
        move[key]();
      }
    } else if (code.includes('Key')) setState({ ...state, isEdited: true });
  }

  // useEffect(() => {
  //   const tbody = tbodyRef.current;
  //   tbody.addEventListener('keydown', onKeyDown);
  //   return () => tbody.removeEventListener('keydown', onKeyDown);
  // }, [onKeyDown]);

  return (
    <TableProvider value={{ ...state, data }}>
      <div
        className="flex flex-nowrap w-full relative h-80 overflow-auto border border-gray-300 text-xs outline-none"
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="grid"
      >
        <table className={`flex-1 ${tableClassName}`}>
          <tbody className={tableTbodyClassName}>
            {data.map((item, y) => (
              <tr key={y} className={tableTbodyTrClassName}>
                {headerKeyList.map((key, x) => {
                  const value = item[key];
                  const sticky = stickyMap[key];

                  const onMouseDown = () =>
                    setState({
                      ...state,
                      fromX: x,
                      fromY: y,
                      isEdited: isEdited && (fromX !== x || toY !== y),
                    });
                  const onMouseUp = () => {
                    if (!isSelected) return;
                    setState({
                      ...state,
                      isSelected: false,
                    });
                  };
                  const onMouseEnter = () => {
                    if (isEdited || !isSelected) return;
                    setState({
                      ...state,
                      isSelected: true,
                      toX: x,
                      toY: y,
                    });
                  };

                  const isEdit = `${x}-${y}` === `${fromX}-${fromY}`;
                  const isSelected =
                    x >= Math.min(fromX!, toX!) &&
                    x <= Math.max(fromX!, toX!) &&
                    y >= Math.min(fromY!, toY!) &&
                    y <= Math.max(fromY!, toY!);
                  return (
                    <td
                      key={key}
                      data-index={`${x}-${y}`}
                      role="presentation"
                      className={` ${tableTbodyTdClassName} ${
                        isSelected ? 'bg-gray-300' : ''
                      } ${sticky ? 'sticky' : ''} ${
                        fromX === x && fromY === y ? 'active' : ''
                      }`}
                      onMouseDown={onMouseDown}
                      onMouseUp={onMouseUp}
                      onMouseEnter={onMouseEnter}
                    >
                      {isEdit ? <CellTextarea value={value} /> : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <thead className={tableTheadClassName}>
            {headerList.map((header, index) => (
              <tr className={tableTheadTrClassName} key={index}>
                {header.map(
                  ({ label, sticky, background, color, col = 1, row = 1 }) => (
                    <th
                      key={label}
                      colSpan={col}
                      rowSpan={row}
                      className={`${tableTheadThClassName} ${
                        sticky ? stickyClassName : ''
                      }`}
                      style={{ background, color, top: cellHeight * index }}
                    >
                      <div className="whitespace-nowrap">{label}</div>
                    </th>
                  ),
                )}
              </tr>
            ))}
          </thead>
        </table>
      </div>
    </TableProvider>
  );
}

export default Table;
