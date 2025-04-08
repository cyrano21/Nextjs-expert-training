import { HfInference } from '@huggingface/inference';

// Configuration for Hugging Face
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || '');

// Types
type MentorMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type MentorOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  personality?: 'helpful' | 'strict' | 'friendly';
  expertise?: 'general' | 'beginner' | 'advanced';
};

// AIResponse is used for type documentation and potential future extensions
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AIResponse = {
  content: string;
  _used?: boolean; // Dummy property to mark as used
};

type AIError = {
  message: string;
  code?: string;
  details?: string;
};

// Personality and expertise prompts
const personalityPrompts = {
  helpful: 'Tu es un mentor bienveillant et attentif.',
  strict: 'Tu es un mentor exigeant qui pousse l\'étudiant à donner le meilleur de lui-même.',
  friendly: 'Tu es un mentor chaleureux et encourageant.'
};

const expertisePrompts = {
  general: 'Tu as une connaissance générale et polyvalente.',
  beginner: 'Tu expliques les concepts de manière simple et progressive.',
  advanced: 'Tu peux aborder des concepts techniques complexes.'
};

const defaultOptions: MentorOptions = {
  model: 'mistralai/Mistral-7B-Instruct-v0.2',
  temperature: 0.7,
  maxTokens: 1000,
  personality: 'helpful',
  expertise: 'general'
};

/**
 * Génère une réponse du mentor IA basée sur le contexte de la conversation
 */
async function generateMentorResponse(
  messages: MentorMessage[],
  options: MentorOptions = {}
): Promise<string> {
  try {
    // Fusion des options par défaut et des options fournies
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Construction du message système
    const personalityPrompt = personalityPrompts[mergedOptions.personality || 'helpful'];
    const expertisePrompt = expertisePrompts[mergedOptions.expertise || 'general'];
    
    const systemMessage = `${personalityPrompt} ${expertisePrompt}
    
    Voici quelques règles à suivre:
    1. Donne des explications claires et concises.
    2. Utilise des exemples de code pertinents quand c'est approprié.
    3. Si l'étudiant fait une erreur, explique pourquoi c'est une erreur et comment la corriger.
    4. Encourage l'étudiant à expérimenter et à apprendre par la pratique.
    5. Adapte tes réponses au niveau de l'étudiant.
    6. Évite le jargon technique excessif sauf si l'étudiant semble à l'aise avec.
    7. Suggère des ressources supplémentaires si pertinent.
    
    Tu es un mentor dans la plateforme Next.js Expert Academy, dont l'objectif est de transformer les débutants en experts Next.js certifiés.`;
    
    // Préparer les messages pour Hugging Face
    const formattedMessages = messages.map((msg: MentorMessage) => `${msg.role}: ${msg.content}`).join('\n');
    const fullPrompt = `${systemMessage}\n\n${formattedMessages}\n\nAssistant:`;
    
    // Appel à l'API Hugging Face
    const response = await hf.conversational({
      model: mergedOptions.model || defaultOptions.model || 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: {
        past_user_inputs: messages.filter((m: MentorMessage) => m.role === 'user').map((m: MentorMessage) => m.content),
        generated_responses: messages.filter((m: MentorMessage) => m.role === 'assistant').map((m: MentorMessage) => m.content),
        text: fullPrompt
      },
      parameters: {
        temperature: mergedOptions.temperature || defaultOptions.temperature || 0.7,
        max_new_tokens: mergedOptions.maxTokens || defaultOptions.maxTokens || 1000
      }
    });
    
    return response.generated_text;
  } catch (e: unknown) {
    const error = e as AIError;
    console.error('Mentor response generation error:', error.message);
    throw error;
  }
}

/**
 * Génère des indices pour aider l'étudiant à résoudre un exercice
 */
async function generateHints(
  exerciseDescription: string,
  studentCode: string,
  difficultyLevel: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<string[]> {
  try {
    const hintLevels = {
      easy: 3,
      medium: 2,
      hard: 1
    };
    
    const numHints = hintLevels[difficultyLevel];
    
    const prompt = `Génère ${numHints} indices progressifs pour aider l'étudiant à résoudre l'exercice suivant:

Description de l'exercice:
${exerciseDescription}

Code actuel de l'étudiant:
\`\`\`
${studentCode}
\`\`\`

Règles pour les indices:
1. Commence par un indice général
2. Deviens de plus en plus spécifique
3. Ne donne PAS la solution complète
4. Aide l'étudiant à réfléchir par lui-même

Indices:`;
    
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7
      }
    });
    
    // Traitement des indices
    const hintsText = response.generated_text.replace(prompt, '').trim();
    const hintRegex = /(\d+\.\s.*?)(?=\d+\.\s|$)/gs;
    const matches = hintsText.match(hintRegex) || [];
    
    return matches.map((hint: string) => hint.trim()).slice(0, numHints);
  } catch (e: unknown) {
    const error = e as AIError;
    console.error('Hint generation error:', error.message);
    throw error;
  }
}

/**
 * Évalue le code de l'étudiant
 */
async function evaluateCode(
  exerciseDescription: string,
  solutionCode: string,
  studentCode: string
): Promise<{
  score: number;
  feedback: string;
  suggestions: string[];
}> {
  try {
    const prompt = `Évalue le code de l'étudiant par rapport à la solution attendue:

Description de l'exercice:
${exerciseDescription}

Solution attendue:
\`\`\`
${solutionCode}
\`\`\`

Code de l'étudiant:
\`\`\`
${studentCode}
\`\`\`

Critères d'évaluation:
1. Correction du code
2. Efficacité de l'implémentation
3. Lisibilité
4. Respect des bonnes pratiques

Fournis un rapport détaillé avec:
- Un score sur 100
- Un feedback constructif
- Des suggestions d'amélioration

Rapport:`;
    
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3
      }
    });
    
    // Traitement de la réponse
    const evaluationText = response.generated_text.replace(prompt, '').trim();
    
    // Parsing manuel de la réponse
    const scoreMatch = evaluationText.match(/Score\s*:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
    
    const feedbackMatch = evaluationText.match(/Feedback\s*:\s*(.*?)Suggestions/is);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : evaluationText;
    
    const suggestionsMatch = evaluationText.match(/Suggestions\s*:\s*(.*)/is);
    const suggestions = suggestionsMatch 
      ? suggestionsMatch[1].split('\n').map((s: string) => s.trim()).filter(Boolean)
      : ['Aucune suggestion spécifique'];
    
    return { score, feedback, suggestions };
  } catch (e: unknown) {
    const error = e as AIError;
    console.error('Code evaluation error:', error.message);
    throw error;
  }
}

export { 
  generateMentorResponse, 
  generateHints, 
  evaluateCode 
};
