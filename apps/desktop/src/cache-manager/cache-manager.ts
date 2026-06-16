import { app } from 'electron';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'path';
import {
  createMigrationTable,
  dbMigrations,
  getMigrationRecords,
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
}
