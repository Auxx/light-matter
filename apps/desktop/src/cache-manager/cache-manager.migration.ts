export interface DBMigration {
  name: string;
  query: string;
}

export const createMigrationTable = `
CREATE TABLE IF NOT EXISTS migrations
(
    name TEXT NOT NULL
);
`;

export const getMigrationRecords = `SELECT * FROM migrations ORDER BY rowid`;

export const insertMigrationRecord = `INSERT INTO migrations (name) VALUES (:name)`;

export const dbMigrations: DBMigration[] = [
  {
    name: 'createCacheTableV1',
    query: `
CREATE TABLE IF NOT EXISTS cache_files
(
    file_name  TEXT PRIMARY KEY,
    file_size  INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    cache_path TEXT    NOT NULL,
    ttl        INTEGER NOT NULL
);
    `
  }
];
