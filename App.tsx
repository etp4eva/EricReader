/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useReducer, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ReaderScreen, ReaderTestProps} from './src/screens/Reader';
import {SettingsScreen} from './src/screens/Settings';
import {
  SettingsReducer,
  SettingsInitialState,
  appLaunch,
} from './src/reducers/SettingsReducer';
import {SettingsContext} from './src/contexts/SettingsContext';
import {LibraryScreen, LibraryTestProps} from './src/screens/Library';
import {ActivityIndicator} from 'react-native';
import {LibraryContext} from './src/contexts/LibraryContext';
import {
  LibraryInitialState,
  LibraryReducer,
} from './src/reducers/LibraryReducer';

const Root = createBottomTabNavigator<RootParamList>();

const App = () => {
  const [settingsState, settingsDispatch] = useReducer(
    SettingsReducer,
    SettingsInitialState,
  );
  const [libraryState, libraryDispatch] = useReducer(
    LibraryReducer,
    LibraryInitialState,
  );
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    appLaunch(settingsDispatch, setLoading);
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <SettingsContext.Provider
      value={{state: settingsState, dispatch: settingsDispatch}}>
      <LibraryContext.Provider
        value={{state: libraryState, dispatch: libraryDispatch}}>
        <NavigationContainer>
          <Root.Navigator initialRouteName="ScreenLibrary">
            <Root.Screen
              name="ScreenLibrary"
              component={LibraryScreen}
              options={{title: 'Library'}}
              initialParams={LibraryTestProps}
            />
            <Root.Screen
              name="ScreenSettings"
              component={SettingsScreen}
              options={{title: 'Settings'}}
              initialParams={settingsState}
            />
            <Root.Screen
              name="ScreenReader"
              component={ReaderScreen}
              options={{title: 'Read'}}
              initialParams={ReaderTestProps}
            />
          </Root.Navigator>
        </NavigationContainer>
      </LibraryContext.Provider>
    </SettingsContext.Provider>
  );
};

export default App;
