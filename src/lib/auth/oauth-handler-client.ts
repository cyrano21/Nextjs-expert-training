'use client';

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Configuration de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Constante pour le nom du stockage local
export const CODE_VERIFIER_STORAGE_KEY = 'sb-code-verifier';

// Fonction pour générer une chaîne aléatoire
export function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const charsetLength = charset.length;
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charsetLength];
  }
  return result;
}

// Fonction pour configurer le flux OAuth côté client
export async function setupOAuthFlow(): Promise<string> {
  const codeVerifier = generateRandomString(64);
  
  // Stocker le code verifier dans le stockage local
  localStorage.setItem(CODE_VERIFIER_STORAGE_KEY, codeVerifier);
  
  return codeVerifier;
}

// Fonction pour récupérer le code verifier stocké
export function getStoredCodeVerifier(): string | null {
  return localStorage.getItem(CODE_VERIFIER_STORAGE_KEY);
}

// Fonction pour supprimer le code verifier stocké
export function removeStoredCodeVerifier(): void {
  localStorage.removeItem(CODE_VERIFIER_STORAGE_KEY);
}

// Fonction pour gérer le callback OAuth côté client
export async function handleOAuthCallback(
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Récupérer le code verifier du stockage local
    const codeVerifier = getStoredCodeVerifier();
    
    if (!codeVerifier) {
      console.error('Code verifier manquant dans le stockage local');
      return { 
        success: false, 
        error: 'Code verifier manquant' 
      };
    }

    // Créer un client Supabase
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    
    // Échanger le code contre une session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Erreur lors de l\'échange du code:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    // Supprimer le code verifier après utilisation
    removeStoredCodeVerifier();
    
    return { success: true };
  } catch (_) {
    console.error('Exception lors du traitement OAuth:', _);
    return { 
      success: false, 
      error: _ instanceof Error ? _.message : 'Erreur inconnue' 
    };
  }
}