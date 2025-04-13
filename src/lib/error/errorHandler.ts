/**
 * Utilitaire de gestion d'erreurs pour les requêtes API
 */

// Types d'erreurs possibles
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

// Interface pour les erreurs standardisées
export interface AppError {
  type: ErrorType;
  message: string;
  code?: number;
  details?: unknown;
  retry?: boolean;
}

/**
 * Convertit une erreur quelconque en AppError standardisée
 */
export function handleError(error: unknown): AppError {
  // Si l'erreur est déjà une AppError, on la retourne directement
  if (typeof error === 'object' && error !== null && 'type' in error) {
    return error as AppError;
  }

  // Erreurs réseau (pas de connexion)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Problème de connexion. Veuillez vérifier votre connexion internet.',
      retry: true
    };
  }

  // Erreurs HTTP
  if (error instanceof Response || (typeof error === 'object' && error !== null && 'status' in error)) {
    const status = 'status' in error ? Number(error.status) : 0;
    
    if (status === 401) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: 'Veuillez vous reconnecter pour continuer.',
        code: status
      };
    }
    
    if (status === 403) {
      return {
        type: ErrorType.AUTHORIZATION,
        message: 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.',
        code: status
      };
    }
    
    if (status === 404) {
      return {
        type: ErrorType.NOT_FOUND,
        message: 'La ressource demandée n\'existe pas.',
        code: status
      };
    }
    
    if (status >= 400 && status < 500) {
      return {
        type: ErrorType.VALIDATION,
        message: 'Les données envoyées sont invalides.',
        code: status,
        details: error
      };
    }
    
    if (status >= 500) {
      return {
        type: ErrorType.SERVER,
        message: 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.',
        code: status,
        retry: true
      };
    }
  }

  // Erreurs JavaScript standard
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || 'Une erreur inattendue s\'est produite.',
      details: {
        name: error.name,
        stack: error.stack
      }
    };
  }

  // Fallback pour tout autre type d'erreur
  return {
    type: ErrorType.UNKNOWN,
    message: String(error) || 'Une erreur inattendue s\'est produite.',
    details: error
  };
}

/**
 * Hook d'erreur pour afficher des messages d'erreur cohérents
 */
export function getErrorMessage(error: unknown): string {
  const appError = handleError(error);
  return appError.message;
}

/**
 * Vérifie si une erreur permet une nouvelle tentative
 */
export function canRetry(error: unknown): boolean {
  const appError = handleError(error);
  return !!appError.retry;
}

/**
 * Enregistre l'erreur dans un système de monitoring
 * (À connecter à un service comme Sentry, LogRocket, etc.)
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const appError = handleError(error);
  
  // Log l'erreur dans la console en développement
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error]', {
      error: appError,
      context
    });
  }
  
  // Ici, on pourrait envoyer l'erreur à un service de monitoring
  // Par exemple: Sentry.captureException(appError, { extra: context });
}