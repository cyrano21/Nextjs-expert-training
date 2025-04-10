// src/services/ai/mentor.ts

const env = {
  HF_CODE_MODEL_ID: process.env.HF_CODE_MODEL_ID,
  HF_EXPLAIN_MODEL_ID: process.env.HF_EXPLAIN_MODEL_ID,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
};
 // For environment variable validation

/**
 * -----------------------------------------------------------------------------
 * AI Mentor Service (Hugging Face Edition)
 * -----------------------------------------------------------------------------
 * This service handles interactions with AI models hosted on the Hugging Face Hub
 * via their Inference API, using a free tier (or paid if configured).
 * It centralizes prompt engineering and API calls for AI interactions.
 *
 * NOTE: The free tier of the Inference API has rate limits and potential
 *       cold starts (first request might be slow). Model availability may vary.
 *       Feedback quality depends heavily on the chosen open-source model.
 *
 * Requires: HUGGINGFACE_API_KEY environment variable.
 * Optional: HF_CODE_MODEL_ENDPOINT, HF_EXPLAIN_MODEL_ENDPOINT env vars
 *           to specify models other than the defaults.
 * -----------------------------------------------------------------------------
 */

// --- Configuration ---

const DEFAULT_CODE_MODEL = "mistralai/Mistral-7B-Instruct-v0.2"; // Good general instruction model
const DEFAULT_EXPLAIN_MODEL = "mistralai/Mistral-7B-Instruct-v0.2"; // Can use the same or another

// Allow overriding models via environment variables
const CODE_MODEL_ID = env.HF_CODE_MODEL_ID || DEFAULT_CODE_MODEL;
const EXPLAIN_MODEL_ID = env.HF_EXPLAIN_MODEL_ID || DEFAULT_EXPLAIN_MODEL;

const HUGGINGFACE_API_BASE = "https://api-inference.huggingface.co/models/";

// --- Interfaces ---

export interface AiCodeFeedbackOptions {
  language: 'javascript' | 'typescript' | 'jsx' | 'tsx' | 'css' | 'html' | 'sql';
  context?: string;
  difficulty?: 'beginner' | 'intermediate' | 'expert';
  focusAreas?: ('correctness' | 'best_practices' | 'performance' | 'security' | 'style')[];
}

// --- Helper Function for API Calls ---

/**
 * Makes a POST request to the Hugging Face Inference API.
 * @param modelId The ID of the model on Hugging Face Hub (e.g., 'mistralai/Mistral-7B-Instruct-v0.1').
 * @param payload The data payload, typically { inputs: "prompt", parameters: {...} }.
 * @param retryCount Number of retries in case of model loading errors (503).
 * @returns The parsed JSON response from the API or null on failure.
 */
async function callHuggingFaceInference(
  modelId: string,
  payload: object,
  retryCount = 2 // Retry once on 503 (model loading)
): Promise<Record<string, unknown> | null> {
  if (!env.HUGGINGFACE_API_KEY) {
    console.warn(`Hugging Face API key not found. AI features disabled for model ${modelId}.`);
    return null;
  }

  const apiUrl = `${HUGGINGFACE_API_BASE}${modelId}`;
  // console.log(`Calling HF API: ${apiUrl}`); // DEBUG
  // console.log(`Payload:`, JSON.stringify(payload)); // DEBUG

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Handle Model Loading (503 Service Unavailable) with retries
    if (response.status === 503 && retryCount > 0) {
      const retryAfter = response.headers.get('Retry-After'); // Check for hint
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5000; // Wait 5s default
      console.log(`Model ${modelId} is loading (503), retrying in ${waitTime / 1000}s... (${retryCount} retries left)`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return callHuggingFaceInference(modelId, payload, retryCount - 1);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Hugging Face API Error (${modelId}): Status ${response.status}. Body: ${errorBody}`);
      // Specific handling for rate limits if needed (usually 429)
      if (response.status === 429) {
        console.warn(`Rate limit hit for model ${modelId}.`);
        // Consider returning a specific error object or message
      }
      return null;
    }

    const result = await response.json();
    // console.log(`HF Response (${modelId}):`, result); // DEBUG
    return result;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Hugging Face API Call Failed (${modelId}):`, error.message);
    } else {
      console.error(`Hugging Face API Call Failed (${modelId}):`, error);
    }
    return null;
  }
  
}

// --- Service Functions ---

/**
 * Requests feedback on a code snippet from the AI mentor using Hugging Face.
 * Quality depends heavily on the chosen `CODE_MODEL_ID`.
 *
 * @param codeSnippet The code string to be reviewed.
 * @param options Contextual options for the review (language, difficulty, etc.).
 * @returns A promise that resolves to the AI's feedback string, or null if an error occurs or API key is missing.
 */
export async function getAiCodeFeedback(
    codeSnippet: string,
    options: AiCodeFeedbackOptions
): Promise<string | null> {

  const { language, context, difficulty, focusAreas } = options;

  // --- Prompt Engineering (Adapted for Instruction Models like Mistral/Zephyr) ---
  // Instruction models often work best with clear roles and instructions.
  let prompt = `[INST] You are an expert ${language} developer and a helpful programming mentor specializing in React, Next.js, and Tailwind CSS. A student at the '${difficulty || 'intermediate'}' level needs feedback on their code.`;
  if (context) {
    prompt += ` Context: "${context}".`;
  }

  const defaultFocus: string[] = ['Correctness', 'Bugs', 'Best Practices', 'Readability', 'Improvements'];
  const requestedFocus = focusAreas ? focusAreas.map(f => f.replace('_', ' ')) : defaultFocus;
  prompt += ` Please analyze the following ${language} code snippet, focusing on: ${requestedFocus.join(', ')}.

\`\`\`${language}\n${codeSnippet}\n\`\`\`

Provide constructive feedback using Markdown. Start with encouragement, then suggest specific improvements with code examples (\`\`\`${language}...\`\`\`) where appropriate. Be clear and actionable. [/INST]\n`; // Using [/INST] signifies the end of the instruction for some models

  // --- API Call ---
  const payload = {
    inputs: prompt,
    parameters: {
      max_new_tokens: 600, // Max tokens the *model* should generate
      temperature: 0.5, // Lower temperature for more focused feedback
      return_full_text: false, // Important: Only return the generated part, not the prompt
      // top_p: 0.9, // Alternative to temperature
      // do_sample: true, // Use sampling if temp/top_p > 0/1
    }
  };

  const result = await callHuggingFaceInference(CODE_MODEL_ID, payload);

  // --- Response Parsing ---
  // The structure can vary slightly; inspect the actual response if needed.
  // Often it's an array, and the text is in `generated_text`.
  if (result && Array.isArray(result) && result[0]?.generated_text) {
    // console.log("HF Feedback received:", result[0].generated_text); // DEBUG
    return result[0].generated_text.trim();
  } else if (result && typeof result.error === 'string') {
    console.error(`HF Model Error (${CODE_MODEL_ID}): ${result.error}`);
    return null;
  } else {
    console.error(`getAiCodeFeedback: Unexpected response format from Hugging Face API (${CODE_MODEL_ID}). Result:`, result);
    return null;
  }
}

/**
 * Explains a concept using the AI mentor via Hugging Face.
 *
 * @param concept The concept to explain.
 * @param difficulty The target audience difficulty level.
 * @returns A promise resolving to the explanation string or null on error.
 */
export async function explainConcept(
    concept: string,
    difficulty: 'beginner' | 'intermediate' | 'expert' = 'intermediate'
): Promise<string | null> {

     const prompt = `[INST] You are an expert programming instructor. Explain the concept of "${concept}" clearly and concisely for a student at the '${difficulty}' level. Use Markdown formatting, simple language, and short code examples (\`\`\`js ... \`\`\`) or analogies if helpful. [/INST]\n`;

     const payload = {
         inputs: prompt,
         parameters: {
             max_new_tokens: 500,
             temperature: 0.6,
             return_full_text: false,
         }
     };

     const result = await callHuggingFaceInference(EXPLAIN_MODEL_ID, payload);

      if (result && Array.isArray(result) && result[0]?.generated_text) {
        // console.log("HF Explanation received:", result[0].generated_text); // DEBUG
        return result[0].generated_text.trim();
      } else if (result && typeof result.error === 'string') {
        console.error(`HF Model Error (${EXPLAIN_MODEL_ID}): ${result.error}`);
        return null;
      } else {
         console.error(`explainConcept: Unexpected response format from Hugging Face API (${EXPLAIN_MODEL_ID}). Result:`, result);
         return null;
     }
 }

// Add more functions as needed...
