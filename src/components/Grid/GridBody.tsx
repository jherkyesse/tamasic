import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  RefObject,
  useLayoutEffect,
} from 'react';
import { findDOMNode } from 'react-dom';
import { Grid, OnScrollParams } from 'react-virtualized';
import PerfectScrollbar from 'perfect-scrollbar';
// import { IoMdReturnLeft } from 'react-icons/io';
// import debounce from 'lodash/debounce';
// import Checkbox from '../Checkbox';
import GridContext from './GridContext';
import { perfectScrollbarConfig, cellHeight } from './config';

const defaultGridBodyClassName = 'outline-none select-none cursor-cell';
const defaultBodyClassName =
  'border-r border-b border-gray-300 dark:border-gray-400 text-xs text-black dark:text-gray-200 break-words outline-none p-1';
const cellStateStyleMap = {
  DELETE: '!text-red',
  MODIFY: '!text-blue-800 font-black',
};
const unmodifiableClassName = ['', 'text-gray-400'];
const selectedClassName = ['', 'bg-gray-100 dark:bg-gray-600'];
const activeClassName = [
  '',
  'border-t border-l !border-red-700 !w-auto !h-auto z-40',
];

type GridBodyProps = {
  width: number;
  scrollLeft: number;
  scrollTop: number;
  onScroll: (params: OnScrollParams) => void;
};

type GridBodyStateProps = {
  fromX?: number;
  fromY?: number;
  isEdited: boolean;
  isSelected: boolean;
  lockedMove: boolean;
  toX?: number;
  toY?: number;
};

type EditorProps = {
  onBlur?: (value?: string) => void;
  open: boolean;
  value?: string;
};

const Editor = ({ onBlur, open, value }: EditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editValue, setEditValue] = useState(value);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setEditValue(e.target.value || '');
  const onEditorBlur = () => onBlur && onBlur(editValue);
  useEffect(() => {
    setEditValue(value);
  }, [value]);
  useLayoutEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);
  return (
    <textarea
      ref={textareaRef}
      className={`absolute left-0 top-0 z-80 p-1 bg-blue-100 w-full min-h-full h-auto ${
        open ? '' : 'hidden'
      }`}
      autoFocus={open}
      value={editValue}
      onChange={onChange}
      onBlur={onEditorBlur}
    />
  );
};

function GridBody({ width, scrollLeft, scrollTop, onScroll }: GridBodyProps) {
  const gridBodyRef = useRef<RefObject<{}>>(null);
  const clipboardRef = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState({} as GridBodyStateProps);
  const { fromX, fromY, isEdited, isSelected, lockedMove, toX, toY } = state;
  const {
    columnCount,
    columnKeyList,
    columnPropsList,
    data,
    filterData,
    getColumnWidth,
    height,
    onChange,
    overscanColumnCount,
    readOnly,
  } = useContext(GridContext);
  const rowCount = filterData?.length;

  const keyUp = useCallback(() => {
    if (fromY === undefined || fromY === null || fromY === 0) return;
    const newY = fromY! - 1;
    setState({ ...state, fromY: newY, toX: undefined, toY: newY });
  }, [fromY, state]);
  const keyDown = useCallback(() => {
    if (fromY === undefined || fromY === null || fromY === rowCount! - 1)
      return;
    const newY = fromY! + 1;
    setState({ ...state, fromY: newY, toX: undefined, toY: newY });
  }, [fromY, rowCount, state]);
  const keyLeft = useCallback(() => {
    if (fromX === undefined || fromX === null || fromX === 0) return;
    const newX = fromX - 1;
    setState({ ...state, fromX: newX, toX: newX, toY: undefined });
  }, [fromX, state]);
  const keyRight = useCallback(() => {
    if (fromX === undefined || fromX === null || fromX === columnCount! - 1)
      return;
    const newX = fromX + 1;
    setState({ ...state, fromX: newX, toX: newX, toY: undefined });
  }, [columnCount, fromX, state]);
  const selectKeyUp = useCallback(
    (ctrlKey: Boolean) => {
      if (toY === 0) return;
      setState({
        ...state,
        toY: ctrlKey ? 0 : (toY ?? fromY)! - 1,
        toX: toX ?? fromX,
        isSelected: false,
      });
    },
    [fromX, fromY, state, toX, toY],
  );
  const selectKeyDown = useCallback(
    (ctrlKey: Boolean) => {
      if (toY === rowCount) return;
      setState({
        ...state,
        toY: ctrlKey ? rowCount! - 1 : (toY ?? fromY)! + 1,
        toX: toX ?? fromX,
        isSelected: false,
      });
    },
    [fromX, fromY, rowCount, state, toX, toY],
  );
  const selectKeyLeft = useCallback(
    (ctrlKey: Boolean) => {
      setState({
        ...state,
        toX: ctrlKey ? 0 : (toX ?? fromX)! - 1,
        toY: toY ?? fromY,
        isSelected: false,
      });
    },
    [fromX, fromY, state, toX, toY],
  );
  const selectKeyRight = useCallback(
    (ctrlKey: Boolean) => {
      if (toX === columnCount) return;
      setState({
        ...state,
        toX: ctrlKey ? columnCount! - 1 : (toX ?? fromX)! + 1,
        toY: toY ?? fromY,
        isSelected: false,
      });
    },
    [columnCount, fromX, fromY, state, toX, toY],
  );

  const move = useMemo(
    () => ({
      ArrowLeft: keyLeft,
      ArrowRight: keyRight,
      ArrowUp: keyUp,
      ArrowDown: keyDown,
    }),
    [keyDown, keyLeft, keyRight, keyUp],
  );
  const moveUpDown = useMemo(
    () => ({
      ArrowUp: keyUp,
      ArrowDown: keyDown,
    }),
    [keyDown, keyUp],
  );
  const moveSelect = useMemo(
    () => ({
      ArrowLeft: selectKeyLeft,
      ArrowRight: selectKeyRight,
      ArrowUp: selectKeyUp,
      ArrowDown: selectKeyDown,
    }),
    [selectKeyDown, selectKeyLeft, selectKeyRight, selectKeyUp],
  );
  const onCopy = useMemo(
    () =>
      readOnly
        ? null
        : () => {
            try {
              const startX = Math.min(fromX!, toX ?? fromX!);
              const startY = Math.min(fromY!, toY ?? fromY!);
              const endX = Math.max(fromX!, toX ?? fromX!);
              const endY = Math.max(fromY!, toY ?? fromY!);

              const clippedData: string[][][] = [];

              for (let j = startY; j <= endY; j++) {
                for (let i = startX; i <= endX; i++) {
                  const { changeValue = '', value = '', state } =
                    filterData[j][columnKeyList[i]] || {};

                  if (clippedData[j - startY] === undefined)
                    clippedData.push([]);
                  if (clippedData[j - startY][i - startX] === undefined)
                    clippedData[j - startY].push([]);
                  clippedData[j - startY][i - startX] =
                    state === 'DELETE' || state === 'MODIFY'
                      ? changeValue
                      : value;
                }
              }

              const clipboardTextarea = clipboardRef.current;
              if (!clipboardTextarea) return;
              clipboardTextarea.value = clippedData
                .map((rowData) => rowData.join(`	`))
                .join('\n');
              clipboardTextarea.select();
              clipboardTextarea.setSelectionRange(0, 99999);
              document.execCommand('copy');
            } catch (error) {
              console.warn(error);
            }
          },
    [columnKeyList, filterData, fromX, fromY, readOnly, toX, toY],
  );
  const onCut = useMemo(
    () =>
      readOnly
        ? null
        : () => {
            try {
              if (onCopy) onCopy();
              const startX = Math.min(fromX!, toX ?? fromX!);
              const startY = Math.min(fromY!, toY ?? fromY!);
              const endX = Math.max(fromX!, toX ?? fromX!);
              const endY = Math.max(fromY!, toY ?? fromY!);
              const nextData = [...data];
              for (let j = startY; j <= endY; j++) {
                for (let i = startX; i <= endX; i++) {
                  const { unmodifiable } = columnPropsList[i];
                  if (unmodifiable) continue;
                  const { index } = filterData[j] || {};
                  const { value } = filterData[j][columnKeyList[i]] || {};

                  const changeValue = '';
                  nextData[index][columnKeyList[i]] = {
                    ...(nextData[index][columnKeyList[i]] || {}),
                    changeValue,
                    state:
                      (value ?? '') !== changeValue
                        ? changeValue === ''
                          ? 'DELETE'
                          : 'MODIFY'
                        : '',
                  };
                }
              }
              onChange && onChange(nextData);
            } catch (error) {
              console.warn(error);
            }
          },
    [
      columnKeyList,
      columnPropsList,
      data,
      filterData,
      fromX,
      fromY,
      onChange,
      onCopy,
      readOnly,
      toX,
      toY,
    ],
  );
  const onPaste = useMemo(
    () =>
      readOnly
        ? null
        : () => {
            try {
              const clipboardTextarea = clipboardRef.current;
              if (!clipboardTextarea) return;
              clipboardTextarea.select();
              clipboardTextarea.setSelectionRange(0, 99999);
              document.execCommand('paste');

              const clipboardData = (clipboardTextarea.value || '')
                .split('\n')
                .map((text) => text.split(`	`));

              const startX = Math.min(fromX!, toX ?? fromX!);
              const startY = Math.min(fromY!, toY ?? fromY!);
              const endX = Math.max(fromX!, toX ?? fromX!);
              const endY = Math.max(fromY!, toY ?? fromY!);
              const nextData = [...data];
              for (let j = startY; j <= endY; j++) {
                for (let i = startX; i <= endX; i++) {
                  if (
                    i - startX < clipboardData[0].length &&
                    j - startY < clipboardData.length
                  ) {
                    const { index } = filterData[j];
                    const { value } = filterData[j][columnKeyList[i]];
                    const { type, unmodifiable } = columnPropsList[i];
                    if (type || unmodifiable) continue;
                    const changeValue = (clipboardData[j - startY] || {})[
                      i - startX
                    ];
                    if (typeof changeValue !== 'string') continue;
                    nextData[index][columnKeyList[i]] = {
                      ...nextData[index][columnKeyList[i]],
                      changeValue,
                      state:
                        (value || '') !== changeValue
                          ? changeValue === ''
                            ? 'DELETE'
                            : 'MODIFY'
                          : '',
                    };
                  }
                }
              }
              onChange && onChange(nextData);
            } catch (error) {
              console.warn(error);
            }
          },
    [
      columnKeyList,
      columnPropsList,
      data,
      filterData,
      fromX,
      fromY,
      onChange,
      readOnly,
      toX,
      toY,
    ],
  );
  const onCtrlKey = useMemo(
    () => ({
      c: onCopy,
      x: onCut,
      v: onPaste,
    }),
    [onCopy, onCut, onPaste],
  );
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const { code, key, metaKey, shiftKey, ctrlKey } = e;
      const isCtrl = ctrlKey || metaKey;
      if (isCtrl && !shiftKey) {
        // copy, cut, paste
        if (onCtrlKey[key]) onCtrlKey[key]();
        return;
      }
      if (isEdited && key === 'Escape') setState({ ...state, isEdited: false });
      else if (
        !isEdited &&
        (key === 'Delete' || key === 'Backspace') &&
        !readOnly
      ) {
        const startX = Math.min(fromX!, toX! ?? fromX);
        const startY = Math.min(fromY!, toY! ?? fromY);
        const endX = Math.max(fromX!, toX! ?? fromX);
        const endY = Math.max(fromY!, toY! ?? fromY);
        const nextData = [...data];
        for (let j = startY; j <= endY; j++) {
          for (let i = startX; i <= endX; i++) {
            const { type, unmodifiable } = columnPropsList[i] || {};
            if (type || unmodifiable) continue;
            nextData[j][columnKeyList[i]] = {
              ...nextData[j][columnKeyList[i]],
              changeValue: '',
              state: 'DELETE',
            };
          }
        }
        onChange && onChange(nextData);
        return;
      }

      if (isEdited) {
        if (lockedMove) {
          e.stopPropagation();
          return;
        }
        if (moveUpDown[key]) {
          if (shiftKey) return;
          e.preventDefault();
          e.stopPropagation();
          moveUpDown[key]();
          setState({
            ...state,
            isEdited: false,
          });
          const gridRef = findDOMNode(gridBodyRef.current);
          gridRef.focus();
        }
      } else if (move[key]) {
        e.preventDefault();
        e.stopPropagation();

        if (shiftKey) {
          // select multi grid
          moveSelect[key](isCtrl);
        } else {
          move[key]();
        }
      } else if (code.includes('Key')) {
        // input
        setState({
          ...state,
          isSelected: false,
          isEdited: true,
          lockedMove: false,
        });
      }
    },
    [
      columnKeyList,
      columnPropsList,
      data,
      fromX,
      fromY,
      isEdited,
      lockedMove,
      move,
      moveSelect,
      moveUpDown,
      onChange,
      onCtrlKey,
      readOnly,
      state,
      toX,
      toY,
    ],
  );

  const Cell = ({
    content,
    options = [],
    type = 'label',
    dropdownOptions = [],
  }) => {
    const onDropdownChange = () => {};
    const onChecked = () => {};
    // const radio = () =>
    //   options.map((option) => (
    //     <Checkbox
    //       type="radio"
    //       key={option.label}
    //       label={option.label}
    //       checked={option.key === content}
    //       onChange={onChecked}
    //     />
    //   ));
    const config = () => (
      <table className="w-full h-full">
        <tbody>
          {(content || []).map(({ key, value }) => (
            <tr key={key}>
              <td className="p-1 border-b border-r border-gray-300">{key}</td>
              <td className="p-1 border-b border-gray-300">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    const dropdown = () => (
      <div>
        {/* <Dropdown options={dropdownOptions} onChange={onDropdownChange} /> */}
      </div>
    );

    const label = () =>
      // <div className="p-1 break-words whitespace-pre-wrap">{content || ''}</div>
      content || '';
    const labelList = () => (
      <div className="flex flex-wrap">
        {(content || []).map((label: string, index: number) => (
          <span
            className="bg-blue-500 text-white rounded-full px-2 mr-1"
            key={index}
          >
            {label}
          </span>
        ))}
      </div>
    );
    const list = () => (
      <div className="h-full last:border-none">
        {(content || []).map((label: string, index: number) => (
          <div className="border-b border-gray-300 p-1 h-24px" key={index}>
            {label}
          </div>
        ))}
      </div>
    );

    return (
      {
        config,
        dropdown,
        label,
        labelList,
        list,
        // radio,
      }[type]() || ''
    );
  };

  const cellRenderer = ({
    key: keyIndex,
    columnIndex,
    rowIndex,
    style,
  }: {
    key: string;
    parent: any;
    columnIndex: number;
    rowIndex: number;
    style: object;
  }) => {
    const headerKey = columnKeyList[columnIndex];
    const { value, changeValue, color, background, state } =
      (filterData[rowIndex] || {})[headerKey] || {};
    const header = columnPropsList[columnIndex] || {};
    const {
      width = 100,
      type,
      options,
      dropdownOptions,
      key,
      unmodifiable,
    } = header;
    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
      // right click
      const isRightClick = e.button === 2;
      if (
        (isEdited || isRightClick) &&
        (fromX !== columnIndex || fromY !== rowIndex)
      ) {
        setState({
          ...state,
          lockedMove,
          isSelected,
          fromX: isRightClick ? undefined : columnIndex,
          fromY: isRightClick ? undefined : rowIndex,
          toX: undefined,
          toY: undefined,
          isEdited: false,
        });
        return;
      }
      setState({
        ...state,
        lockedMove,
        fromX: columnIndex,
        fromY: rowIndex,
        toX: undefined,
        toY: undefined,
        isSelected: true,
        isEdited: isEdited && fromX === columnIndex && fromY === rowIndex,
      });
    };
    const onMouseUp = () => {
      if (isEdited || !isSelected) return;
      setState({
        ...state,
        lockedMove,
        isEdited,
        fromX,
        fromY,
        toX,
        toY,
        isSelected: false,
      });
    };
    const onMouseEnter = () => {
      if (isEdited || !isSelected) return;
      setState({
        ...state,
        lockedMove,
        isEdited,
        fromX,
        fromY,
        isSelected: true,
        toX: columnIndex,
        toY: rowIndex,
      });
    };
    const onDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      if (type || unmodifiable || isEdited) return;
      const target = e.target;
      if (!target) return;

      setState({
        ...state,
        fromX,
        fromY,
        lockedMove: true,
        toX: columnIndex,
        toY: rowIndex,
        isSelected: false,
        isEdited: true,
      });
    };
    const onBlurEditor = (changeValue?: string) => {
      const rowData = filterData[rowIndex];
      const { index } = rowData || {};
      const nextData = [...data];
      nextData[index] = {
        ...nextData[index],
        [key!]: {
          ...rowData[key!],
          changeValue,
          state:
            (rowData[key!]?.value || '') !== changeValue
              ? changeValue === ''
                ? 'DELETE'
                : 'MODIFY'
              : '',
        },
      };

      if (onChange) onChange(nextData);
    };
    const isBeingSelected =
      columnIndex >= Math.min(fromX!, toX!) &&
      columnIndex <= Math.max(fromX!, toX!) &&
      rowIndex >= Math.min(fromY!, toY!) &&
      rowIndex <= Math.max(fromY!, toY!);
    const isActive = `${fromX}-${fromY}` === `${columnIndex}-${rowIndex}`;
    return (
      <div
        role="presentation"
        key={keyIndex}
        className={`${defaultBodyClassName}
        ${selectedClassName[+isBeingSelected!] || ''} ${
          activeClassName[+isActive]
        }
           ${cellStateStyleMap[state] || ''} ${
          unmodifiableClassName[+unmodifiable!]
        }`}
        style={{
          ...style,
          color,
          background,
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onDoubleClick={onDoubleClick}
      >
        <span className="whitespace-nowrap overflow-ellipsis block overflow-hidden">
          {changeValue ?? value}
        </span>
        {state === 'DELETE' && (
          <span className="whitespace-nowrap overflow-ellipsis block overflow-hidden text-red-900 line-through">
            {value}
          </span>
        )}
        <Editor
          open={isActive && isEdited && !unmodifiable}
          value={changeValue ?? value}
          onBlur={onBlurEditor}
        />
      </div>
    );
  };
  // useEffect(() => {
  //   const gridRef = findDOMNode(gridBodyRef.current);
  //   const ps = new PerfectScrollbar(gridRef, perfectScrollbarConfig);
  //   return () => ps.destroy();
  // }, []);
  useEffect(() => {
    const gridRef = findDOMNode(gridBodyRef.current);
    if (!gridRef) return;
    gridRef.addEventListener('keydown', onKeyDown);
    return () => gridRef.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <>
      <Grid
        tabIndex={1}
        ref={gridBodyRef}
        className={defaultGridBodyClassName}
        cellRenderer={cellRenderer}
        width={width}
        height={height}
        rowHeight={cellHeight}
        columnWidth={getColumnWidth}
        rowCount={rowCount || 1}
        overscanColumnCount={overscanColumnCount}
        columnCount={columnCount}
        scrollLeft={scrollLeft}
        onScroll={onScroll}
        scrollTop={scrollTop}
        scrollToColumn={isEdited ? undefined : fromX}
        scrollToRow={isEdited ? undefined : fromY}
      />
      <textarea className="hidden" ref={clipboardRef}></textarea>
    </>
  );
}

export default GridBody;
