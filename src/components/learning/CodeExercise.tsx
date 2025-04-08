import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MonacoEditor } from '@/components/editor/MonacoEditor';
import { CodeBlock } from '@/components/ui/code-block';
import { CheckCircle, XCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TestCase {
  id: string;
  description: string;
  expectedOutput: string;
  testFunction: (code: string) => Promise<{ passed: boolean; output: string; error?: string }>;
}

interface CodeExerciseProps {
  title: string;
  description: string;
  instructions: string;
  initialCode: string;
  language: string;
  testCases: TestCase[];
  hints: string[];
  solution: string;
  onComplete: (passed: boolean) => void;
  className?: string;
}

export function CodeExercise({
  title,
  description,
  instructions,
  initialCode,
  language,
  testCases,
  hints,
  solution,
  onComplete,
  className
}: CodeExerciseProps) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    id: string;
    passed: boolean;
    output: string;
    error?: string;
  }> | null>(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  // Réinitialiser les résultats des tests lorsque le code change
  useEffect(() => {
    if (testResults) {
      setTestResults(null);
    }
  }, [code, testResults]);

  // Vérifier si tous les tests sont passés
  useEffect(() => {
    if (testResults && testResults.every(result => result.passed)) {
      setAllTestsPassed(true);
      onComplete(true);
    } else {
      setAllTestsPassed(false);
    }
  }, [testResults, onComplete]);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults(null);

    try {
      // Exécuter tous les tests
      const results = await Promise.all(
        testCases.map(async (testCase) => {
          try {
            const result = await testCase.testFunction(code);
            return {
              id: testCase.id,
              ...result
            };
          } catch (error) {
            return {
              id: testCase.id,
              passed: false,
              output: '',
              error: error instanceof Error ? error.message : 'Une erreur est survenue'
            };
          }
        })
      );

      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors de l\'exécution des tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setTestResults(null);
    setShowSolution(false);
    setCurrentHintIndex(-1);
  };

  const showNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 text-lg font-medium">Instructions</h3>
          <div className="prose-custom dark:text-white text-sm">
            <p>{instructions}</p>
          </div>
        </div>

        {/* Éditeur de code */}
        <div className="rounded-lg border">
          <div className="flex items-center justify-between border-b bg-muted/50 p-2">
            <h3 className="text-sm font-medium">Votre code</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetCode}
                title="Réinitialiser le code"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={showNextHint}
                disabled={currentHintIndex >= hints.length - 1}
                title="Obtenir un indice"
              >
                <Lightbulb className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="h-[300px]">
            <MonacoEditor
              value={code}
              onChange={setCode}
              defaultLanguage={language}
              theme="vs-dark"
            />
          </div>
        </div>

        {/* Indices */}
        <AnimatePresence>
          {currentHintIndex >= 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-lg border bg-muted/30 p-4"
            >
              <h3 className="mb-2 flex items-center text-sm font-medium">
                <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                Indice {currentHintIndex + 1}/{hints.length}
              </h3>
              <p className="text-sm text-muted-foreground">{hints[currentHintIndex]}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Résultats des tests */}
        <AnimatePresence>
          {testResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium">Résultats des tests</h3>
              <div className="space-y-3">
                {testResults.map((result, index) => {
                  const testCase = testCases.find(tc => tc.id === result.id);
                  
                  return (
                    <div
                      key={result.id}
                      className={cn(
                        "rounded-lg border p-4",
                        result.passed ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {result.passed ? (
                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                          ) : (
                            <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                          )}
                          <div>
                            <h4 className="font-medium">
                              Test {index + 1}: {testCase?.description || 'Test'}
                            </h4>
                            {result.error ? (
                              <div className="mt-2 rounded-md bg-card p-2 text-sm">
                                <p className="font-mono text-red-500">{result.error}</p>
                              </div>
                            ) : (
                              <>
                                <div className="mt-2 grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="mb-1 text-xs font-medium">Résultat attendu:</p>
                                    <div className="rounded-md bg-card p-2">
                                      <pre className="text-xs">{testCase?.expectedOutput}</pre>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="mb-1 text-xs font-medium">Votre résultat:</p>
                                    <div className="rounded-md bg-card p-2">
                                      <pre className="text-xs">{result.output}</pre>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {allTestsPassed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg border border-green-500 bg-green-500/10 p-4 text-center"
                >
                  <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
                  <h3 className="text-lg font-medium text-green-700 dark:text-green-400">
                    Félicitations !
                  </h3>
                  <p className="text-green-600 dark:text-green-300">
                    Vous avez réussi tous les tests.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solution */}
        <AnimatePresence>
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <h3 className="mb-2 text-lg font-medium">Solution</h3>
              <CodeBlock code={solution} language={language} />
              <p className="mt-2 text-sm text-muted-foreground">
                N&apos;oubliez pas qu&apos;il peut y avoir plusieurs façons de résoudre un problème. Cette solution n&apos;est qu&apos;une possibilité.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/10 px-6 py-4">
        <Button
          variant="outline"
          onClick={() => setShowSolution(!showSolution)}
        >
          {showSolution ? "Masquer la solution" : "Voir la solution"}
        </Button>
        <Button
          onClick={runTests}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Exécution en cours...
            </>
          ) : (
            "Exécuter les tests"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
