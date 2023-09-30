export interface IFile {
  key: string;
  bucket: string;
  mime: string;
  size: number;
}

export interface IFiles {
  key: string[];
  bucket: string[];
  mime: string[];
  size: number[];
}
