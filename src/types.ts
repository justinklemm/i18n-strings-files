export type I18nStringsFilesNoComment = Record<string, string>;
export interface I18nStringsWithCommentEntry {
  text: string;
  comment?: string;
}
export type I18nStringFileWithComment = Record<string, I18nStringsWithCommentEntry>;
export type I18nStringsFiles = I18nStringsFilesNoComment | I18nStringFileWithComment;
