CREATE TABLE IF NOT EXISTS content_reads (
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'trail', 'tutorial')),
  content_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  first_read_at TEXT NOT NULL,
  PRIMARY KEY (content_type, content_id, visitor_hash)
);

CREATE INDEX IF NOT EXISTS content_reads_content_idx
  ON content_reads(content_type, content_id);

CREATE TABLE IF NOT EXISTS content_likes (
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'trail', 'tutorial')),
  content_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (content_type, content_id, visitor_hash)
);

CREATE INDEX IF NOT EXISTS content_likes_content_idx
  ON content_likes(content_type, content_id);
