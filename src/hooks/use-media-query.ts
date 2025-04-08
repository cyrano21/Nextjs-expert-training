import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter si une requête média correspond
 * @param query La requête média à vérifier (ex: '(prefers-reduced-motion: reduce)')
 * @returns boolean indiquant si la requête média correspond
 */
export function useMediaQuery(query: string): boolean {
  // Valeur par défaut pour le SSR
  const getMatches = (query: string): boolean => {
    // Vérifier si window est défini (côté client)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    // Fonction pour mettre à jour l'état
    const handleChange = () => {
      setMatches(getMatches(query));
    };

    // Vérifier si window est défini (côté client)
    if (typeof window !== 'undefined') {
      const matchMedia = window.matchMedia(query);
      
      // Utiliser addEventListener avec MediaQueryList
      if (matchMedia.addEventListener) {
        matchMedia.addEventListener('change', handleChange);
        return () => {
          matchMedia.removeEventListener('change', handleChange);
        };
      } else {
        // Fallback pour les navigateurs plus anciens
        matchMedia.addListener(handleChange);
return () => {
  matchMedia.removeListener(handleChange);
};
      }
    }
    
    // Nettoyage vide pour le SSR
    return () => {};
  }, [query]);

  return matches;
}
