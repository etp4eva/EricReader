import React from 'react';
import {FlatList, Button} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

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
  return (
    <FlatList
      data={route.params.books}
      renderItem={({item}) => (
        <Button
          title={item.title}
          onPress={() => {
            navigation.navigate('ScreenReader', {book: item});
          }}
        />
      )}
    />
  );
};
