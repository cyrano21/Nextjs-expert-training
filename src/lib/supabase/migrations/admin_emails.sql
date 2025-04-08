-- Migration pour créer une table des administrateurs autorisés

-- Création de la table admin_emails pour stocker les emails des administrateurs
CREATE TABLE IF NOT EXISTS admin_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un index sur l'email pour des recherches rapides
CREATE INDEX IF NOT EXISTS admin_emails_email_idx ON admin_emails(email);

-- Création d'une fonction pour vérifier si un email est un administrateur
CREATE OR REPLACE FUNCTION is_admin_email(email_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_emails WHERE email = email_to_check);
END;
$$ LANGUAGE plpgsql;

-- Création d'une politique RLS pour la table admin_emails
-- Seuls les administrateurs peuvent voir et modifier cette table
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_emails_policy ON admin_emails
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');