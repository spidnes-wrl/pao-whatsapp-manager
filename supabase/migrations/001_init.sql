-- Table pour les logs d'actions
CREATE TABLE IF NOT EXISTS action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type VARCHAR(50) NOT NULL,
  target_number VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  result_message TEXT,
  executor_ip VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table pour les sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_action_logs_created_at ON action_logs(created_at DESC);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Row Level Security
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Politique: Seul un administrateur peut lire les logs
CREATE POLICY "admin_read_logs" ON action_logs FOR SELECT USING (true);
CREATE POLICY "admin_insert_logs" ON action_logs FOR INSERT WITH CHECK (true);

-- Politique: Seul un administrateur peut gérer les sessions
CREATE POLICY "admin_read_sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "admin_insert_sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_update_sessions" ON sessions FOR UPDATE USING (true);
