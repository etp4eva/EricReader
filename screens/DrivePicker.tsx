import React, {useContext} from 'react';
import {Button, FlatList, View, Text, TouchableHighlight} from 'react-native';
import {SettingsContext} from '../contexts/SettingsContext';

const folders: string[] = ['Zim', 'Zom', '.', '..'];

type DrivePickerProps = {
  setModalVisible: (modalVisible: boolean) => void;
};

export const DrivePicker = ({setModalVisible}: DrivePickerProps) => {
  const {state, dispatch} = useContext(SettingsContext);

  return (
    <View>
      <Button
        title="<-"
        onPress={() => {
          setModalVisible(false);
        }}
      />
      <Text>/Current/Folder/</Text>
      <FlatList
        data={folders}
        renderItem={({item}) => {
          return (
            <TouchableHighlight>
              <Text>{item}</Text>
            </TouchableHighlight>
          );
        }}
      />
    </View>
  );
};
