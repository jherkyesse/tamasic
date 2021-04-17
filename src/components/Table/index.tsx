import React, { useState, useEffect, useRef } from 'react';
import { inRange } from 'lodash';
import Scrollbar from '../Scrollbar';
import CellTextarea from './CellTextarea';
import ContextMenu from './ContextMenu';
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
  cellFullHeight,
} from './config';

type TableProps = {
  data?: { [key: string]: string }[];
  headerKeyList: string[];
  headerList: { [key: string]: string }[];
  onChange?: Function;
};

type TableCellProps = {
  contextMenuLeft?: number;
  contextMenuTop?: number;
  contextMenuX?: number;
  contextMenuY?: number;
  copyboardList?: string[];
  fromX?: number;
  fromY?: number;
  hasContextMenu?: boolean;
  isEdited?: boolean;
  isSelected?: boolean;
  toX?: number;
  toY?: number;
  // selectedCellMap?: Map<string, boolean>;
};

function Table({
  data = [],
  headerKeyList = [],
  headerList = [],
  onChange,
}: TableProps) {
  const rowCount = data.length;
  const columnCount = headerKeyList.length;
  const stickyColumnPropsMap = headerList
    .flat()
    .reduce((acc, { key, sticky, width, textAlign }, index) => {
      if (sticky)
        acc[key] = {
          sticky,
          width,
          textAlign,
          left:
            index === 0
              ? 0
              : (acc[Object.keys(acc)[index - 1]]?.left || 0) +
                acc[Object.keys(acc)[index - 1]]?.width,
        };
      return acc;
    }, {});

  const [state, setState] = useState({
    contextMenuLeft: undefined,
    contextMenuTop: undefined,
    contextMenuX: undefined,
    contextMenuY: undefined,
    copyboardList: [[]],
    fromX: undefined,
    fromY: undefined,
    hasContextMenu: false,
    isEdited: false,
    isSelected: false,
    toX: undefined,
    toY: undefined,
    selectedCellMap: new Map(),
  });
  const {
    contextMenuLeft,
    contextMenuTop,
    contextMenuX,
    contextMenuY,
    copyboardList,
    fromX,
    fromY,
    hasContextMenu,
    isEdited,
    isSelected,
    toX,
    toY,
  } = state as TableCellProps;
  function resetSelectedCell() {
    setState({ ...state, fromX: undefined, fromY: undefined });
  }

  function keyUp() {
    if (!fromX || fromY === 0) return;
    const toY = fromY! - 1;
    setState({
      ...state,
      contextMenuLeft: undefined,
      contextMenuTop: undefined,
      contextMenuX: undefined,
      contextMenuY: undefined,
      fromY: toY,
      toX: fromX,
      toY,
    });
  }
  function keyDown() {
    if (!fromX || fromY === rowCount - 1) return;
    const toY = fromY! + 1;
    setState({
      ...state,
      contextMenuLeft: undefined,
      contextMenuTop: undefined,
      contextMenuX: undefined,
      contextMenuY: undefined,
      fromY: toY,
      toX: fromX,
      toY,
    });
  }
  function keyLeft() {
    if (!fromX || fromX === 0) return;
    const toX = fromX - 1;
    // if (newX < contentEditableActiveLeftCellX) return;
    setState({
      ...state,
      contextMenuLeft: undefined,
      contextMenuTop: undefined,
      contextMenuX: undefined,
      contextMenuY: undefined,
      fromX: toX,
      toX,
      toY: fromY,
    });
  }
  function keyRight() {
    if (!fromX || fromX === columnCount - 1) return;
    const toX = fromX + 1;
    setState({
      ...state,
      contextMenuLeft: undefined,
      contextMenuTop: undefined,
      contextMenuX: undefined,
      contextMenuY: undefined,
      fromX: toX,
      toX,
      toY: fromY,
    });
  }
  function selectKeyUp(ctrlKey = false) {
    if (toY === 0) return;
    setState({
      ...state,
      contextMenuLeft: undefined,
      contextMenuTop: undefined,
      contextMenuX: undefined,
      contextMenuY: undefined,
      toY: ctrlKey ? 0 : (toY ?? fromY) - 1,
      toX: toX ?? fromX,
      isSelected: false,
    });
  }
  function selectKeyDown(ctrlKey = false) {
    if (toY === rowCount - 1) return;
    setState({
      ...state,
      contextMenuLeft: undefined,
      contextMenuTop: undefined,
      contextMenuX: undefined,
      contextMenuY: undefined,
      toY: ctrlKey ? rowCount - 1 : (toY ?? fromY) + 1,
      toX: toX ?? fromX,
      isSelected: false,
    });
  }
  function selectKeyLeft(ctrlKey = false) {
    if (toX === 0) return;
    // if (toX === 0 ?? toX === contentEditableActiveLeftCellX)
    //   return;
    setState({
      ...state,
      contextMenuLeft: undefined,
      contextMenuTop: undefined,
      contextMenuX: undefined,
      contextMenuY: undefined,
      toX: ctrlKey ? 0 : (toX ?? fromX) - 1,
      toY: toY ?? fromY,
      isSelected: false,
    });
  }
  function selectKeyRight(ctrlKey = false) {
    if (toX === columnCount - 1) return;
    setState({
      ...state,
      contextMenuLeft: undefined,
      contextMenuTop: undefined,
      contextMenuX: undefined,
      contextMenuY: undefined,
      toX: ctrlKey ? columnCount - 1 : (toX ?? fromX) + 1,
      toY: toY ?? fromY,
      isSelected: false,
    });
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

  function onCopy() {
    document.execCommand("copy")
    // const startX = Math.min(fromX!, toX!);
    // const endX = Math.max(fromX!, toX!);
    // const startY = Math.min(fromY!, toY!);
    // const endY = Math.max(fromY!, toY!);
    // const copyboardList = new Array(endY - startY + 1)
    //   .fill(null)
    //   .map(() => new Array(endX - startX + 1));
    // for (let j = startY; j <= endY; j++) {
    //   for (let i = startX; i <= endX; i++) {
    //     copyboardList[j - startY][i - startX] = data[j][headerKeyList[i]];
    //   }
    // }
    // setState({
    //   ...state,
    //   copyboardList,
    // });
  }
  function onCut(saveToCopyboard = true) {
    const _data = [...data];
    const startX = Math.min(fromX!, toX!);
    const endX = Math.max(fromX!, toX!);
    const startY = Math.min(fromY!, toY!);
    const endY = Math.max(fromY!, toY!);
    const copyboardList = new Array(endY - startY + 1).fill(
      new Array(endX - startX),
    );
    for (let j = startY; j <= endY; j++) {
      for (let i = startX; i <= endX; i++) {
        copyboardList[j - startY][i - startX] = data[j][headerKeyList[i]];
        _data[j][headerKeyList[i]] = '';
      }
    }
    if (saveToCopyboard)
      setState({
        ...state,
        copyboardList,
      });
    onChange(_data);
  }
  function onPaste() {
    // const _data = [...data];
    // const startX = Math.min(fromX!, toX!);
    // const endX = Math.max(fromX!, toX!);
    // const startY = Math.min(fromY!, toY!);
    // const endY = Math.max(fromY!, toY!);
    // for (let j = startY; j <= endY; j++) {
    //   for (let i = startX; i <= endX; i++) {
    //     if (
    //       j - startY >= copyboardList.length ||
    //       i - startX > copyboardList[0].length
    //     )
    //       continue;
    //     _data[j][headerKeyList[i]] = copyboardList[j - startY][i - startX];
    //   }
    // }

    // onChange(_data);
  }

  function onKeyDown(e) {
    console.log('e', e);

    const { key, code, shiftKey, ctrlKey, metaKey } = e;
    if (!shiftKey && (ctrlKey || metaKey)) {
      // ctrlKey for Windows, metaKey for MacOS
      e.preventDefault();
      e.stopPropagation();
      if (key === 'c') onCopy();
      else if (key === 'x') onCut();
      else if (key === 'v') onPaste();
      return;
    }
    if (isEdited && key === 'Escape') setState({ ...state, isEdited: false });
    else if (
      !isEdited &&
      (key === 'Delete' || key === 'Backspace') &&
      onChange
    ) {
      onCut(false);
      return;
    }
    // if (gridEdit && key === 'Escape') setGridEdit(false);
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
        moveSelect[key](ctrlKey);
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
                  const rowSpan = item[`${key}$Row`] ?? 1;
                  if (rowSpan === 0) return null;
                  const value = item[key];
                  const { sticky, width, left, textAlign = 'left' } =
                    stickyColumnPropsMap[key] || {};

                  const onMouseDown = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const { button } = e; // 0: leftClick, 2: rightClick
                    if (button === 2) {
                      const { left, top } = e.target.getBoundingClientRect();
                      setState({
                        ...state,
                        contextMenuX: x,
                        contextMenuY: y,
                        contextMenuLeft: e.clientX - left,
                        contextMenuTop: e.clientY - top,
                        fromX: fromX ?? x,
                        fromY: fromY ?? y,
                        hasContextMenu: true,
                        isEdited: false,
                        isSelected: true,
                      });
                    } else
                      setState({
                        ...state,
                        contextMenuX: undefined,
                        contextMenuY: undefined,
                        contextMenuLeft: undefined,
                        contextMenuTop: undefined,
                        fromX: x,
                        fromY: y,
                        toX: x,
                        toY: y,
                        isEdited: isEdited && (fromX !== x || toY !== y),
                        isSelected: true,
                      });
                  };
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
                  const onContextMenu = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  };
                  const onMouseOut = () => {
                    if (isEdited || !isSelected) return;
                    // selectedCellMap.set(`${x}-${y}`) = false;
                    // setState({
                    //   ...state,
                    //   selectedCellMap,
                    // });
                  };

                  const isEdit = `${x}-${y}` === `${fromX}-${fromY}`;
                  const isContextMenu =
                    hasContextMenu && contextMenuX === x && contextMenuY === y;
                  const isIncludeSelected =
                    x >= Math.min(fromX!, toX!) &&
                    x <= Math.max(fromX!, toX!) &&
                    y >= Math.min(fromY!, toY!) &&
                    y <= Math.max(fromY!, toY!);
                  return (
                    <td
                      key={key}
                      rowSpan={rowSpan}
                      data-index={`${x}-${y}`}
                      role="presentation"
                      className={` ${tableTbodyTdClassName} ${
                        isIncludeSelected ? 'bg-gray-100' : ''
                      }
                      ${isContextMenu ? (sticky ? 'z-50' : 'z-30') : ''}
                      ${sticky ? 'sticky bg-white z-30' : ''} 
                      text-${textAlign}
                      ${isEdit ? 'z-40' : 'z-10'}
                      ${fromX === x && fromY === y ? 'active' : ''}`}
                      style={{ left, width }}
                      onMouseDown={onMouseDown}
                      onMouseUp={onMouseUp}
                      onMouseEnter={onMouseEnter}
                      onContextMenu={onContextMenu}
                    >
                      {isEdit ? <CellTextarea value={value} className={sticky ? 'z-40' : ''} /> : value}
                      {isContextMenu && (
                        <ContextMenu
                          left={contextMenuLeft}
                          top={contextMenuTop}
                          className={sticky ? 'z-50' : ''}
                        />
                      )}
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
                  ({
                    label,
                    key,
                    sticky,
                    background,
                    width,
                    color,
                    col = 1,
                    row = 1,
                  }) => (
                    <th
                      key={label}
                      colSpan={col}
                      rowSpan={row}
                      className={`${tableTheadThClassName} ${
                        sticky ? stickyClassName : ''
                      }`}
                      style={{
                        background,
                        color,
                        width,
                        minWidth: width,
                        maxWidth: width,
                        top: cellFullHeight * index,
                        left: stickyColumnPropsMap[key]?.left,
                      }}
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
