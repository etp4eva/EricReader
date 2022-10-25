import {DriveStatus} from './src/reducers/SettingsReducer';

type Book = {
  title: string;
  author: string;
  text: string;
  curPage: number;
};

type RootParamList = {
  ScreenLibrary: {books: Book[]};
  ScreenSettings: {
    driveStatus: DriveStatus;
    driveToken: '';
    driveFiles: string[];
    localFiles: string[];
  };
  ScreenReader: {book: Book};
};
