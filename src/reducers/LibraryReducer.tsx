import {ActionMap} from '../utils/core';
//import {Dirs, FileStat, FileSystem, Util} from 'react-native-file-access';
import {LocalPath} from './SettingsReducer';
import EBookParse from '../native/EBookParse';

export enum LibraryActionType {
  LIBRARY_INIT = 'LIBRARY_INIT',
  REFRESH_LOCAL = 'REFRESH_LOCAL',
  REFRESH_DRIVE = 'REFRESH_DRIVE',
}

type LibraryPayload = {
  [LibraryActionType.REFRESH_LOCAL]: {
    localFiles: string[];
  };
};

type Book = {
  title: string;
  author: string;
  localPath: string;
  gDriveId: string;
  hash: string;
  pctRead: number;
  fullyRead: boolean;
};

export interface LibraryState {
  library: Record<string, Book>;
}

export const LibraryInitialState: LibraryState = {
  library: {},
};

export type LibraryActions =
  ActionMap<LibraryPayload>[keyof ActionMap<LibraryPayload>];

// TODO: keep database of paths to storage and copy on request

export const updateLibrary = async (
  state: LibraryState,
  dispatch,
  localFiles: LocalPath[],
) => {
  let unverifiedBookHashes: Record<string, Book> = state.library;
  let newLibrary: Record<string, Book>;

  EBookParse.parseEBook('zonk').then(result => {
    console.log(result);
  });
  /*
  // For each path in localPath:
  localFiles.forEach(filePath => {

    //   Calculate hash
    FileSystem.hash(filePath.path, 'MD5').then(hash => {
      if (hash in unverifiedBookHashes) {
        newLibrary[hash] = unverifiedBookHashes[hash];
        newLibrary[hash].localPath = filePath.path;
        delete unverifiedBookHashes[hash];
      } else {
        parseEpub(filePath.path).then(epubObj => {

        });
        newLibrary[hash] = {

        };
      }
    });
    //   Check if hash in library:
    //     If so update with new path if necessary
    //       and remove from list of books to check
    //     If no create new Book
  });

  // rebuild displayLibrary (i.e. sort)
  */
};

export const LibraryReducer = (
  state: LibraryState,
  action: LibraryActions,
): LibraryState => {
  switch (action.type) {
    case LibraryActionType.REFRESH_LOCAL:
      return state;
    default:
      return state;
  }
};
