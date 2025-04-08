interface Suggestion {
  line: number;
  message: string;
  severity: 'info' | 'warning' | 'error';
  suggestion?: string;
}

interface CodeReviewResponse {
  feedback: string;
  suggestions: Suggestion[];
  overallScore: number;
  performanceAnalysis?: string;
  bestPractices?: string[];
}

export async function getCodeReview({
  code,
  language
}: { code: string; language: string }): Promise<CodeReviewResponse> {

  try {
    // Exemple d’appel Supabase (désactivé ici)
    // const supabase = getClientInstance();
    // const { data, error } = await supabase.functions.invoke('code-review', {
    //   body: { code, language, context }
    // });
    // if (error) throw new Error(error.message);
    // return data;

    return simulateCodeReview(code, language);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'analyse de code:", error);
    throw error;
  }
}

// ✅ Fonction simulée avec typage strict
function simulateCodeReview(code: string, language: string): CodeReviewResponse {
  const lines = code.split('\n');
  const suggestions: Suggestion[] = [];

  if (language === 'javascript' || language === 'typescript') {
    lines.forEach((line, index) => {
      if (line.includes('console.log')) {
        suggestions.push({
          line: index + 1,
          message: 'Évitez de laisser des console.log dans le code de production',
          severity: 'warning',
          suggestion: 'Remplacez par un système de logging approprié ou supprimez'
        });
      }

      const match = line.match(/const (\w+)/);
      if (match) {
        const variableName = match[1];
        const restOfCode = lines.slice(index + 1).join('\n');
        if (!restOfCode.includes(variableName)) {
          suggestions.push({
            line: index + 1,
            message: 'Variable potentiellement non utilisée',
            severity: 'info',
            suggestion: 'Vérifiez si cette variable est nécessaire'
          });
        }
      }
    });
  }

  const overallScore = Math.max(0, Math.min(10, 10 - suggestions.length * 0.5));

  return {
    feedback: generateFeedback(suggestions, overallScore),
    suggestions,
    overallScore,
    performanceAnalysis: 'Aucun problème de performance majeur détecté.',
    bestPractices: [
      'Utilisez des noms de variables descriptifs',
      'Commentez les sections complexes du code',
      "Suivez le principe DRY (Don't Repeat Yourself)",
      'Utilisez la décomposition pour simplifier les fonctions complexes'
    ]
  };
}

// ✅ Typage corrigé ici aussi
function generateFeedback(suggestions: Suggestion[], score: number): string {
  if (score >= 9) {
    return 'Excellent travail ! Votre code est bien structuré et suit les bonnes pratiques.';
  } else if (score >= 7) {
    return 'Bon travail ! Quelques améliorations mineures pourraient être apportées.';
  } else if (score >= 5) {
    return 'Votre code fonctionne mais pourrait bénéficier de plusieurs améliorations.';
  } else {
    return 'Votre code nécessite des révisions importantes pour suivre les bonnes pratiques.';
  }
}
