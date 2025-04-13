"use client";

import { useState, useEffect, useCallback } from 'react';
import { handleError, AppError, ErrorType } from '@/lib/error/errorHandler';

interface FetchOptions extends RequestInit {
  retry?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour gérer le chargement des données avec une meilleure gestion des erreurs
 * et le support pour les retries automatiques
 * 
 * @param url URL à récupérer
 * @param options Options de fetch et de retry
 * @param dependencies Dépendances pour déclencher le refetch
 */
export function useFetchData<T>(
  url: string | null,
  options: FetchOptions = {},
  dependencies: unknown[] = []
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: url !== null,
    error: null,
    refetch: async () => {},
  });

  const {
    retry = true,
    retryCount = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  const fetchData = useCallback(async () => {
    // Ne rien faire si l'URL est null
    if (url === null) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    let attempts = 0;
    let lastError: unknown = null;

    while (attempts < (retry ? retryCount : 1)) {
      try {
        // Attendre avant la tentative suivante (sauf pour la première)
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          throw response;
        }

        const data = await response.json();
        setState({ data, loading: false, error: null, refetch: fetchData });
        return;
      } catch (error) {
        lastError = error;
        attempts++;

        // Si c'est une erreur qui ne permet pas de retry, on arrête immédiatement
        const appError = handleError(error);
        if (
          appError.type === ErrorType.AUTHENTICATION ||
          appError.type === ErrorType.AUTHORIZATION ||
          (appError.retry === false)
        ) {
          break;
        }
      }
    }

    // Si on arrive ici, toutes les tentatives ont échoué
    const finalError = handleError(lastError);
    setState({ data: null, loading: false, error: finalError, refetch: fetchData });
  }, [url, retry, retryCount, retryDelay, fetchOptions]);

  // Créer une dépendance qui change lorsque l'une des dépendances externes change
  const dependenciesKey = JSON.stringify(dependencies);

  // Effet pour déclencher le fetchData initialement et quand les dépendances changent
  useEffect(() => {
    fetchData();
  }, [fetchData, dependenciesKey]);

  return state;
}

/**
 * Version du hook avec support pour le mode hors ligne
 */
export function useFetchDataWithOfflineSupport<T>(
  url: string | null,
  options: FetchOptions = {},
  offlineData: T | null = null,
  dependencies: unknown[] = []
): FetchState<T> {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Surveiller le statut de la connexion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Utiliser le hook de base
  const fetchState = useFetchData<T>(
    isOnline ? url : null, // Ne pas essayer de fetch si hors ligne
    options,
    dependencies
  );

  // Si hors ligne, utiliser les données locales
  if (!isOnline) {
    return {
      data: offlineData,
      loading: false,
      error: isOnline ? fetchState.error : {
        type: ErrorType.NETWORK,
        message: 'Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.',
        retry: true,
      },
      refetch: fetchState.refetch,
    };
  }

  return fetchState;
}