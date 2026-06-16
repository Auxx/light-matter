export interface DBMigration {
  name: string;
  query: string;
}

// @formatter:off
export const createMigrationTable = `
CREATE TABLE IF NOT EXISTS migrations (
  name TEXT NOT NULL
);
`;

export const getMigrationRecords = `SELECT * FROM migrations ORDER BY rowid;`;

export const insertMigrationRecord = `INSERT INTO migrations (name) VALUES (:name);`;

export const insertCacheFile = `
INSERT INTO cache_files (
  source_name,
  source_size,
  updated_at,
  target_path,
  ttl
)
VALUES(
  :sourceName,
  :sourceSize,
  :updatedAt,
  :targetPath,
  :ttl
);
`;

export const findCacheFile = `
SELECT * FROM cache_files WHERE source_name = :sourceName AND source_tag = :sourceTag;
`;

export const dbMigrations: DBMigration[] = [
  {
    name: 'createCacheTableV1',
    query: `
CREATE TABLE IF NOT EXISTS cache_files (
  source_name TEXT NOT NULL,
  source_tag TEXT NOT NULL,
  source_size INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  target_path TEXT NOT NULL,
  ttl INTEGER NOT NULL
);

CREATE UNIQUE INDEX idx_cache_files_search ON cache_files (source_name, source_tag);
    `
  }
];
// @formatter:on
