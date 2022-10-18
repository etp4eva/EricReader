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
import {ReaderScreen, ReaderTestProps} from './screens/Reader';
import {SettingsScreen} from './screens/Settings';
import {
  SettingsReducer,
  SettingsInitialState,
  appLaunch,
} from './reducers/SettingsReducer';
import {SettingsContext} from './contexts/SettingsContext';
import {LibraryScreen, LibraryTestProps} from './screens/Library';
import {ActivityIndicator} from 'react-native';

const Root = createBottomTabNavigator<RootParamList>();

const App = () => {
  const [state, dispatch] = useReducer(SettingsReducer, SettingsInitialState);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    appLaunch(dispatch, setLoading);
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <SettingsContext.Provider value={{state, dispatch}}>
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
            initialParams={state}
          />
          <Root.Screen
            name="ScreenReader"
            component={ReaderScreen}
            options={{title: 'Read'}}
            initialParams={ReaderTestProps}
          />
        </Root.Navigator>
      </NavigationContainer>
    </SettingsContext.Provider>
  );
};

export default App;
