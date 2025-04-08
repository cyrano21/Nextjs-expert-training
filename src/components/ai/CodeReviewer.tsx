import React from 'react';

interface CodeSuggestion {
  line: number;
  originalCode: string;
  suggestedCode: string;
  explanation: string;
  severity: 'info' | 'warning' | 'error';
}

interface CodeReviewerProps {
  code: string;
  suggestions: CodeSuggestion[];
  onApplySuggestion?: (suggestion: CodeSuggestion) => void;
  onApplyAll?: () => void;
  onDismiss?: (suggestionIndex: number) => void;
}

export function CodeReviewer({
  code,
  suggestions,
  onApplySuggestion,
  onApplyAll,
  onDismiss
}: CodeReviewerProps) {
  
  const severityClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-300'
  };

  const severityIcons = {
    info: (
      <svg className="h-5 w-5 text-blue-400 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 text-amber-400 dark:text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">Revue de Code IA</h3>
        {suggestions.length > 0 && onApplyAll && (
          <button
            onClick={onApplyAll}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Appliquer tout
          </button>
        )}
      </div>
      
      <div className="p-4">
        {/* Affichage du code avec syntaxe highlighting */}
        <div className="mb-4 overflow-x-auto rounded-md bg-gray-50 p-4 dark:bg-gray-800">
          <pre className="text-sm">
            <code>{code}</code>
          </pre>
        </div>
        
        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <svg className="h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="mt-2 text-lg font-medium">Excellent travail!</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Aucune suggestion d&apos;amélioration pour ce code.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`rounded-md border p-4 ${severityClasses[suggestion.severity]}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {severityIcons[suggestion.severity]}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="mb-2 text-sm font-medium">
                      Ligne {suggestion.line}
                    </div>
                    <div className="mb-2 space-y-2 text-sm">
                      <div className="rounded-md bg-gray-800 p-2 font-mono text-xs text-gray-200">
                        <div className="text-red-400">- {suggestion.originalCode}</div>
                        <div className="text-green-400">+ {suggestion.suggestedCode}</div>
                      </div>
                      <p>{suggestion.explanation}</p>
                    </div>
                    <div className="flex space-x-2">
                      {onApplySuggestion && (
                        <button
                          onClick={() => onApplySuggestion(suggestion)}
                          className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                        >
                          Appliquer
                        </button>
                      )}
                      {onDismiss && (
                        <button
                          onClick={() => onDismiss(index)}
                          className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/90"
                        >
                          Ignorer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
