import { app } from 'electron';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'path';
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

  readonly exists = (sourceName: string): string | null => {
    const row = this.db.prepare(findCacheFile).get({ sourceName });
    return row ? row['target_path'] as string : null;
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

  private readonly addEntry = (name: string, size: number, updatedAt: number): string => {
    const hash = this.hashName(name);
    const path = this.getCacheItemPath(hash);
    const ttl = Date.now();

    this.db.prepare(insertCacheFile).run({
      sourceName: name,
      sourceSize: size,
      updatedAt,
      targetPath: path,
      ttl
    });

    return path;
  };
}
