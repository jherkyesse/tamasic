import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ScrollSync, AutoSizer, CellMeasurerCache } from 'react-virtualized';
import debounce from 'lodash/debounce';
import { GridProvider } from './GridContext';
import StickyGridHeader from './StickyGridHeader';
import StickyGridBody from './StickyGridBody';
import GridHeader from './GridHeader';
import GridBody from './GridBody';
import { cellHeight, columnWidth } from './config';
import { GridCellProps, GridDataProps } from './type';

const defaultGridClassName =
  'w-full flex flex-nowrap border border-gray-300 overflow-hidden';

type GridProps = {
  data: Array<GridDataProps>;
  filterable: boolean;
  headerList: Array<Array<GridCellProps>>;
  headerKeyList: Array<Array<string>>;
  height?: number;
  onChange?: Function;
  overscanColumnCount?: number;
  overscanRowCount?: number;
  selectable?: boolean;
  sortable?: boolean;
  stickyHeaderList: Array<Array<GridCellProps>>;
  stickyHeaderKeyList: Array<Array<string>>;
};

function Grid({
  data,
  filterable,
  headerList,
  headerKeyList,
  height,
  onChange,
  overscanColumnCount,
  overscanRowCount,
  selectable,
  sortable,
  stickyHeaderList,
  stickyHeaderKeyList,
}: GridProps) {
  const rowCount = data.length;
  const columnCount = headerKeyList[0].length;
  const headerRowCount = headerList.length;
  const columnPropsList = headerList[headerRowCount - 1];
  const columnKeyList = headerKeyList[headerRowCount - 1];
  const stickyColumnCount = stickyHeaderKeyList[0].length;
  const stickyHeaderRowCount = stickyHeaderList.length;
  const stickyColumnPropsList = stickyHeaderList[stickyHeaderRowCount - 1];
  const stickyColumnKeyList = stickyHeaderKeyList[headerRowCount - 1];

  const stickyWidth = useMemo(
    () =>
      stickyHeaderList[stickyHeaderList.length - 1].reduce(
        (acc: number, cur: { width?: number }) =>
          (acc ?? 100) + (cur.width ?? 100),
        0,
      ),
    [stickyHeaderList],
  );
  const allColumnKeyList = useMemo(
    () => stickyColumnKeyList.concat(columnKeyList),
    [columnKeyList, stickyColumnKeyList],
  );
  const { allColumnPropsList, allColumnPropsMap } = useMemo(() => {
    const allColumnPropsList = stickyColumnPropsList.concat(columnPropsList);
    const allColumnPropsMap = allColumnPropsList.reduce(
      (acc: object, cur: GridCellProps) => {
        acc[cur.key!] = cur;
        return acc;
      },
      {},
    );
    return { allColumnPropsList, allColumnPropsMap };
  }, [columnPropsList, stickyColumnPropsList]);
  const readOnly = !onChange;
  const [filterList, setFilterList] = useState(
    new Array(allColumnKeyList.length).fill(''),
  );
  const [isSortAsc, setIsSortAsc] = useState(false);
  const [sortKey, setSortKey] = useState('');

  const filterData = useMemo(() => {
    const filterData = data.reduce((acc: Array<object>, item: object) => {
      const filterKey = filterList.every(
        (filter: string, index: number) =>
          !filter ||
          (
            item[allColumnKeyList[index]]?.changeValue ??
            (item[allColumnKeyList[index]]?.value || '').toString()
          )
            .toLowerCase()
            .includes(filter.toLowerCase()),
      );
      if (filterKey) acc.push(item);
      return acc;
    }, []);
    if (sortKey) {
      const isNumber = allColumnPropsMap[sortKey]?.type === 'number';
      if (isNumber) {
        filterData.sort((a, b) =>
          isSortAsc
            ? (a[sortKey]?.value || 0) - (b[sortKey]?.value || 0)
            : (b[sortKey]?.value || 0) - (a[sortKey]?.value || 0),
        );
      } else {
        filterData.sort((a, b) =>
          isSortAsc
            ? (a[sortKey]?.value || '').localeCompare(b[sortKey]?.value || '')
            : (b[sortKey]?.value || '').localeCompare(a[sortKey]?.value || ''),
        );
      }
    }
    return filterData;
  }, [
    data,
    sortKey,
    filterList,
    allColumnKeyList,
    allColumnPropsMap,
    isSortAsc,
  ]);

  const onChangeFilterList = (value: string, columnIndex: number) => {
    if (!setFilterList) return;
    const newData = [...filterList];
    newData[columnIndex] = value;
    setFilterList(newData);
  };
  const getColumnWidth = ({ index }: { index: number }) =>
    columnPropsList.map(({ width = 100 }) => width)[index];
  const getStickyColumnWidth = ({ index }: { index: number }) =>
    stickyColumnPropsList.map(({ width = 100 }) => width)[index];
  return (
    <GridProvider
      value={{
        cache: new CellMeasurerCache({
          defaultWidth: columnWidth,
          defaultHeight: cellHeight,
          minWidth: 60,
          fixedWidth: true,
          fixedHeight: false,
        }),
        columnCount,
        columnKeyList,
        columnPropsList,
        data,
        filterable,
        filterList,
        filterData,
        getColumnWidth,
        getStickyColumnWidth,
        headerList,
        headerKeyList,
        headerRowCount,
        height,
        isSortAsc,
        onChange,
        onChangeFilterList,
        overscanColumnCount,
        overscanRowCount,
        readOnly,
        rowCount,
        selectable,
        setIsSortAsc,
        setSortKey,
        sortable,
        sortKey,
        stickyColumnCount,
        stickyColumnPropsList,
        stickyHeaderList,
        stickyHeaderKeyList,
        stickyHeaderRowCount,
        stickyColumnKeyList,
        stickyWidth,
      }}
    >
      <div className={defaultGridClassName}>
        <ScrollSync>
          {({ onScroll, scrollLeft, scrollTop }) => (
            <>
              <div className="flex flex-col">
                <StickyGridHeader />
                <StickyGridBody scrollTop={scrollTop} />
              </div>
              <AutoSizer disableHeight>
                {({ width }) => {
                  if (!width) return null; // first render will return 0 and store cache;
                  const bodyWidth = width - stickyWidth;
                  return (
                    <>
                      <GridHeader width={bodyWidth} scrollLeft={scrollLeft} />
                      <GridBody
                        width={bodyWidth}
                        onScroll={onScroll}
                        scrollLeft={scrollLeft}
                        scrollTop={scrollTop}
                      />
                    </>
                  );
                }}
              </AutoSizer>
            </>
          )}
        </ScrollSync>
      </div>
    </GridProvider>
  );
}

Grid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  filterable: PropTypes.bool,
  headerList: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
    .isRequired,
  headerKeyList: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  height: PropTypes.number,
  onChange: PropTypes.func,
  overscanColumnCount: PropTypes.number,
  overscanRowCount: PropTypes.number,
  selectable: PropTypes.bool,
  sortable: PropTypes.bool,
  stickyHeaderList: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
  stickyHeaderKeyList: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};

Grid.defaultProps = {
  data: [],
  filterable: true,
  height: 500,
  onChange: null,
  overscanColumnCount: 2,
  overscanRowCount: 2,
  selectable: false,
  sortable: true,
  stickyHeaderList: [[]],
  stickyHeaderKeyList: [[]],
};

export default Grid;
