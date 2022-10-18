import React, {useContext, useState} from 'react';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {DriveStatus, SettingsActionType} from '../reducers/SettingsReducer';
import {SettingsContext} from '../contexts/SettingsContext';
import {ActivityIndicator, Button, FlatList, Text, View} from 'react-native';
import RemovableListItem from './RemovableListItem';

interface Props {
  setModalVisible: (setModalVisible: boolean) => void;
}

export const GoogleDriveSettings = (props: Props) => {
  const {state, dispatch} = useContext(SettingsContext);
  const [isLoading, setLoading] = useState(true);

  if (state.driveStatus === DriveStatus.CONNECTED) {
    if (isLoading) {
      setLoading(false);
    }

    return (
      <View>
        <Button
          title="DISCONNECT GOOGLE DRIVE"
          onPress={() => {
            try {
              dispatch({
                type: SettingsActionType.GDRIVE_DISCONNECT,
                payload: {payload: DriveStatus.DISCONNECTED},
              });
              GoogleSignin.signOut();
            } catch (error) {
              console.error(error);
            }
          }}
        />
        <Text>Google Drive Files / Folders</Text>
        <FlatList
          data={state.driveFiles}
          renderItem={({item}) => (
            <RemovableListItem
              title={item.name}
              remove_fn={() => {
                dispatch({
                  type: SettingsActionType.REM_DRIVE,
                  payload: {payload: item},
                });
              }}
            />
          )}
        />
        <Button
          title="Add Google Drive file"
          onPress={() => {
            props.setModalVisible(true);
          }}
        />
      </View>
    );
  } else {
    console.log('ATTEMPTING SILENT LOG-IN');
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      offlineAccess: true,
      webClientId:
        '1071477746439-ldva1es9o429t15c10pasvqrpjhqa466.apps.googleusercontent.com',
    });
    GoogleSignin.signInSilently()
      .then(user => {
        console.log('SILENT LOG-IN SUCCESS');
        console.log(JSON.stringify(user));
        GoogleSignin.getTokens()
          .then(tokens => {
            console.log(JSON.stringify(tokens));
            dispatch({
              type: SettingsActionType.GDRIVE_CONNECTED,
              payload: {
                payload: {
                  access: tokens.accessToken,
                  user: tokens.idToken,
                },
              },
            });

            if (isLoading) {
              setLoading(false);
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.log(error);
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          if (isLoading) {
            setLoading(false);
          }
        }
      });
  }

  if (isLoading) {
    return <ActivityIndicator />;
  } else {
    return (
      <GoogleSigninButton
        onPress={() => {
          GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            offlineAccess: true,
            webClientId:
              '1071477746439-ldva1es9o429t15c10pasvqrpjhqa466.apps.googleusercontent.com',
          });
          GoogleSignin.hasPlayServices()
            .then(hasPlayService => {
              if (hasPlayService) {
                console.log('ATTEMPTING LOG-IN');
                GoogleSignin.signIn()
                  .then(userInfo => {
                    console.log('LOG-IN SUCCESS');
                    console.log(JSON.stringify(userInfo));
                    console.log('GETTING TOKENS');
                    GoogleSignin.getTokens().then(tokens => {
                      console.log('GOT TOKENS');
                      console.log(JSON.stringify(tokens));
                      dispatch({
                        type: SettingsActionType.GDRIVE_CONNECTED,
                        payload: {
                          payload: {
                            access: tokens.accessToken,
                            user: tokens.idToken,
                          },
                        },
                      });
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
    );
  }
};
