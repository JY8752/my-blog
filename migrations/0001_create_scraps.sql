CREATE TABLE scraps (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE scrap_entries (
  id TEXT PRIMARY KEY NOT NULL,
  scrap_id TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position > 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (scrap_id) REFERENCES scraps(id) ON DELETE CASCADE,
  UNIQUE (scrap_id, position)
);

CREATE INDEX idx_scraps_updated_at ON scraps(updated_at DESC);
CREATE INDEX idx_scrap_entries_scrap_position ON scrap_entries(scrap_id, position);
