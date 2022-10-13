// A lot of help from:
// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm

type ActionMap<M extends {[index: string]: any}> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum SettingsActionType {
  GDRIVE_CHECK_CONNECT = 'GDRIVE_CHECK_CONNECT',
  GDRIVE_CONNECTED = 'GDRIVE_CONNECTED',
  GDRIVE_DISCONNECT = 'GDRIVE_DISCONNECT',
  ADD_LOCAL = 'ADD_LOCAL',
  REM_LOCAL = 'REM_LOCAL',
  ADD_DRIVE = 'ADD_DRIVE',
  REM_DRIVE = 'REM_DRIVE',
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

export interface SettingsState {
  driveStatus: DriveStatus;
  driveToken: string;
  driveFiles: GdriveFile[];
  localFiles: string[];
}

export const SettingsInitialState: SettingsState = {
  driveStatus: DriveStatus.DISCONNECTED,
  driveToken: '',
  driveFiles: [],
  localFiles: ['/where/did/u/hide', '/those/eggs'],
};

type SettingsPayload = {
  [SettingsActionType.GDRIVE_CONNECTED]: {
    payload: string;
  };
  [SettingsActionType.GDRIVE_DISCONNECT]: {};
  [SettingsActionType.ADD_DRIVE]: {
    payload: GdriveFile;
  };
  [SettingsActionType.REM_DRIVE]: {
    payload: GdriveFile;
  };
  [SettingsActionType.ADD_LOCAL]: {
    payload: string;
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
  switch (action.type) {
    case SettingsActionType.GDRIVE_CONNECTED:
      return {
        ...state,
        driveStatus: DriveStatus.CONNECTED,
        driveToken: action.payload.payload,
      };
    case SettingsActionType.GDRIVE_DISCONNECT:
      return {
        ...state,
        driveStatus: DriveStatus.DISCONNECTED,
        driveToken: '',
      };
    case SettingsActionType.ADD_LOCAL:
      return {
        ...state,
        localFiles: [...state.localFiles, action.payload.payload],
      };
    case SettingsActionType.REM_LOCAL:
      return {
        ...state,
        localFiles: state.localFiles.filter(
          (elm: string, index: number) => index !== action.payload.payload,
        ),
      };
    case SettingsActionType.ADD_DRIVE:
      return {
        ...state,
        driveFiles: [...state.driveFiles, action.payload.payload],
      };
    case SettingsActionType.REM_DRIVE:
      return {
        ...state,
        driveFiles: state.driveFiles.filter(
          (elm: GdriveFile) => elm.id !== action.payload.payload.id,
        ),
      };
    default:
      return state;
  }
};
