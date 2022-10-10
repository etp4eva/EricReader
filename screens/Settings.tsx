import React, {useContext, useState} from 'react';
import {FlatList, Button, View, Text, Modal} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import RemovableListItem from '../components/RemovableListItem';
import {SettingsContext} from '../contexts/SettingsContext';
import {DriveStatus, SettingsActionType} from '../reducers/SettingsReducer';
import {selectDirectory} from 'react-native-directory-picker';
import {
  GoogleSignin,
  StatusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
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
      <Text>
        Google Drive status:
        {state.driveStatus === DriveStatus.CONNECTED
          ? ' Connected'
          : ' Disconnected'}
      </Text>
      {state.driveStatus === DriveStatus.CONNECTED && (
        <Button
          title="DISCONNECT"
          onPress={() => {
            try {
              GoogleSignin.signOut();
              dispatch({
                type: SettingsActionType.GDRIVE_DISCONNECT,
                payload: {payload: DriveStatus.DISCONNECTED},
              });
            } catch (error) {
              console.error(error);
            }
          }}
        />
      )}
      {state.driveStatus !== DriveStatus.CONNECTED && (
        <GoogleSigninButton
          onPress={() => {
            GoogleSignin.configure({
              offlineAccess: true,
              webClientId:
                '1071477746439-ldva1es9o429t15c10pasvqrpjhqa466.apps.googleusercontent.com',
            });
            GoogleSignin.hasPlayServices()
              .then(hasPlayService => {
                if (hasPlayService) {
                  GoogleSignin.signIn()
                    .then(userInfo => {
                      console.log(JSON.stringify(userInfo));
                      dispatch({
                        type: SettingsActionType.GDRIVE_CONNECTED,
                        payload: {payload: DriveStatus.CONNECTED},
                      });
                    })
                    .catch(e => {
                      console.log('ERROR IS: ' + JSON.stringify(e));
                      dispatch({
                        type: SettingsActionType.GDRIVE_DISCONNECT,
                        payload: {payload: DriveStatus.DISCONNECTED},
                      });
                    });
                }
              })
              .catch(e => {
                console.log('ERROR IS: ' + JSON.stringify(e));
                dispatch({
                  type: SettingsActionType.GDRIVE_DISCONNECT,
                  payload: {payload: DriveStatus.DISCONNECTED},
                });
              });
          }}
        />
      )}
      {state.driveStatus === DriveStatus.CONNECTED && (
        <Text>Google Drive Files / Folders</Text>
      )}
      {state.driveStatus === DriveStatus.CONNECTED && (
        <FlatList
          data={state.driveFiles}
          renderItem={({item, index}) => (
            <RemovableListItem
              title={item}
              remove_fn={() => {
                dispatch({
                  type: SettingsActionType.REM_DRIVE,
                  payload: {payload: index},
                });
              }}
            />
          )}
        />
      )}
      {state.driveStatus === DriveStatus.CONNECTED && (
        <Button
          title="Add Google Drive file"
          onPress={() => {
            setModalVisible(true);
          }}
        />
      )}
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
