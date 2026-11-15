CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('topic', 'review', 'sources')),
  title TEXT NOT NULL,
  field TEXT NOT NULL,
  article_id TEXT,
  reason TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'accepted', 'rejected'))
);

CREATE INDEX IF NOT EXISTS submissions_status_created_idx
  ON submissions(status, created_at);

CREATE TABLE IF NOT EXISTS submission_daily_quotas (
  client_hash TEXT NOT NULL,
  day_utc TEXT NOT NULL,
  submission_count INTEGER NOT NULL CHECK (submission_count >= 0),
  PRIMARY KEY (client_hash, day_utc)
);

CREATE TABLE IF NOT EXISTS api_request_limits (
  client_hash TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('research', 'links', 'submissions')),
  window_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count >= 1),
  PRIMARY KEY (client_hash, category, window_start)
);

CREATE INDEX IF NOT EXISTS api_request_limits_window_idx
  ON api_request_limits(window_start);
