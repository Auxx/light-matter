import { IpcMainInvokeEvent } from 'electron';
import { ApiResponse, FileInfo, supportedFileExtensions } from 'internal-api';
import { Dirent, statSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { IpcHandler } from '../app/decorators/ipc-handler';

export class FileSystem {
  @IpcHandler({ name: 'FileSystem.join' })
  readonly join = async (_: IpcMainInvokeEvent, ...paths: string[]): Promise<string> => join(...paths);

  @IpcHandler({ name: 'FileSystem.readDir' })
  readonly readDir = async (_: IpcMainInvokeEvent, path: string): Promise<FileInfo[]> => {
    const result = await readdir(path, { withFileTypes: true });

    return result.map(this.toFileInfo);
  };

  @IpcHandler({ name: 'FileSystem.readJson' })
  readonly readJson = async <T>(_: IpcMainInvokeEvent, path: string): Promise<ApiResponse<T>> => {
    try {
      const result = await readFile(path, 'utf-8');
      return { success: true, data: JSON.parse(result) };
    } catch (_) {
      return { success: false, errorMessage: `Failed to read file ${path}.` };
    }
  };

  @IpcHandler({ name: 'FileSystem.writeJson' })
  readonly writeJson = async <T>(_: IpcMainInvokeEvent, path: string, data: T): Promise<ApiResponse<undefined>> => {
    try {
      await writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true, data: undefined };
    } catch (_) {
      return { success: false, errorMessage: `Failed to write file ${path}.` };
    }
  };

  @IpcHandler({ name: 'FileSystem.readGalleryLocation' })
  readonly readGalleryLocation = async (_: IpcMainInvokeEvent, path: string): Promise<ApiResponse<FileInfo[]>> => {
    try {
      return { success: true, data: await this.readGalleryDir(path) };
    } catch (_) {
      return { success: false, errorMessage: `Failed to read gallery at ${path}.` };
    }
  };

  @IpcHandler({ name: 'FileSystem.readDirectories' })
  readonly readDirectories = async (_: IpcMainInvokeEvent, path: string): Promise<ApiResponse<FileInfo[]>> => {
    try {
      return {
        success: true,
        data: (await readdir(path, { withFileTypes: true }))
          .filter(file => file.isDirectory())
          .map(this.toFileInfo)
          .sort(this.sortByName)
      };
    } catch (_) {
      return { success: false, errorMessage: `Failed to read directory at ${path}.` };
    }
  };

  @IpcHandler({ name: 'FileSystem.readImages' })
  readonly readImages = async (_: IpcMainInvokeEvent, path: string): Promise<ApiResponse<FileInfo[]>> => {
    try {
      return {
        success: true,
        data: (await readdir(path, { withFileTypes: true }))
          .filter(file =>
            file.isFile() && supportedFileExtensions.includes(extname(file.name).toLowerCase().replace('.', ''))
          )
          .map(this.toFileInfo)
          .sort(this.softByCreatedDate)
      };
    } catch (_) {
      return { success: false, errorMessage: `Failed to read directory at ${path}.` };
    }
  };

  private readonly sortByName = (a: FileInfo, b: FileInfo): number => {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  };

  private readonly softByCreatedDate = (a: FileInfo, b: FileInfo): number => a.createdAt - b.createdAt;

  private readonly readGalleryDir = async (path: string): Promise<FileInfo[]> =>
    (await readdir(path, { withFileTypes: true }))
      .filter(file =>
        file.isDirectory()
        || supportedFileExtensions.includes(extname(file.name).toLowerCase().replace('.', ''))
      )
      .map(this.toFileInfo)
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) {
          return -1;
        }

        if (!a.isDirectory && b.isDirectory) {
          return 1;
        }

        return a.createdAt - b.createdAt;
      });

  // TODO Read image dimensions using https://github.com/photostructure/exiftool-vendored.js maybe?
  private readonly toFileInfo = (file: Dirent): FileInfo => {
    const path = join(file.parentPath, file.name);

    return {
      path,
      name: file.name,
      parent: file.parentPath,
      isDirectory: file.isDirectory(),
      ext: extname(file.name),
      createdAt: statSync(path).birthtimeMs
    };
  };
}
