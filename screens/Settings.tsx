import React, {useContext, useState} from 'react';
import {FlatList, Button, View, Text, Modal} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import RemovableListItem from '../components/RemovableListItem';
import {SettingsContext} from '../contexts/SettingsContext';
import {SettingsActionType} from '../reducers/SettingsReducer';
import {selectDirectory} from 'react-native-directory-picker';
import {GoogleDriveSettings} from '../components/GoogleDriveSettings';
import {DrivePicker} from './DrivePicker';

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
            title={item}
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
          selectDirectory().then(path => {
            dispatch({
              type: SettingsActionType.ADD_LOCAL,
              payload: {payload: path},
            });
          });
        }}
      />
    </View>
  );
};
