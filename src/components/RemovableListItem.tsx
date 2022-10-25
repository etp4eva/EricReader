import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

interface Props {
  title: string;
  remove_fn: () => void;
}

const RemovableListItem = ({title, remove_fn}: Props) => {
  return (
    <View style={styles.removableListItem}>
      <Text>{title}</Text>
      <Button title="X" onPress={remove_fn} />
    </View>
  );
};

const styles = StyleSheet.create({
  removableListItem: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default RemovableListItem;
