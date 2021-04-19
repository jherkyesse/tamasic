import React, { useState, useEffect } from 'react';
import { ScrollSync, AutoSizer } from 'react-virtualized';
import { GridProvider } from './GridContext';
import StickyGridHeader from './StickyGridHeader';
import StickyGridBody from './StickyGridBody';
import GridHeader from './GridHeader';
import GridBody from './GridBody';
import { cache, cellHeight } from './config';

const defaultGridClassName =
  'w-full flex flex-nowrap border border-gray-300 overflow-hidden';

type GridProps = {
  data: Array<{ index: number }>;
  headerList: Array<any>;
  headerKeyList: Array<string>;
  height: number;
  onChange?: Function;
  selectable?: boolean;
  stickyHeaderList?: Array<any>;
  stickyHeaderKeyList?: Array<string>;
};

function Grid({
  data,
  headerList = [],
  headerKeyList = [],
  height = 500,
  onChange,
  selectable = false,
  stickyHeaderList = [],
  stickyHeaderKeyList = [],
}: GridProps) {
  const rowCount = data.length;
  const columnCount = headerKeyList.length;
  const headerRowCount = headerList.length;
  const columnPropsList = headerList[headerRowCount - 1];
  const stickyColumnCount = stickyHeaderKeyList.length;
  const stickyHeaderRowCount = stickyHeaderList.length;
  const stickyColumnPropsList = stickyHeaderList[stickyHeaderRowCount - 1];
  const stickyWidth = stickyHeaderList[0].reduce(
    (acc, cur) => (acc ?? 100) + (cur.width ?? 100),
    0,
  );

  const getColumnWidth = ({ index }) =>
    columnPropsList.map(({ width = 100 }) => width)[index];
  const getHeaderRowWidth = ({ index }) =>
    headerList.map((_) => cellHeight)[index];
  const getStickyColumnWidth = ({ index }) =>
    stickyColumnPropsList.map(({ width = 100 }) => width)[index];

  return (
    <GridProvider
      value={{
        cache,
        columnCount,
        columnPropsList,
        data,
        getColumnWidth,
        getHeaderRowWidth,
        getStickyColumnWidth,
        headerList,
        headerKeyList,
        headerRowCount,
        height,
        onChange,
        rowCount,
        selectable,
        stickyColumnCount,
        stickyColumnPropsList,
        stickyHeaderList,
        stickyHeaderKeyList,
        stickyHeaderRowCount,
        stickyWidth,
      }}
    >
      <div className={defaultGridClassName}>
        <ScrollSync>
          {({
            clientHeight,
            clientWidth,
            onScroll,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
          }) => (
            <>
              <div className="flex flex-col" height={height}>
                <StickyGridHeader />
                <StickyGridBody scrollTop={scrollTop} />
              </div>
              <AutoSizer disableHeight>
                {({ width }) => {
                  if (!width) return null; // first render will return 0 and store cache;
                  const bodyWidth = width;
                  return (
                    <>
                      <GridHeader
                        width={bodyWidth}
                        // filterable={filterable}
                        // filterList={filterList}
                        // setFilterList={setFilterList}
                        // headerStyleList={headerStyleList}
                        scrollLeft={scrollLeft}
                      />
                      <GridBody
                        // data={filterData}
                        width={bodyWidth}
                        onScroll={onScroll}
                        scrollLeft={scrollLeft}
                        scrollTop={scrollTop}
                        // activeCell={activeCell}
                        // setActiveCell={setActiveCell}
                        // onChangeValue={onChangeValue}
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

export default Grid;
