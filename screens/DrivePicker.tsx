import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GDrive} from '@robinbobin/react-native-google-drive-api-wrapper';
import ListQueryBuilder from '@robinbobin/react-native-google-drive-api-wrapper/ListQueryBuilder';
import MimeTypes from '@robinbobin/react-native-google-drive-api-wrapper/MimeTypes';
import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {SettingsContext} from '../contexts/SettingsContext';
import {
  SettingsActions,
  SettingsActionType,
  GdriveFile,
} from '../reducers/SettingsReducer';

type DrivePickerProps = {
  setModalVisible: (modalVisible: boolean) => void;
};

const rootFolder: GdriveFile = {
  id: 'root',
  name: 'root',
  mimeType: MimeTypes.FOLDER,
};

const returnFile = (
  dispatch: React.Dispatch<SettingsActions>,
  setModalVisible: (visible: boolean) => void,
  file: GdriveFile,
) => {
  dispatch({
    type: SettingsActionType.ADD_DRIVE,
    payload: {payload: file},
  });
  setModalVisible(false);
};

const listFolder = (
  folder_id: string,
  drive_token: string,
  setFileList: (fileList: GdriveFile[]) => void,
  setLoading: (isLoading: boolean) => void,
) => {
  const gdrive = new GDrive();
  gdrive.accessToken = drive_token;
  let query = new ListQueryBuilder().in(folder_id, 'parents');
  gdrive.files
    .list({
      q: query,
    })
    .then(({files}) => {
      let sorted: GdriveFile[] = files;

      sorted.sort((a, b) => {
        if (a.mimeType !== b.mimeType) {
          if (a.mimeType === MimeTypes.FOLDER) {
            return -1;
          } else if (b.mimeType === MimeTypes.FOLDER) {
            return 1;
          }
        }

        return a.name.localeCompare(b.name);
      });

      setFileList(sorted);
      setLoading(false);
    });
};

export const DrivePicker = ({setModalVisible}: DrivePickerProps) => {
  const {state, dispatch} = useContext(SettingsContext);
  const [isLoading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([] as GdriveFile[]);
  const [folder, setFolder] = useState(rootFolder);
  const [folderStack, setFolderStack] = useState([rootFolder]);

  useEffect(() => {
    setLoading(true);

    try {
      GoogleSignin.isSignedIn().then(isSignedIn => {
        if (isSignedIn) {
          listFolder(folder.id, state.driveToken, setFileList, setLoading);
        } else {
          GoogleSignin.signInSilently().then(() => {
            GoogleSignin.getTokens().then(tokens => {
              dispatch({
                type: SettingsActionType.GDRIVE_CONNECTED,
                payload: {payload: tokens.accessToken},
              });
              listFolder(folder.id, state.driveToken, setFileList, setLoading);
            });
          });
        }
      });
    } catch (error) {
      // TODO: Error page
      console.log(error);
    }
  }, [folder, state.driveToken, dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View>
        <View style={styles.topBar}>
          <Button
            title="<<"
            onPress={() => {
              setModalVisible(false);
            }}
          />
          {folder.id !== rootFolder.id && (
            <Button
              title="<"
              onPress={() => {
                setFolder(folderStack[folderStack.length - 2]);
                setFolderStack(folderStack.slice(0, -1));
              }}
            />
          )}
          <Button
            title="+"
            onPress={() => {
              returnFile(dispatch, setModalVisible, folder);
            }}
          />
        </View>
        <Text>{folderStack.map(item => item.name).join('/')}</Text>
        <FlatList
          data={fileList}
          renderItem={({item}) => {
            const isFolder: boolean = item.mimeType === MimeTypes.FOLDER;
            const newFolder: GdriveFile = {
              id: item.id,
              name: item.name,
              mimeType: MimeTypes.FOLDER,
            };

            return (
              // TODO: Show file type with icon
              <View style={styles.drivePickerItem}>
                <Text>{item.name}</Text>
                {isFolder && (
                  <Button
                    title="->"
                    onPress={() => {
                      setFolderStack([...folderStack, newFolder]);
                      setFolder(newFolder);
                    }}
                  />
                )}
                <Button
                  title="✓"
                  onPress={() => {
                    returnFile(dispatch, setModalVisible, newFolder);
                  }}
                />
              </View>
            );
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  drivePickerItem: {
    flex: 1,
    flexDirection: 'row',
  },
  topBar: {
    flexDirection: 'row',
  },
});
