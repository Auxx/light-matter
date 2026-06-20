export interface FileInfo {
  path: string;
  name: string;
  parent: string;
  ext: string;
  isDirectory: boolean;
  createdAt: number;
  size: number;
}
