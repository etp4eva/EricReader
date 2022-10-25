import {createContext, Dispatch} from 'react';
import {
  LibraryActions,
  LibraryInitialState,
  LibraryState,
} from '../reducers/LibraryReducer';

export const LibraryContext = createContext<{
  state: LibraryState;
  dispatch: Dispatch<LibraryActions>;
}>({
  state: LibraryInitialState,
  dispatch: () => null,
});
