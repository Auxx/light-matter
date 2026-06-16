import { app } from 'electron';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, stat } from 'node:fs/promises';
import { DatabaseSync, SQLOutputValue } from 'node:sqlite';
import { dirname, join } from 'path';
import {
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

  private readonly cacheDir = join(this.userData, 'cache');

  private readonly db = new DatabaseSync(this.cacheConfigFile);

  constructor() {
    this.init();
  }

  readonly exists = (sourceName: string): Record<string, SQLOutputValue> | null => {
    const row = this.db.prepare(findCacheFile).get({ sourceName });
    return row ? row : null;
  };

  readonly get = async (
    sourceName: string,
    callback?: (cachePath: string) => Promise<boolean>
  ): Promise<string | null> => {
    const stats = await stat(sourceName);
    const sourceSize = stats.size;
    const updatedAt = stats.mtimeMs;

    const existing = this.exists(sourceName);

    if (existing && existing['source_size'] === sourceSize && existing['updated_at'] === updatedAt) {
      return existing['target_path'] as string;
    }

    const hash = this.hashName(sourceName);
    const targetPath = this.getCacheItemPath(hash);

    if (callback) {
      const result = await callback(targetPath);
      return result ? this.addEntry(sourceName, sourceSize, updatedAt, targetPath) : null;
    }

    await mkdir(dirname(targetPath), { recursive: true });
    await copyFile(sourceName, targetPath);
    return this.addEntry(sourceName, sourceSize, updatedAt, targetPath);
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

  private readonly hashName = (name: string): string => createHash('sha512').update(name).digest('hex');

  private readonly getCacheItemPath = (hash: string): string =>
    join(this.cacheDir, hash[0], hash.substring(0, 2), hash);

  private readonly addEntry = (
    sourceName: string,
    sourceSize: number,
    updatedAt: number,
    targetPath: string
  ): string => {
    const ttl = Date.now();

    this.db.prepare(insertCacheFile).run({
      sourceName,
      sourceSize,
      updatedAt,
      targetPath,
      ttl
    });

    return targetPath;
  };
}
