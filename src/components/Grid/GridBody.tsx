import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect, memo } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { FcCheckmark } from 'react-icons/fc';
import { Grid, OnScrollParams } from 'react-virtualized';
import PerfectScrollbar from 'perfect-scrollbar';
import Checkbox from '../Checkbox';
import GridContext from './GridContext';
import { perfectScrollbarConfig, cellHeight } from './config';

const defaultGridBodyClassName = 'outline-none select-none';
const defaultBodyClassName =
  'border-r border-b border-gray-300 dark:border-gray-400 bg-white dark:bg-black text-xs text-black dark:text-gray-200 break-words outline-none cursor-cell';
const defaultDropdownClassName =
  'h-24px w-full flex flex-nowrap p-1 text-xs border-b border-red-300 dark:border-gray-700 hover:shadow-neumorph-pressed cursor-pointer';
const labelStateClassNameMap = {
  DELETE: 'bg-opacity-60 bg-red-100',
  MODIFY: 'bg-opacity-60 bg-orange-100 !text-red-900 font-bold',
};
const activeDropdownClassNameMap = {
  true: 'bg-opacity-60 bg-orange-100 !text-red-900 font-bold',
  false: '',
}
const dropdownOverflowClassName = ['-mt-1px', 'transform -translate-y-full'];
const selectedClassName = ['', 'bg-gray-100 dark:bg-gray-600'];
const activeClassName = ['', 'border-t border-l !border-red-700 z-40'];
const editableClassName = ['', '!h-auto'];

type GridBodyProps = {
  width: number;
  scrollLeft: number;
  scrollTop: number;
  onScroll: (params: OnScrollParams) => void;
};

type GridBodyStateProps = {
  customDropdownValue?: string;
  dropdownLeft?: number;
  dropdownOptions?: { label?: string; value?: string }[];
  dropdownTop?: number;
  dropdownValue?: string | null;
  dropdownWidth?: number | null;
  fromX?: number;
  fromY?: number;
  isDropdownOverflow: boolean;
  isEdited: boolean;
  isSelected: boolean;
  lockedMove: boolean;
  toX?: number;
  toY?: number;
};

const Dropdown = ({
  className,
  columnIndex,
  fromX,
  fromY,
  gridBodyRef,
  gridCellHeight,
  gridCellWidth,
  height,
  options,
  rowIndex,
  scrollLeft,
  scrollTop,
  updateState,
  value,
}: {
  className?: string;
  columnIndex: number;
  fromX?: number;
  fromY?: number;
  gridBodyRef?: React.RefObject<HTMLDivElement>;
  gridCellHeight: number;
  gridCellWidth: number;
  height: number;
  options: { label?: string; value?: string }[];
  rowIndex: number;
  scrollLeft: number;
  scrollTop: number;
  updateState: Function;
  value?: string;
}) => {
  const { label } = options.find((option) => option.value === value) || {};
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fromX === columnIndex && fromY === rowIndex) {
      updateState({
        dropdownOptions: [],
        dropdownValue: undefined,
        dropdownLeft: undefined,
        dropdownTop: undefined,
        dropdownWidth: undefined,
        isSelected: true,
        fromX: undefined,
        fromY: undefined,
        isDropdownOverflow: false,
      });
      return;
    }
    const gridRef = findDOMNode(gridBodyRef?.current) as Element;
    const { left: gridRefLeft, top: gridRefTop } = gridRef.getBoundingClientRect();
    const { left, top } = e.target.getBoundingClientRect();
    const dropdownLeft = left + scrollLeft - gridRefLeft - 1;
    const isDropdownOverflow = top - gridRefTop > height / 2;
    const dropdownTop = top + scrollTop - gridRefTop + +!isDropdownOverflow * gridCellHeight;
    updateState({
      customDropdownValue: options.find((option) => option.value === value) ? '' : value || '',
      dropdownOptions: options,
      dropdownValue: value,
      dropdownLeft,
      dropdownTop,
      dropdownWidth: gridCellWidth + 1,
      isSelected: true,
      fromX: columnIndex,
      fromY: rowIndex,
      isDropdownOverflow,
    });
  };

  return (
    <div
      role="presentation"
      className={`flex items-center justify-center p-1 cursor-pointer ${className}`}
      onMouseDown={onMouseDown}
    >
      <span className="flex-1 mr-1 pointer-events-none">{label ?? value}</span>
      <div className="absolute right-0 bottom-0 p-1px pointer-events-none">
        <div className="w-5px overflow-hidden">
          <div className="h-10px bg-black dark:bg-white rotate-45 transform origin-bottom-left"></div>
        </div>
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  className: PropTypes.string,
  height: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
  ),
  scrollLeft: PropTypes.number.isRequired,
  scrollTop: PropTypes.number.isRequired,
  updateState: PropTypes.func.isRequired,
  value: PropTypes.string,
};

Dropdown.defaultProps = {
  className: '',
  value: '',
};

function GridBody({ width, scrollLeft, scrollTop, onScroll }: GridBodyProps) {
  const gridBodyRef = useRef(null);
  const editorRef = useRef(null);
  const clipboardRef = useRef(null);
  const [state, setState] = useState({} as GridBodyStateProps);
  const updateState = (data: {}) => setState({ ...state, ...data });
  const onChangeCustomDropdownValue = ({ target: { value } }: { target: { value?: string } }) =>
    updateState({ ...state, customDropdownValue: value });
  const {
    customDropdownValue,
    dropdownLeft,
    dropdownOptions,
    dropdownTop,
    dropdownValue,
    dropdownWidth,
    fromX,
    fromY,
    isEdited,
    isSelected,
    lockedMove,
    isDropdownOverflow,
    toX,
    toY,
  } = state;
  const {
    columnCount,
    columnKeyList,
    columnPropsList,
    data,
    filteredData,
    getColumnWidth,
    getRowHeight,
    height,
    onChange,
    overscanColumnCount,
    readOnly,
  } = useContext(GridContext);
  const rowCount = filteredData?.length;
  console.log('GridBody', data);
  const keyUp = useCallback(() => {
    if (fromY === undefined || fromY === null || fromY === 0) return;
    const newY = fromY! - 1;
    updateState({ fromY: newY, toX: undefined, toY: newY });
  }, [fromY, state]);
  const keyDown = useCallback(() => {
    if (fromY === undefined || fromY === null || fromY === rowCount! - 1) return;
    const newY = fromY! + 1;
    updateState({ fromY: newY, toX: undefined, toY: newY });
  }, [fromY, rowCount, state]);
  const keyLeft = useCallback(() => {
    if (fromX === undefined || fromX === null || fromX === 0) return;
    const newX = fromX - 1;
    updateState({ fromX: newX, toX: newX, toY: undefined });
  }, [fromX, state]);
  const keyRight = useCallback(() => {
    if (fromX === undefined || fromX === null || fromX === columnCount! - 1) return;
    const newX = fromX + 1;
    updateState({ fromX: newX, toX: newX, toY: undefined });
  }, [columnCount, fromX, state]);
  const selectKeyUp = useCallback(
    (ctrlKey: Boolean) => {
      if (toY === 0) return;
      updateState({
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
      updateState({
        toY: ctrlKey ? rowCount! - 1 : (toY ?? fromY)! + 1,
        toX: toX ?? fromX,
        isSelected: false,
      });
    },
    [fromX, fromY, rowCount, state, toX, toY],
  );
  const selectKeyLeft = useCallback(
    (ctrlKey: Boolean) => {
      updateState({
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
      updateState({
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
  const moveUpDown: { ArrowUp: Function; ArrowDown: Function } = useMemo(
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
  const onBlur = useCallback(
    ({ changeValue, fromX, fromY }: { changeValue?: string; fromX: number; fromY: number }) => {
      try {
        if (!onChange) return;
        const nextData = [...data];
        const headerKey = columnKeyList[fromX];
        const { index } = filteredData[fromY] || {};

        const { value } = nextData[index][headerKey];
        nextData[index][headerKey] = {
          ...nextData[index][headerKey],
          changeValue,
          state: changeValue === value ? '' : !changeValue ? 'DELETE' : 'MODIFY',
        };
        onChange(nextData);
      } catch (error) {
        console.warn(error);
      }
    },
    [columnKeyList, data, filteredData, onChange],
  );
  const onCopy = useCallback(() => {
    try {
      const startX = Math.min(fromX!, toX ?? fromX!);
      const startY = Math.min(fromY!, toY ?? fromY!);
      const endX = Math.max(fromX!, toX ?? fromX!);
      const endY = Math.max(fromY!, toY ?? fromY!);

      const clippedData: string[][][] = [];

      for (let j = startY; j <= endY; j++) {
        for (let i = startX; i <= endX; i++) {
          const { changeValue = '', value = '', state } = filteredData[j][columnKeyList[i]] || {};

          if (clippedData[j - startY] === undefined) clippedData.push([]);
          if (clippedData[j - startY][i - startX] === undefined) clippedData[j - startY].push([]);
          clippedData[j - startY][i - startX] = state === 'DELETE' || state === 'MODIFY' ? changeValue : value;
        }
      }

      const clipboardTextarea = clipboardRef.current;
      if (!clipboardTextarea) return;
      clipboardTextarea.value = clippedData.map((rowData) => rowData.join(`	`)).join('\n');
      clipboardTextarea.select();
      clipboardTextarea.setSelectionRange(0, 99999);
      document.execCommand('copy');
    } catch (error) {
      console.warn(error);
    }
  }, [columnKeyList, filteredData, fromX, fromY, readOnly, toX, toY]);
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
                  const { type = 'label', unmodifiable } = columnPropsList[i];
                  if (type !== 'label' || unmodifiable) continue;
                  const { index } = filteredData[j] || {};
                  const { value } = filteredData[j][columnKeyList[i]] || {};

                  const changeValue = '';
                  nextData[index][columnKeyList[i]] = {
                    ...(nextData[index][columnKeyList[i]] || {}),
                    changeValue,
                    state: (value ?? '') !== changeValue ? (changeValue === '' ? 'DELETE' : 'MODIFY') : '',
                  };
                }
              }
              onChange && onChange(nextData);
            } catch (error) {
              console.warn(error);
            }
          },
    [columnKeyList, columnPropsList, data, filteredData, fromX, fromY, onChange, onCopy, readOnly, toX, toY],
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
              const clipboardData = (clipboardTextarea.value || '').split('\n').map((text: string) => text.split(`	`));

              const startX = Math.min(fromX!, toX ?? fromX!);
              const startY = Math.min(fromY!, toY ?? fromY!);
              const endX = Math.max(fromX!, toX ?? fromX!);
              const endY = Math.max(fromY!, toY ?? fromY!);
              const nextData = [...data];
              for (let j = startY; j <= endY; j++) {
                for (let i = startX; i <= endX; i++) {
                  if (i - startX < clipboardData[0].length && j - startY < clipboardData.length) {
                    const { index } = filteredData[j];
                    const { value } = filteredData[j][columnKeyList[i]];
                    const { type = 'label', unmodifiable } = columnPropsList[i];
                    if (type !== 'label' || unmodifiable) continue;
                    const changeValue = (clipboardData[j - startY] || {})[i - startX];
                    if (typeof changeValue !== 'string') continue;
                    nextData[index][columnKeyList[i]] = {
                      ...nextData[index][columnKeyList[i]],
                      changeValue,
                      state: (value || '') !== changeValue ? (changeValue === '' ? 'DELETE' : 'MODIFY') : '',
                    };
                  }
                }
              }
              onChange && onChange(nextData);
            } catch (error) {
              console.warn(error);
            }
          },
    [columnKeyList, columnPropsList, data, filteredData, fromX, fromY, onChange, readOnly, toX, toY],
  );
  const onPastePlainText = (e: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => string };
  }) => {
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  };
  const onCtrlKey = useMemo(
    () => ({
      c: onCopy,
      x: onCut,
      v: onPaste,
    }),
    [onCopy, onCut, onPaste],
  );
  const onKeyDown = useCallback(
    (e) => {
      const { code, key, metaKey, shiftKey, ctrlKey } = e;
      const isCtrl = ctrlKey || metaKey;
      if (isCtrl && !shiftKey) {
        // copy, cut, paste
        if (onCtrlKey[key] && !(isEdited && key !== 'v')) onCtrlKey[key]();
        return;
      }
      if (isEdited && key === 'Escape') updateState({ isEdited: false });
      else if (!isEdited && (key === 'Delete' || key === 'Backspace') && !readOnly) {
        const startX = Math.min(fromX!, toX! ?? fromX);
        const startY = Math.min(fromY!, toY! ?? fromY);
        const endX = Math.max(fromX!, toX! ?? fromX);
        const endY = Math.max(fromY!, toY! ?? fromY);
        const nextData = [...data];
        for (let j = startY; j <= endY; j++) {
          for (let i = startX; i <= endX; i++) {
            const { type = 'label', unmodifiable } = columnPropsList[i] || {};
            if (type !== 'label' || unmodifiable) continue;
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
          // Trigger onBlur-like event here
          const changeValue = (editorRef && editorRef.current && editorRef.current.textContent) || '';
          onBlur({ changeValue, fromX, fromY });
          moveUpDown[key]();
          updateState({
            isEdited: false,
          });
          const gridRef = findDOMNode(gridBodyRef.current);
          if (gridRef) (gridRef as HTMLElement)?.focus();
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
        const { type = 'label', unmodifiable } = columnPropsList[fromX] || {};
        if (type !== 'label' || unmodifiable) return;
        updateState({
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
  const onClickDropdown = (optionValue: string) => {
    const isCustomOption = optionValue === 'other';
    if (isCustomOption) {
      updateState({
        dropdownOptions: [],
        dropdownValue: undefined,
        dropdownLeft: undefined,
        dropdownTop: undefined,
        dropdownWidth: undefined,
        isSelected: true,
        isEdited: true,
        isDropdownOverflow: false,
        lockedMove: true,
      })
    } else {
      const nextData = [...data];
      const { index } = filteredData[fromY!] || {};
      const headerKey = columnKeyList[fromX!];
      const { value } = nextData[index][headerKey];
      const isModified = value === optionValue;
      nextData[index][headerKey] = {
        ...nextData[index][headerKey],
        changeValue: isModified ? undefined : optionValue,
        state: isModified ? '' : 'MODIFY',
      };
      onChange && onChange(nextData);
      updateState({
        dropdownOptions: [],
        dropdownValue: undefined,
        dropdownLeft: undefined,
        dropdownTop: undefined,
        dropdownWidth: undefined,
        fromX: undefined,
        fromY: undefined,
        isSelected: false,
        isEdited: false,
        isDropdownOverflow: false,
      })
    }
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
    const { background, changeValue, color, isDisabled, state, value } =
      (filteredData[rowIndex] || {})[headerKey] || {};
    const header = columnPropsList[columnIndex] || {};
    const { type = 'label', dropdownOptions = [], unmodifiable } = header;
    const gridCellWidth = style['width'];
    const gridCellHeight = (filteredData[rowIndex]?.multiRow ?? 1) * cellHeight;
    const labelStateClassName = labelStateClassNameMap[String(state)] || '';
    const Select = () => {
      const onChecked = (changeValue?: boolean) => {
        const nextData = [...data];
        const { index } = filteredData[rowIndex] || {};
        const { value } = nextData[index][headerKey];
        nextData[index][headerKey] = {
          ...nextData[index][headerKey],
          changeValue,
          state: changeValue === value ? '' : 'MODIFY',
        };

        onChange && onChange(nextData);
      };
      return (
        <div className="w-full h-full flex justify-center items-center">
          <Checkbox disabled={isDisabled} onChange={onChecked} checked={changeValue} />
        </div>
      );
    };
    const Label = () => {
      return (
        <span
          className={`h-full whitespace-nowrap overflow-ellipsis block overflow-hidden pointer-events-none p-1 ${labelStateClassName}`}
        >
          {changeValue ?? value}
        </span>
      );
    };
    const Multiline = () => {
      const valueList = (value || '').split(',');
      return valueList.map((value: string, index: number) => (
        <span
          key={index}
          className="border-b border-gray-300 whitespace-nowrap overflow-ellipsis block overflow-hidden pointer-events-none px-1 pt-1"
          style={{ height: cellHeight }}
        >
          {value}
        </span>
      ));
    };
    const MemoDropdown = () => (
      <Dropdown
        className={labelStateClassName}
        columnIndex={columnIndex}
        fromX={fromX}
        fromY={fromY}
        gridBodyRef={gridBodyRef}
        gridCellHeight={gridCellHeight}
        gridCellWidth={gridCellWidth}
        height={height}
        options={dropdownOptions}
        rowIndex={rowIndex}
        scrollLeft={scrollLeft}
        scrollTop={scrollTop}
        updateState={updateState}
        value={changeValue ?? value}
      />
    );
    const renderMap = {
      checkbox: Select,
      dropdown: MemoDropdown,
      label: Label,
      multiline: Multiline,
    };
    const Renderer = memo(renderMap[type]);
    const onMouseDown =
      type === 'checkbox'
        ? null
        : (e: React.MouseEvent) => {
            // right click
            const isRightClick = e.button === 2;
            if (fromX !== columnIndex || fromY !== rowIndex) {
              if (isEdited) {
                const changeValue = (editorRef && editorRef.current && editorRef.current.textContent) || '';
                onBlur({ changeValue, fromX, fromY });
                updateState({
                  lockedMove,
                  isSelected,
                  fromX: isRightClick ? undefined : columnIndex,
                  fromY: isRightClick ? undefined : rowIndex,
                  toX: undefined,
                  toY: undefined,
                  isEdited: false,
                  dropdownOptions: [],
                  dropdownValue: undefined,
                  dropdownLeft: undefined,
                  dropdownTop: undefined,
                  dropdownWidth: undefined,
                  isDropdownOverflow: false,
                });
                return;
              } else if (isRightClick) return;
            }
            updateState({
              lockedMove,
              fromX: columnIndex,
              fromY: rowIndex,
              toX: undefined,
              toY: undefined,
              isSelected: true,
              isEdited: isEdited && fromX === columnIndex && fromY === rowIndex,
              dropdownOptions: [],
              dropdownValue: undefined,
              dropdownLeft: undefined,
              dropdownTop: undefined,
              dropdownWidth: undefined,
              isDropdownOverflow: false,
            });
          };
    const onMouseUp = () => {
      if (isEdited || !isSelected) return;
      updateState({
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
      updateState({
        lockedMove,
        isEdited,
        fromX,
        fromY,
        isSelected: true,
        toX: columnIndex,
        toY: rowIndex,
      });
    };
    const onDoubleClick = (e: { preventDefault: () => void; stopPropagation: () => void }): React.MouseEventHandler => {
      e.preventDefault();
      e.stopPropagation();
      if (type !== 'label' || unmodifiable || isEdited) return null;
      updateState({
        fromX,
        fromY,
        lockedMove: true,
        toX: columnIndex,
        toY: rowIndex,
        isSelected: false,
        isEdited: true,
      });
      return null;
    };
    const isBeingSelected =
      columnIndex >= Math.min(fromX!, toX!) &&
      columnIndex <= Math.max(fromX!, toX!) &&
      rowIndex >= Math.min(fromY!, toY!) &&
      rowIndex <= Math.max(fromY!, toY!);
    const isActive = `${fromX}-${fromY}` === `${columnIndex}-${rowIndex}`;
    const isContentEditable = isActive && isEdited;

    return (
      <div
        role="presentation"
        key={keyIndex}
        className={`${defaultBodyClassName}
        ${selectedClassName[+isBeingSelected!] || ''} ${activeClassName[+isActive]} ${
          editableClassName[+isContentEditable]
        }`}
        style={{
          ...style,
          color,
          background,
          height: gridCellHeight,
          minHeight: gridCellHeight,
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onDoubleClick={onDoubleClick}
      >
        {isContentEditable ? (
          <div
            ref={editorRef}
            contentEditable={isContentEditable}
            suppressContentEditableWarning
            spellCheck={false}
            className="bg-blue-100 min-w-full w-auto h-auto p-1 outline-none"
            onPaste={onPastePlainText}
          >
            {changeValue ?? value}
          </div>
        ) : (
          <Renderer />
        )}
      </div>
    );
  };
  useEffect(() => {
    const gridRef = findDOMNode(gridBodyRef.current);
    const ps = new PerfectScrollbar(gridRef as Element, perfectScrollbarConfig);
    return () => ps.destroy();
  }, []);
  useEffect(() => {
    const gridRef = findDOMNode(gridBodyRef.current);
    if (!gridRef) return null;
    gridRef.addEventListener('keydown', onKeyDown);
    return () => gridRef.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);
  useLayoutEffect(() => {
    if (isEdited && editorRef && editorRef.current) editorRef.current.focus();
  }, [isEdited]);

  return (
    <div className="relative">
      <Grid
        tabIndex={1}
        ref={gridBodyRef}
        className={defaultGridBodyClassName}
        cellRenderer={cellRenderer}
        width={width}
        height={height}
        rowHeight={getRowHeight}
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
      <div
        className={`absolute h-auto bg-white dark:bg-black border border-red-700 last:border-0 ${
          dropdownOverflowClassName[+isDropdownOverflow]
        }`}
        style={{
          width: (dropdownWidth || 0) + 'px',
          left: (dropdownLeft || 0) - scrollLeft + 'px',
          top: (dropdownTop || 0) - scrollTop + 'px',
        }}
      >
        {dropdownOptions?.map((option) => {
          const isSelected = option.value === dropdownValue;
          return (
            <div role="presentation" key={option.value} className={`${defaultDropdownClassName} ${activeDropdownClassNameMap[String(isSelected)]}`} onClick={() => onClickDropdown(option.value)}>
              {isSelected && <FcCheckmark size={16} className="mr-1" />}
              <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">{option.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GridBody;
