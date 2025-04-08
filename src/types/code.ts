export interface CodeSuggestion {
  type: 'improvement' | 'warning' | 'style' | string;
  message: string;
  line: number;
}
