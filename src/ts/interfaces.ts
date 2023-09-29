export interface IFile {
  s3Key: string;
  bucket: string;
  mime: string;
  alt: string | null;
}
