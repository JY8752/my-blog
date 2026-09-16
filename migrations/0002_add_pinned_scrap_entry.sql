ALTER TABLE scrap_entries
ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0 CHECK (is_pinned IN (0, 1));

CREATE UNIQUE INDEX idx_scrap_entries_one_pinned
ON scrap_entries(scrap_id)
WHERE is_pinned = 1;
