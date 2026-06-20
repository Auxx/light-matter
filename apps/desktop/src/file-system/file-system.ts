import { IpcMainInvokeEvent } from 'electron';
import { ApiResponse, FileInfo, SortDirection, SortType, supportedFileExtensions } from 'internal-api';
import { Dirent, statSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { IpcHandler } from '../app/decorators/ipc-handler';

export class FileSystem {
  @IpcHandler({ name: 'FileSystem.join' })
  readonly join = async (_: IpcMainInvokeEvent, ...paths: string[]): Promise<string> => join(...paths);

  @IpcHandler({ name: 'FileSystem.dirname' })
  readonly dirname = async (_: IpcMainInvokeEvent, fileName: string): Promise<string> => dirname(fileName);

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
          .sort(this.sortByNameAsc)
      };
    } catch (_) {
      return { success: false, errorMessage: `Failed to read directory at ${path}.` };
    }
  };

  @IpcHandler({ name: 'FileSystem.readImages' })
  readonly readImages = async (
    _: IpcMainInvokeEvent,
    path: string,
    sortBy: SortType,
    sortDir: SortDirection
  ): Promise<ApiResponse<FileInfo[]>> => {
    try {
      return {
        success: true,
        data: (await readdir(path, { withFileTypes: true }))
          .filter(file =>
            file.isFile() && supportedFileExtensions.includes(extname(file.name).toLowerCase().replace('.', ''))
          )
          .map(this.toFileInfo)
          .sort(this.sortFiles(sortBy, sortDir))
      };
    } catch (_) {
      return { success: false, errorMessage: `Failed to read directory at ${path}.` };
    }
  };

  private readonly sortFiles = (sortBy: SortType, sortDir: SortDirection) => {
    switch (sortBy) {
      case 'date':
        return sortDir === 'asc' ? this.sortByCreatedDateAsc : this.sortByCreatedDateDesc;
      case 'size':
        return sortDir === 'asc' ? this.sortBySizeAsc : this.sortBySizeDesc;
      case 'name':
        return sortDir === 'asc' ? this.sortByNameAsc : this.sortByNameDesc;
    }
  };

  private readonly sortByNameAsc = (a: FileInfo, b: FileInfo): number => {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  };

  private readonly sortByNameDesc = (a: FileInfo, b: FileInfo): number => {
    if (b.name < a.name) {
      return -1;
    }

    if (b.name > a.name) {
      return 1;
    }

    return 0;
  };

  private readonly sortByCreatedDateAsc = (a: FileInfo, b: FileInfo): number => a.createdAt - b.createdAt;

  private readonly sortByCreatedDateDesc = (a: FileInfo, b: FileInfo): number => b.createdAt - a.createdAt;

  private readonly sortBySizeAsc = (a: FileInfo, b: FileInfo): number => a.size - b.size;

  private readonly sortBySizeDesc = (a: FileInfo, b: FileInfo): number => b.size - a.size;

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

  private readonly toFileInfo = (file: Dirent): FileInfo => {
    const path = join(file.parentPath, file.name);

    return {
      path,
      name: file.name,
      parent: file.parentPath,
      isDirectory: file.isDirectory(),
      ext: extname(file.name),
      createdAt: statSync(path).birthtimeMs,
      size: statSync(path).size
    };
  };
}
