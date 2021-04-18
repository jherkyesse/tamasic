import React, { useState, useEffect } from 'react';
import { ScrollSync, AutoSizer } from 'react-virtualized';
import { GridProvider } from './GridContext';
import LeftGrid from './LeftGrid';
import GridHeader from './GridHeader';
import GridBody from './GridBody';

type GridProps = {
  data: Array<{ index: number }>;
  stickyHeaderList: Array<any>;
  stickyHeaderKeyList: Array<string>;
  headerList: Array<any>;
  headerKeyList: Array<string>;
  height: number;
  onChange?: Function;
  selectable?: boolean;
};

function Grid({
  data,
  stickyHeaderList = [],
  stickyHeaderKeyList = [],
  headerList = [],
  headerKeyList = [],
  height = 500,
  onChange,
  selectable = false,
}: GridProps) {
  const rowCount = data.length;
  const columnCount = headerKeyList.length;
  const headerRowCount = headerList.length;
  return (
    <GridProvider
      value={{
        columnCount,
        data,
        stickyHeaderList,
        stickyHeaderKeyList,
        headerList,
        headerKeyList,
        headerRowCount,
        height,
        onChange,
        rowCount,
        selectable,
      }}
    >
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
            <LeftGrid />
            <AutoSizer disableHeight>
              {({ width }) => {
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
                    {/* <GridBody
                      // data={filterData}
                      width={bodyWidth}
                      onScroll={onScroll}
                      scrollLeft={scrollLeft}
                      // activeCell={activeCell}
                      // setActiveCell={setActiveCell}
                      // onChangeValue={onChangeValue}
                    /> */}
                  </>
                );
              }}
            </AutoSizer>
          </>
        )}
      </ScrollSync>
    </GridProvider>
  );
}

export default Grid;
