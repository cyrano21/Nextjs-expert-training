declare module '@huggingface/inference' {
  export interface TextGenerationParams {
    model: string;
    inputs: string;
    parameters?: {
      max_new_tokens?: number;
      temperature?: number;
    };
  }

  export interface ConversationalInputs {
    past_user_inputs: string[];
    generated_responses: string[];
    text: string;
  }

  export interface ConversationalParams {
    model: string;
    inputs: ConversationalInputs;
    parameters?: {
      temperature?: number;
      max_new_tokens?: number;
    };
  }

  export interface TextGenerationResponse {
    generated_text: string;
  }

  export interface ConversationalResponse {
    generated_text: string;
  }

  export class HfInference {
    constructor(apiKey?: string);
    
    textGeneration(params: TextGenerationParams): Promise<TextGenerationResponse>;
    conversational(params: ConversationalParams): Promise<ConversationalResponse>;
  }

  export default HfInference;
}
