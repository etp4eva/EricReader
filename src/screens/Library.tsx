import React, {useContext} from 'react';
import {FlatList, Button, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {LibraryContext} from '../contexts/LibraryContext';
import {updateLibrary} from '../reducers/LibraryReducer';
import {SettingsContext} from '../contexts/SettingsContext';

type LibraryProps = BottomTabScreenProps<RootParamList, 'ScreenLibrary'>;

export const LibraryTestProps = {
  books: [
    {
      title: 'The Creeps of Wrath',
      author: 'FartSmella',
      text: 'It was the best of times, it was the blurst of times',
      curPage: 69,
    },
    {
      title: 'Zut!',
      author: 'Heehee Man',
      text: 'The revenge of the Heehee Man will be swift and deadly',
      curPage: 420,
    },
  ],
};

export const LibraryScreen = ({navigation, route}: LibraryProps) => {
  const libraryContext = useContext(LibraryContext);
  const settingsContext = useContext(SettingsContext);
  return (
    <View>
      <Button
        title="REFRESH"
        onPress={() =>
          updateLibrary(
            libraryContext.state,
            libraryContext.dispatch,
            settingsContext.state.localFiles,
          )
        }
      />
      <FlatList
        data={LibraryTestProps.books}
        renderItem={({item}) => (
          <Button
            title={item.title}
            onPress={() => {
              navigation.navigate('ScreenReader', {book: item});
            }}
          />
        )}
      />
    </View>
  );
};
