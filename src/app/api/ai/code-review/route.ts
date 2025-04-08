import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import { Database } from '@/types/deprecated.database.types';
import { CodeSuggestion } from '@/types/code';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const { code, language, exerciseId } = await request.json();

    // Vérifier l'authentification
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Corriger l'insertion dans code_submissions - s'assurer que les champs correspondent à la définition
    const { error: submissionError } = await supabase
      .from('code_submissions')
      .insert({
        user_id: userId,
        code: code,
        language: language,
        exercise_id: exerciseId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (submissionError) {
      return NextResponse.json({ error: submissionError.message }, { status: 500 });
    }

    // Simuler une analyse de code (dans un environnement réel, cela appellerait un service d'IA)
    const codeReview = analyzeCode(code, language);

    // Supposons que ces variables sont définies quelque part dans votre logique
    const feedback = codeReview.feedback;
    const score = codeReview.score;
    const suggestions: CodeSuggestion[] = codeReview.suggestions;

    // Corriger l'insertion dans code_reviews
    const { error: reviewError } = await supabase
      .from('code_reviews')
      .insert({
        user_id: userId,
        exercise_id: exerciseId,
        feedback: feedback,
        score: score,
        suggestions: suggestions,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (reviewError) {
      return NextResponse.json({ error: reviewError.message }, { status: 500 });
    }

    return NextResponse.json({
      feedback,
      score,
      suggestions
    });
  } catch (error) {
    console.error('Error in code review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Fonction de simulation pour analyser le code
function analyzeCode(code: string, language: string) {
  const codeLength = code.length;
  const lines = code.split('\n').length;

  const hasComments = code.includes('//') || code.includes('/*');
  const hasConsoleLog = code.toLowerCase().includes('console.log');
  const hasFunctions = code.includes('function') || code.includes('=>');

  let score = 70;
  if (hasComments) score += 10;
  if (!hasConsoleLog) score += 5;
  if (hasFunctions) score += 15;

  score = Math.min(score, 100);

  const suggestions: CodeSuggestion[] = [];

  if (!hasComments) {
    suggestions.push({
      type: 'improvement',
      message: 'Ajoutez des commentaires pour expliquer la logique de votre code.',
      line: 1
    });
  }

  if (hasConsoleLog) {
    suggestions.push({
      type: 'warning',
      message: 'Évitez de laisser des console.log dans votre code de production.',
      line: code.toLowerCase().indexOf('console.log')
    });
  }

  if (lines < 5 && codeLength > 100) {
    suggestions.push({
      type: 'style',
      message: 'Considérez diviser votre code en lignes plus courtes pour améliorer la lisibilité.',
      line: 1
    });
  }

  let feedback = '';
  if (score >= 90) {
    feedback = 'Excellent travail ! Votre code est bien structuré et suit les bonnes pratiques.';
  } else if (score >= 70) {
    feedback = 'Bon travail ! Votre code fonctionne bien, mais il y a quelques points à améliorer.';
  } else {
    feedback = 'Votre code a besoin d\'améliorations. Consultez les suggestions pour le rendre plus robuste.';
  }

  return {
    score,
    feedback,
    suggestions,
    improvedCode: generateImprovedCode(code, language, suggestions),
    timestamp: new Date().toISOString()
  };
}

// Fonction pour générer une version améliorée du code
function generateImprovedCode(code: string, language: string, suggestions: CodeSuggestion[]) {
  let improvedCode = code;

  if (suggestions.some(s => s.message.includes('commentaires'))) {
    improvedCode = `// Ce code a été amélioré par le service de revue de code\n${improvedCode}`;
  }

  if (suggestions.some(s => s.message.includes('console.log'))) {
    improvedCode = improvedCode.replace(/console\.log\([^)]*\);?/g, '// console.log supprimé');
  }

  return improvedCode;
}
