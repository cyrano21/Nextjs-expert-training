-- Migration pour initialiser le schéma de la base de données

-- Création de la table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un index sur l'email pour des recherches rapides
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Création de la table des statistiques de progression
CREATE TABLE IF NOT EXISTS progress_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lessons_completed INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un index sur l'ID utilisateur
CREATE INDEX IF NOT EXISTS progress_stats_user_id_idx ON progress_stats(user_id);

-- Création de la table des modules complétés
CREATE TABLE IF NOT EXISTS completed_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Création de la table des leçons complétées
CREATE TABLE IF NOT EXISTS completed_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id, lesson_id)
);

-- Politiques de sécurité RLS (Row Level Security)

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_lessons ENABLE ROW LEVEL SECURITY;

-- Politique pour profiles: les utilisateurs peuvent voir leur propre profil
CREATE POLICY profiles_select_policy ON profiles 
  FOR SELECT USING (auth.uid() = id);

-- Les enseignants et admins peuvent voir tous les profils
CREATE POLICY profiles_select_admin_policy ON profiles 
  FOR SELECT USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('teacher', 'admin'));

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY profiles_update_policy ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Les admins peuvent modifier tous les profils
CREATE POLICY profiles_update_admin_policy ON profiles 
  FOR UPDATE USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Politique pour progress_stats: les utilisateurs peuvent voir leurs propres stats
CREATE POLICY progress_stats_select_policy ON progress_stats 
  FOR SELECT USING (auth.uid() = user_id);

-- Les enseignants et admins peuvent voir toutes les stats
CREATE POLICY progress_stats_select_admin_policy ON progress_stats 
  FOR SELECT USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('teacher', 'admin'));