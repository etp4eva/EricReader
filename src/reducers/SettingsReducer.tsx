// A lot of help from:
// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {ActionMap} from '../utils/core';

export enum SettingsActionType {
  GDRIVE_INIT = 'GDRIVE_INIT',
  GDRIVE_CHECK_CONNECT = 'GDRIVE_CHECK_CONNECT',
  GDRIVE_CONNECTED = 'GDRIVE_CONNECTED',
  GDRIVE_DISCONNECT = 'GDRIVE_DISCONNECT',
  ADD_DRIVE = 'ADD_DRIVE',
  REM_DRIVE = 'REM_DRIVE',
  LOCAL_INIT = 'LOCAL_INIT',
  ADD_LOCAL = 'ADD_LOCAL',
  REM_LOCAL = 'REM_LOCAL',
}

export enum DriveStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED',
}

export type GdriveFile = {
  id: string;
  mimeType: string;
  name: string;
};

export enum LocalPathType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}

export type LocalPath = {
  type: LocalPathType;
  path: string;
};

export interface SettingsState {
  driveStatus: DriveStatus;
  driveUser: string;
  driveAccessToken: string;
  driveFiles: GdriveFile[];
  localFiles: LocalPath[];
}

export const SettingsInitialState: SettingsState = {
  driveStatus: DriveStatus.DISCONNECTED,
  driveUser: '',
  driveAccessToken: '',
  driveFiles: [],
  localFiles: [],
};

export const ASYNC_STORAGE_PREFIX: string = 'ERIC_READER_DRIVE_USER_';
export const ASYNC_STORAGE_LOCAL_KEY: string = 'ERIC_READER_LOCAL';

export const appLaunch = (
  dispatch: React.Dispatch<SettingsActions>,
  setLoading: (isLoading: boolean) => void,
) => {
  // TODO: One configure call for entire app
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    offlineAccess: true,
    webClientId:
      '1071477746439-ldva1es9o429t15c10pasvqrpjhqa466.apps.googleusercontent.com',
  });
  GoogleSignin.signInSilently()
    .then(() => {
      GoogleSignin.getTokens().then(tokens => {
        AsyncStorage.getItem(ASYNC_STORAGE_PREFIX + tokens.idToken).then(
          result => {
            const driveFiles: GdriveFile[] =
              result != null ? JSON.parse(result) : [];

            dispatch({
              type: SettingsActionType.GDRIVE_INIT,
              payload: {
                payload: {
                  access: tokens.accessToken,
                  user: tokens.idToken,
                  driveFiles: driveFiles,
                },
              },
            });
          },
        );
      });
    })
    .catch(() => {})
    .finally(() => {
      AsyncStorage.getItem(ASYNC_STORAGE_LOCAL_KEY)
        .then(result => {
          const localFiles: LocalPath[] =
            result != null ? JSON.parse(result) : [];

          dispatch({
            type: SettingsActionType.LOCAL_INIT,
            payload: {
              payload: localFiles,
            },
          });
        })
        .finally(() => {
          setLoading(false);
        });
    });
};

export const saveSettingsState = (state: SettingsState) => {
  try {
    AsyncStorage.setItem(
      ASYNC_STORAGE_PREFIX + state.driveUser,
      JSON.stringify(state.driveFiles),
    );
    AsyncStorage.setItem(
      ASYNC_STORAGE_LOCAL_KEY,
      JSON.stringify(state.localFiles),
    );
  } catch (error) {
    console.error(error);
  }
};

type SettingsPayload = {
  [SettingsActionType.GDRIVE_INIT]: {
    payload: {user: string; access: string; driveFiles: GdriveFile[]};
  };
  [SettingsActionType.GDRIVE_CONNECTED]: {
    payload: {user: string; access: string};
  };
  [SettingsActionType.GDRIVE_DISCONNECT]: {};
  [SettingsActionType.ADD_DRIVE]: {
    payload: GdriveFile;
  };
  [SettingsActionType.REM_DRIVE]: {
    payload: GdriveFile;
  };
  [SettingsActionType.LOCAL_INIT]: {
    payload: LocalPath[];
  };
  [SettingsActionType.ADD_LOCAL]: {
    payload: LocalPath;
  };
  [SettingsActionType.REM_LOCAL]: {
    payload: number;
  };
};

export type SettingsActions =
  ActionMap<SettingsPayload>[keyof ActionMap<SettingsPayload>];

export const SettingsReducer = (
  state: SettingsState,
  action: SettingsActions,
): SettingsState => {
  let newState;
  switch (action.type) {
    case SettingsActionType.GDRIVE_INIT:
      return {
        ...state,
        driveStatus: DriveStatus.CONNECTED,
        driveUser: action.payload.payload.user,
        driveAccessToken: action.payload.payload.access,
        driveFiles: action.payload.payload.driveFiles,
      };
    case SettingsActionType.GDRIVE_CONNECTED:
      return {
        ...state,
        driveStatus: DriveStatus.CONNECTED,
        driveUser: action.payload.payload.user,
        driveAccessToken: action.payload.payload.access,
      };
    case SettingsActionType.GDRIVE_DISCONNECT:
      return {
        ...state,
        driveStatus: DriveStatus.DISCONNECTED,
        driveAccessToken: '',
        driveUser: '',
      };
    case SettingsActionType.ADD_DRIVE:
      newState = {
        ...state,
        driveFiles: [...state.driveFiles, action.payload.payload],
      };
      saveSettingsState(newState);
      return newState;
    case SettingsActionType.REM_DRIVE:
      newState = {
        ...state,
        driveFiles: state.driveFiles.filter(
          (elm: GdriveFile) => elm.id !== action.payload.payload.id,
        ),
      };
      saveSettingsState(newState);
      return newState;
    case SettingsActionType.LOCAL_INIT:
      return {
        ...state,
        localFiles: action.payload.payload,
      };
    case SettingsActionType.ADD_LOCAL:
      newState = {
        ...state,
        localFiles: [...state.localFiles, action.payload.payload],
      };
      saveSettingsState(newState);
      return newState;
    case SettingsActionType.REM_LOCAL:
      newState = {
        ...state,
        localFiles: state.localFiles.filter(
          (elm: LocalPath, index: number) => index !== action.payload.payload,
        ),
      };
      saveSettingsState(newState);
      return newState;
    default:
      return state;
  }
};
