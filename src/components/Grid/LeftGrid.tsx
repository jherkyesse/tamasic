import React, { useContext } from 'react';
import { Grid } from 'react-virtualized';
import GridContext from './GridContext';

function LeftGrid() {
  const { data } = useContext(GridContext);
  return (
    <>
      {/* <Grid /> */}
    </>
  );
}

export default LeftGrid;
