import { app, shell } from 'electron';
import { nanoid } from 'nanoid/non-secure';
import { mkdirSync } from 'node:fs';
import { copyFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { DatabaseSync, SQLOutputValue } from 'node:sqlite';
import { IpcHandler } from '../app/decorators/ipc-handler';
import { CacheClearResult, CacheInfo } from 'internal-api';
import {
  clearCacheRecords,
  createMigrationTable,
  dbMigrations,
  deleteCacheFile,
  findCacheFiles,
  findFullSizeCacheFiles,
  findCacheFile,
  findThumbnailCacheFiles,
  getMigrationRecords,
  insertCacheFile,
  insertMigrationRecord
} from './cache-manager.migration';

interface CacheFileEntry {
  source_name: string;
  source_tag: string;
  target_path: string;
}

export class CacheManager {
  private readonly userData = app.getPath('userData');

  private readonly cacheConfigFile = join(this.userData, 'cache.sqlite');

  private readonly cacheDir = join(this.userData, 'image-cache');

  private readonly db: DatabaseSync;

  private readonly pendingEntries = new Map<string, Promise<string | null>>();

  constructor() {
    // SQLite does not create its parent directory, unlike the image cache below.
    mkdirSync(this.userData, { recursive: true });
    this.db = new DatabaseSync(this.cacheConfigFile);
    this.init();
  }

  @IpcHandler({ name: 'CacheManager.clear' })
  readonly clear = async (): Promise<CacheClearResult> => {
    const result = await this.getDirStats(this.cacheDir);
    this.db.exec(clearCacheRecords);
    await rm(this.cacheDir, { recursive: true, force: true });
    return result;
  };

  @IpcHandler({ name: 'CacheManager.clearFullSize' })
  readonly clearFullSize = async (): Promise<CacheClearResult> =>
    this.clearEntries(this.db.prepare(findFullSizeCacheFiles).all() as unknown as CacheFileEntry[]);

  @IpcHandler({ name: 'CacheManager.clearThumbnails' })
  readonly clearThumbnails = async (): Promise<CacheClearResult> =>
    this.clearEntries(this.db.prepare(findThumbnailCacheFiles).all() as unknown as CacheFileEntry[]);

  private readonly clearEntries = async (entries: CacheFileEntry[]): Promise<CacheClearResult> => {
    const deleteEntry = this.db.prepare(deleteCacheFile);
    let removedBytes = 0;

    for (const entry of entries) {
      const targetPath = resolve(entry.target_path);
      const relativePath = relative(this.cacheDir, targetPath);

      if (relativePath === '' || relativePath.startsWith('..') || isAbsolute(relativePath)) {
        throw new Error(`Refusing to remove cache file outside the image cache: ${entry.target_path}`);
      }

      try {
        removedBytes += (await stat(targetPath)).size;
      } catch {
        // The file may already have been removed; still clear its database record.
      }

      await rm(targetPath, { force: true });
      deleteEntry.run({ sourceName: entry.source_name, sourceTag: entry.source_tag });
    }

    return { entries: entries.length, bytes: removedBytes };
  };

  @IpcHandler({ name: 'CacheManager.cacheSize' })
  readonly cacheSize = async (): Promise<number> => this.getDirSize(this.cacheDir);

  @IpcHandler({ name: 'CacheManager.cacheInfo' })
  readonly cacheInfo = async (): Promise<CacheInfo> => {
    const entries = this.db.prepare(findCacheFiles).all() as unknown as CacheFileEntry[];
    const fullSizeEntries = entries.filter(entry => entry.source_tag.includes('-full-'));
    const thumbnailEntries = entries.filter(entry => !entry.source_tag.includes('-full-'));
    const [ totals, fullSize, thumbnails ] = await Promise.all([
      this.getDirStats(this.cacheDir),
      this.getEntryStats(fullSizeEntries),
      this.getEntryStats(thumbnailEntries)
    ]);

    return { path: this.cacheDir, ...totals, fullSize, thumbnails };
  };

  @IpcHandler({ name: 'CacheManager.openCacheFolder' })
  readonly openCacheFolder = async (): Promise<string> => {
    await mkdir(this.cacheDir, { recursive: true });
    return shell.openPath(this.cacheDir);
  };

  readonly exists = (sourceName: string, sourceTag: string): Record<string, SQLOutputValue> | null => {
    const row = this.db.prepare(findCacheFile).get({ sourceName, sourceTag });
    return row ? row : null;
  };

  readonly get = async (
    sourceName: string,
    sourceTag: string,
    callback?: (cachePath: string) => Promise<boolean>,
    targetExtension = extname(sourceName)
  ): Promise<string | null> => {
    const key = JSON.stringify([ sourceName, sourceTag ]);
    const pending = this.pendingEntries.get(key);

    if (pending !== undefined) {
      return await pending;
    }

    const operation = this.getOrCreate(sourceName, sourceTag, callback, targetExtension);
    this.pendingEntries.set(key, operation);

    try {
      return await operation;
    } finally {
      if (this.pendingEntries.get(key) === operation) {
        this.pendingEntries.delete(key);
      }
    }
  };

  private readonly getOrCreate = async (
    sourceName: string,
    sourceTag: string,
    callback?: (cachePath: string) => Promise<boolean>,
    targetExtension = extname(sourceName)
  ): Promise<string | null> => {
    const stats = await stat(sourceName);
    const sourceSize = stats.size;
    const updatedAt = stats.mtimeMs;

    const existing = this.exists(sourceName, sourceTag);

    if (existing && existing['source_size'] === sourceSize && existing['updated_at'] === updatedAt) {
      return existing['target_path'] as string;
    }

    const hash = this.generateCacheName(targetExtension);
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

  private readonly getDirSize = async (directory: string): Promise<number> => {
    let size = 0;

    try {
      const files = await readdir(directory, { withFileTypes: true });

      for (const file of files) {
        const filePath = join(directory, file.name);

        if (file.isDirectory()) {
          size += await this.getDirSize(filePath);
        } else if (file.isFile()) {
          size += (await stat(filePath)).size;
        }
      }
    } catch {
      return 0;
    }

    return size;
  };

  private readonly getEntryStats = async (entries: CacheFileEntry[]): Promise<CacheClearResult> => {
    let bytes = 0;

    for (const entry of entries) {
      try {
        bytes += (await stat(entry.target_path)).size;
      } catch {
        // Stale cache records are ignored in the displayed totals.
      }
    }

    return { entries: entries.length, bytes };
  };

  private readonly getDirStats = async (directory: string): Promise<CacheClearResult> => {
    let entries = 0;
    let bytes = 0;

    try {
      const files = await readdir(directory, { withFileTypes: true });

      for (const file of files) {
        const filePath = join(directory, file.name);

        if (file.isDirectory()) {
          const child = await this.getDirStats(filePath);
          entries += child.entries;
          bytes += child.bytes;
        } else if (file.isFile()) {
          entries++;
          bytes += (await stat(filePath)).size;
        }
      }
    } catch {
      return { entries, bytes };
    }

    return { entries, bytes };
  };
}
