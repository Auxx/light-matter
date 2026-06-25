import { app } from 'electron';
import { nanoid } from 'nanoid/non-secure';
import { copyFile, mkdir, rm, stat } from 'node:fs/promises';
import { extname } from 'node:path';
import { DatabaseSync, SQLOutputValue } from 'node:sqlite';
import { dirname, join } from 'path';
import { IpcHandler } from '../app/decorators/ipc-handler';
import {
  clearCacheRecords,
  createMigrationTable,
  dbMigrations,
  findCacheFile,
  getMigrationRecords,
  insertCacheFile,
  insertMigrationRecord
} from './cache-manager.migration';

export class CacheManager {
  private readonly userData = app.getPath('userData');

  private readonly cacheConfigFile = join(this.userData, 'cache.sqlite');

  private readonly cacheDir = join(this.userData, 'image-cache');

  private readonly db = new DatabaseSync(this.cacheConfigFile);

  constructor() {
    this.init();
  }

  @IpcHandler({ name: 'CacheManager.clear' })
  readonly clear = async () => {
    this.db.exec(clearCacheRecords);
    await rm(this.cacheDir, { recursive: true });
  };

  readonly exists = (sourceName: string, sourceTag: string): Record<string, SQLOutputValue> | null => {
    const row = this.db.prepare(findCacheFile).get({ sourceName, sourceTag });
    return row ? row : null;
  };

  readonly get = async (
    sourceName: string,
    sourceTag: string,
    callback?: (cachePath: string) => Promise<boolean>
  ): Promise<string | null> => {
    const stats = await stat(sourceName);
    const sourceSize = stats.size;
    const updatedAt = stats.mtimeMs;

    const existing = this.exists(sourceName, sourceTag);

    if (existing && existing['source_size'] === sourceSize && existing['updated_at'] === updatedAt) {
      return existing['target_path'] as string;
    }

    const hash = this.generateCacheName(extname(sourceName));
    const targetPath = this.getCacheItemPath(hash);

    await mkdir(dirname(targetPath), { recursive: true });

    if (callback) {
      const result = await callback(targetPath);
      return result
        ? this.addEntry(sourceName, sourceTag, sourceSize, updatedAt, targetPath)
        : null;
    }

    await mkdir(dirname(targetPath), { recursive: true });
    await copyFile(sourceName, targetPath);

    return this.addEntry(sourceName, sourceTag, sourceSize, updatedAt, targetPath);
  };

  private readonly init = () => {
    this.db.exec(createMigrationTable);
    const migrations = this.db.prepare(getMigrationRecords).all();
    const insert = this.db.prepare(insertMigrationRecord);

    dbMigrations.forEach(migration => {
      const found = migrations.find(m => m['name'] === migration.name);

      if (found === undefined) {
        this.db.exec(migration.query);
        insert.get({ name: migration.name });
      }
    });
  };

  private readonly generateCacheName = (ext: string): string => `${nanoid(32)}${ext}`;

  private readonly getCacheItemPath = (hash: string): string =>
    join(this.cacheDir, hash[0], hash.substring(0, 2), hash);

  private readonly addEntry = (
    sourceName: string,
    sourceTag: string,
    sourceSize: number,
    updatedAt: number,
    targetPath: string
  ): string => {
    const ttl = Date.now();

    this.db.prepare(insertCacheFile).run({
      sourceName,
      sourceTag,
      sourceSize,
      updatedAt,
      targetPath,
      ttl
    });

    return targetPath;
  };
}
