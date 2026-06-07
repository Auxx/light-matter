import { Injectable } from '@angular/core';
import { ApiResponse } from 'internal-api';

@Injectable({ providedIn: 'root' })
export class FileSystem {
  readonly join = (...paths: string[]) => window.desktop.FileSystem.join(...paths);

  readonly readDir = (path: string) => window.desktop.FileSystem.readDir(path);

  readonly readJson = <T>(path: string): Promise<ApiResponse<T>> => window.desktop.FileSystem.readJson(path);

  readonly writeJson = async <T>(path: string, data: T) => window.desktop.FileSystem.writeJson(path, data);

  readonly readGalleryLocation = async (path: string) => window.desktop.FileSystem.readGalleryLocation(path);

  readonly readDirectories = async (path: string) => window.desktop.FileSystem.readDirectories(path);

  readonly readImages = async (path: string) => window.desktop.FileSystem.readImages(path);
}
