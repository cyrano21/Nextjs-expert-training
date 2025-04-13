/**
 * Service de mise en cache pour le support du mode hors ligne
 */

// Préfixe pour toutes les clés de cache pour éviter les collisions
const CACHE_PREFIX = 'expert-academy-cache-';

// Durée de validité du cache par défaut (7 jours)
const DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000;

// Interface pour les entrées de cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Vérifie si l'API localStorage est disponible
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Met en cache des données avec une durée de vie (TTL)
 */
export function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    const cacheKey = CACHE_PREFIX + key;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(entry));
    return true;
  } catch (e) {
    console.warn('Erreur lors de la mise en cache:', e);
    return false;
  }
}

/**
 * Récupère des données du cache si elles sont toujours valides
 */
export function getCache<T>(key: string): T | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const cacheKey = CACHE_PREFIX + key;
    const item = localStorage.getItem(cacheKey);
    
    if (!item) return null;
    
    const entry: CacheEntry<T> = JSON.parse(item);
    const now = Date.now();
    
    // Vérifier si le cache est toujours valide
    if (now - entry.timestamp > entry.ttl) {
      // Cache expiré, le supprimer
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return entry.data;
  } catch (e) {
    console.warn('Erreur lors de la récupération du cache:', e);
    return null;
  }
}

/**
 * Supprime une entrée spécifique du cache
 */
export function removeCache(key: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    const cacheKey = CACHE_PREFIX + key;
    localStorage.removeItem(cacheKey);
    return true;
  } catch (e) {
    console.warn('Erreur lors de la suppression du cache:', e);
    return false;
  }
}

/**
 * Vide tout le cache de l'application
 */
export function clearCache(): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    // Ne supprime que les entrées avec notre préfixe
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (e) {
    console.warn('Erreur lors du nettoyage du cache:', e);
    return false;
  }
}

/**
 * Nettoie les entrées expirées du cache
 */
export function cleanExpiredCache(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const now = Date.now();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const entry = JSON.parse(localStorage.getItem(key) || '{}');
          if (entry.timestamp && entry.ttl && now - entry.timestamp > entry.ttl) {
            localStorage.removeItem(key);
          }
        } catch {
          // Ignorer les erreurs pour les entrées individuelles
        }
      }
    });
  } catch (e) {
    console.warn('Erreur lors du nettoyage des caches expirés:', e);
  }
}

/**
 * Fonction automatique de nettoyage du cache
 * À appeler lors du chargement de l'application
 */
export function initializeCache(): void {
  // Nettoyer les caches expirés au démarrage
  cleanExpiredCache();
  
  // Optionnel : configurer un nettoyage périodique
  if (typeof window !== 'undefined') {
    // Nettoyer toutes les 24 heures
    setInterval(cleanExpiredCache, 24 * 60 * 60 * 1000);
  }
}