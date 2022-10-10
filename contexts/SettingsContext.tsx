import {createContext, Dispatch} from 'react';
import {
  SettingsInitialState,
  SettingsActions,
  SettingsState,
} from '../reducers/SettingsReducer';

export const SettingsContext = createContext<{
  state: SettingsState;
  dispatch: Dispatch<SettingsActions>;
}>({
  state: SettingsInitialState,
  dispatch: () => null,
});
