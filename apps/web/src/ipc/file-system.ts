import { Injectable } from '@angular/core';
import { ApiResponse, DesktopFileSystem, SortDirection, SortType } from 'internal-api';

@Injectable({ providedIn: 'root' })
export class FileSystem implements DesktopFileSystem {
  readonly join = (...paths: string[]) => window.desktop.FileSystem.join(...paths);

  readonly dirname = (fileName: string) => window.desktop.FileSystem.dirname(fileName);

  readonly readDir = (path: string) => window.desktop.FileSystem.readDir(path);

  readonly readJson = <T>(path: string): Promise<ApiResponse<T>> => window.desktop.FileSystem.readJson(path);

  readonly writeJson = async <T>(path: string, data: T) => window.desktop.FileSystem.writeJson(path, data);

  readonly readGalleryLocation = async (path: string) => window.desktop.FileSystem.readGalleryLocation(path);

  readonly readDirectories = async (path: string) => window.desktop.FileSystem.readDirectories(path);

  readonly readImages = async (path: string, sortBy: SortType, sortDir: SortDirection) =>
    window.desktop.FileSystem.readImages(path, sortBy, sortDir);
}
