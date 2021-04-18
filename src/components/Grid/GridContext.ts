import { createContext } from 'react';

const GridContext = createContext({});
const GridProvider = GridContext.Provider;
const GridConsumer = GridContext.Consumer;

export default GridContext;
export { GridProvider, GridConsumer };
