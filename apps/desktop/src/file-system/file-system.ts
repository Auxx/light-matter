import { IpcMainInvokeEvent } from 'electron';
import { FileInfo } from 'internal-api';
import { readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { IpcHandler } from '../app/decorators/ipc-handler';

export class FileSystem {
  @IpcHandler({ name: 'FileSystem.join' })
  readonly join = async (_: IpcMainInvokeEvent, ...paths: string[]): Promise<string> => join(...paths);

  @IpcHandler({ name: 'FileSystem.readDir' })
  readonly readDir = async (_: IpcMainInvokeEvent, path: string): Promise<FileInfo[]> => {
    const result = await readdir(path, { withFileTypes: true });

    return result.map(file => ({
      path: join(file.parentPath, file.name),
      name: file.name,
      parent: file.parentPath,
      isDirectory: file.isDirectory(),
      ext: extname(file.name)
    }));
  };
}
