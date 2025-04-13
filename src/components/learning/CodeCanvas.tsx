"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Code, LayoutPanelLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CodeCanvasProps {
  title?: string;
  description?: string;
  initialCode: string;
  language: "html" | "css" | "javascript" | "typescript" | "jsx" | "tsx";
  height?: string;
  className?: string;
  autoRun?: boolean;
  delay?: number;
  showPreview?: boolean;
  onCodeChange?: (code: string) => void;
}

export function CodeCanvas({
  title,
  description,
  initialCode,
  language = "html",
  height = "300px",
  className,
  autoRun = true,
  delay = 1000,
  showPreview = true,
  onCodeChange,
}: CodeCanvasProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunCode, setLastRunCode] = useState("");

  // Fonction pour gérer l'exécution du code
  const runCode = useCallback(() => {
    setIsRunning(true);
    setError(null);

    try {
      // Stocker le code qui est en train d'être exécuté
      setLastRunCode(code);

      // Adapter le code en fonction du langage
      let formattedOutput = "";

      if (language === "html") {
        formattedOutput = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 10px; }
              </style>
            </head>
            <body>
              ${code}
            </body>
          </html>
        `;
      } else if (language === "css") {
        formattedOutput = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>${code}</style>
            </head>
            <body>
              <div class="container">
                <h1>Prévisualisation CSS</h1>
                <p>Le contenu est stylisé selon votre code CSS.</p>
                <button>Un bouton</button>
                <div class="box">Une boîte</div>
              </div>
            </body>
          </html>
        `;
      } else if (language === "javascript") {
        formattedOutput = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 10px; }
                #output { margin-top: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
              </style>
            </head>
            <body>
              <h2>Console de sortie:</h2>
              <div id="output"></div>
              <script>
                const consoleOutput = document.getElementById('output');
                
                // Redirection de console.log
                const originalLog = console.log;
                console.log = function() {
                  originalLog.apply(console, arguments);
                  const args = Array.from(arguments);
                  const text = args.map(arg => {
                    if (typeof arg === 'object') {
                      return JSON.stringify(arg);
                    }
                    return String(arg);
                  }).join(' ');
                  
                  const logLine = document.createElement('div');
                  logLine.textContent = text;
                  consoleOutput.appendChild(logLine);
                };

                // Capture des erreurs
                window.onerror = function(message) {
                  const errorLine = document.createElement('div');
                  errorLine.style.color = 'red';
                  errorLine.textContent = 'Erreur: ' + message;
                  consoleOutput.appendChild(errorLine);
                  return true;
                };

                try {
                  ${code}
                } catch (e) {
                  console.log('Erreur: ' + e.message);
                }
              </script>
            </body>
          </html>
        `;
      } else if (language === "jsx" || language === "tsx") {
        // Pour JSX/TSX, nous utilisons une approche simplifiée pour la prévisualisation
        formattedOutput = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 10px; }
                #error { color: red; margin-top: 10px; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <div id="error"></div>
              
              <script type="text/babel">
                try {
                  ${code}
                  
                  // Chercher un composant App ou par défaut utiliser le premier composant exporté
                  const Component = typeof App !== 'undefined' ? App : 
                                    typeof default !== 'undefined' ? default : null;
                  
                  if (Component) {
                    ReactDOM.createRoot(document.getElementById('root')).render(<Component />);
                  } else {
                    document.getElementById('error').textContent = 'Aucun composant React trouvé. Définissez une fonction App ou utilisez export default.';
                  }
                } catch (e) {
                  document.getElementById('error').textContent = 'Erreur: ' + e.message;
                }
              </script>
            </body>
          </html>
        `;
      }

      setOutput(formattedOutput);

      if (onCodeChange) {
        onCodeChange(code);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Erreur lors de l'exécution du code :", err);
    } finally {
      setIsRunning(false);
    }
  }, [code, language, onCodeChange]);

  // Effet pour exécuter le code automatiquement après un délai
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (autoRun && code !== lastRunCode) {
      timer = setTimeout(() => {
        runCode();
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [code, autoRun, delay, lastRunCode, runCode]);

  const resetCode = () => {
    setCode(initialCode);
    setError(null);
  };

  return (
    <Card className={cn("w-full", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div
          className={cn(
            "grid gap-4",
            showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          )}
        >
          {/* Éditeur de code */}
          <div className="border rounded-md overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/50 p-2">
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-2" />
                <h3 className="text-sm font-medium">
                  {language.toUpperCase()}
                </h3>
              </div>
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
                  onClick={runCode}
                  disabled={isRunning}
                  title="Exécuter le code"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className={`h-[${height.replace(/['"]/g, "")}]`}>
              <MonacoEditor
                value={code}
                onChange={setCode}
                defaultLanguage={language}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Prévisualisation */}
          {showPreview && (
            <div className="border rounded-md overflow-hidden">
              <div className="flex items-center justify-between border-b bg-muted/50 p-2">
                <div className="flex items-center">
                  <LayoutPanelLeft className="h-4 w-4 mr-2" />
                  <h3 className="text-sm font-medium">Résultat</h3>
                </div>
              </div>
              <div
                className={`h-[${height.replace(
                  /['"]/g,
                  ""
                )}] bg-white dark:bg-gray-900 overflow-auto`}
              >
                {error ? (
                  <div className="p-4 text-red-500">
                    <p className="font-medium">Erreur :</p>
                    <pre className="mt-2 text-sm whitespace-pre-wrap">
                      {error}
                    </pre>
                  </div>
                ) : (
                  <iframe
                    srcDoc={output}
                    title="Prévisualisation"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          {autoRun
            ? "Le code s'exécute automatiquement après chaque modification"
            : "Cliquez sur le bouton Lecture pour exécuter le code"}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-1"
            >
              {error}
            </motion.p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
