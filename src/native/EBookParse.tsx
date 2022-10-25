/**
 * This exposes the native EBookParse module as a JS module. This has a
 * function 'parseEBook' which takes the following parameters:
 *
 * 1. String path: A string representing the path to the ebook
 */

import {NativeModules} from 'react-native';
const {EBookParse} = NativeModules;

type ParsedEBook = {
  author: string;
  hash: string;
  title: string;
};

interface EBookInterface {
  parseEBook(path: string): Promise<ParsedEBook>;
}

export default EBookParse as EBookInterface;
