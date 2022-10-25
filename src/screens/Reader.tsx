import React from 'react';
import {View, Text} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

type ReaderProps = BottomTabScreenProps<RootParamList, 'ScreenReader'>;

export const ReaderTestProps = {
  book: {
    title: 'The Creeps of Wrath',
    author: 'FartSmella',
    text: 'It was the best of times, it was the blurst of times',
    curPage: 69,
  },
};

export const ReaderScreen = ({navigation, route}: ReaderProps) => {
  return (
    <View>
      <Text>{route.params.book.title}</Text>
      <Text>{route.params.book.author}</Text>
      <Text>{route.params.book.curPage}</Text>
      <Text>{route.params.book.text}</Text>
    </View>
  );
};
