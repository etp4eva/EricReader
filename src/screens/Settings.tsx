import React, {useContext, useState} from 'react';
import {FlatList, Button, View, Text, Modal} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import RemovableListItem from '../components/RemovableListItem';
import {SettingsContext} from '../contexts/SettingsContext';
import {LocalPathType, SettingsActionType} from '../reducers/SettingsReducer';
import DocumentPicker from 'react-native-document-picker';
import {GoogleDriveSettings} from '../components/GoogleDriveSettings';
import {DrivePicker} from './DrivePicker';

var RNGRP = require('react-native-get-real-path');

type SettingsProps = BottomTabScreenProps<RootParamList, 'ScreenSettings'>;

export const SettingsScreen = ({navigation, route}: SettingsProps) => {
  const {state, dispatch} = useContext(SettingsContext);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Modal
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <DrivePicker setModalVisible={setModalVisible} />
      </Modal>
      <GoogleDriveSettings setModalVisible={setModalVisible} />
      <Text>Local Files / Folders</Text>
      <FlatList
        data={state.localFiles}
        renderItem={({item, index}) => (
          <RemovableListItem
            title={item.path}
            remove_fn={() => {
              dispatch({
                type: SettingsActionType.REM_LOCAL,
                payload: {payload: index},
              });
            }}
          />
        )}
      />
      <Button
        title="Add Local File"
        onPress={() => {
          DocumentPicker.pick({
            type: 'application/epub+zip',
            allowMultiSelection: true,
          }).then(paths => {
            paths.forEach(path => {
              RNGRP.getRealPathFromURI(path.uri).then((filePath: string) => {
                console.log(filePath);
                dispatch({
                  type: SettingsActionType.ADD_LOCAL,
                  payload: {
                    payload: {path: filePath, type: LocalPathType.FILE},
                  },
                });
              });
            });
          });
        }}
      />
    </View>
  );
};
