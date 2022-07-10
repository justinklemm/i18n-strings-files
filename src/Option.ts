import { I18nStringsFiles } from './types';
export interface ReadWriteOption {
  encoding?: string;
  wantsComments?: boolean;
}

export type CallbackFunc = (err: Error | null, data: I18nStringsFiles | null) => void;

export type OptionLike = ReadWriteOption | string | undefined | CallbackFunc;
