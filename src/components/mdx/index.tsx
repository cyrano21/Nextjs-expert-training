import React, { useState } from "react";
import { cn } from "../../lib/utils";
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Copy,
  Check,
  Laptop,
  FolderTree,
  Terminal,
  Award,
} from "lucide-react";
import { CodeCanvas } from "../../components/learning/CodeCanvas";

// Export du composant CodeCanvas pour l'utiliser dans les fichiers MDX
export { CodeCanvas };

// InfoTip - Pour afficher des messages informatifs, d'avertissement, etc.
export function InfoTip({
  children,
  type = "info",
  title = "",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success" | "idea";
  title?: string;
}) {
  const types = {
    info: {
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800/50",
      textColor: "text-blue-800 dark:text-blue-300",
      icon: <Info className="h-5 w-5" />,
    },
    warning: {
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200 dark:border-yellow-800/50",
      textColor: "text-yellow-800 dark:text-yellow-300",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    success: {
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800/50",
      textColor: "text-green-800 dark:text-green-300",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    idea: {
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800/50",
      textColor: "text-purple-800 dark:text-purple-300",
      icon: <Lightbulb className="h-5 w-5" />,
    },
  };

  const style = types[type] || types.info;

  return (
    <div
      className={`p-4 my-4 rounded-md border ${style.borderColor} ${style.bgColor}`}
    >
      {title && (
        <div
          className={`font-bold mb-1 ${style.textColor} flex items-center gap-1.5`}
        >
          {style.icon} {title}
        </div>
      )}
      <div className={style.textColor}>{children}</div>
    </div>
  );
}

// CodeBlock - Pour afficher du code avec coloration syntaxique
export function CodeBlock({
  children,
  language = "javascript",
  title = "",
  allowCopy = false,
}: {
  children: React.ReactNode;
  language?: string;
  title?: string;
  allowCopy?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-4 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 group">
      {title && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          {allowCopy && (
            <button
              onClick={handleCopy}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      )}
      <div className="relative">
        <pre
          className={`p-4 bg-gray-50 dark:bg-gray-900 overflow-x-auto text-sm`}
        >
          <code className={`language-${language}`}>{children}</code>
        </pre>
        {allowCopy && !title && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Quiz - Pour des questions interactives
export function Quiz({
  questionId,
  question,
  options,
  correctAnswer,
  explanation,
}: {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (selectedOption !== undefined) {
      setIsCorrect(parseInt(selectedOption) === correctAnswer);
      setShowExplanation(true);
    }
  };

  return (
    <div className="my-6 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <h3 className="text-lg font-medium mb-4">{question}</h3>

      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${questionId}-option-${index}`}
              name={questionId}
              value={index.toString()}
              checked={selectedOption === index.toString()}
              onChange={() => setSelectedOption(index.toString())}
              disabled={showExplanation}
              className="w-4 h-4"
            />
            <label
              htmlFor={`${questionId}-option-${index}`}
              className={cn(
                "text-gray-800 dark:text-gray-200 cursor-pointer",
                showExplanation &&
                  index === correctAnswer &&
                  "font-medium text-green-600 dark:text-green-400"
              )}
            >
              {option}
            </label>
          </div>
        ))}
      </div>

      {!showExplanation && (
        <button
          className={cn(
            "mt-5 px-4 py-2 rounded transition-colors",
            selectedOption !== undefined
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          )}
          onClick={handleSubmit}
          disabled={selectedOption === undefined}
        >
          Vérifier
        </button>
      )}

      {showExplanation && (
        <div
          className={cn(
            "mt-5 p-4 rounded-md",
            isCorrect
              ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900/30"
              : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900/30"
          )}
        >
          <p className="font-medium flex items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-green-700 dark:text-green-400">
                  Correct !
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 dark:text-red-400">
                  Pas tout à fait...
                </span>
              </>
            )}
          </p>
          <p className="mt-1 text-gray-700 dark:text-gray-300">{explanation}</p>

          {!isCorrect && (
            <button
              className="mt-3 text-sm px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {
                setShowExplanation(false);
                setSelectedOption(undefined);
              }}
            >
              Réessayer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ProjectStep - Pour guider les utilisateurs étape par étape
export function ProjectStep({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="my-4 border-l-4 border-blue-400 pl-4 py-1">
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
}

// TerminalOutput - Pour simuler une sortie de terminal
export function TerminalOutput({
  children,
  title = "Terminal",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="my-4 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
      <div className="bg-gray-800 text-white px-4 py-2 text-sm flex items-center gap-2">
        <Terminal className="h-4 w-4" />
        {title}
      </div>
      <pre className="p-4 bg-black text-green-400 overflow-x-auto font-mono text-sm whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}

// AchievementUnlocked - Pour célébrer les réussites
export function AchievementUnlocked({
  title,
  points,
  children,
}: {
  title: string;
  points: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="my-6 p-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-lg flex items-center gap-2">
          <Award className="h-5 w-5" />
          Succès débloqué !
        </h4>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
          +{points} pts
        </span>
      </div>
      <p className="font-semibold text-lg mb-3">{title}</p>
      {children && (
        <div className="text-white/90 text-sm border-t border-white/20 pt-3 mt-2">
          {children}
        </div>
      )}
    </div>
  );
}

// FileTree - Pour visualiser une structure de fichiers
export function FileTree({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <FolderTree className="h-4 w-4" />
        Structure du projet
      </div>
      <pre className="font-mono text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200 mt-1">
        {children}
      </pre>
    </div>
  );
}

// BrowserInteractionGuide - Pour guider l'interaction avec le navigateur
export function BrowserInteractionGuide({
  steps,
}: {
  steps: { action: string; details: string }[];
}) {
  return (
    <div className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <h4 className="font-bold mb-3 flex items-center gap-2">
        <Laptop className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        Guide d&rsquo;Interaction avec le Navigateur
      </h4>
      <ol className="list-decimal pl-5 space-y-3">
        {steps.map((step, index) => (
          <li key={index} className="pl-1">
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {step.action}
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {step.details}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// DraggableMatch - Version simplifiée sans drag & drop
export function DraggableMatch({
  items,
  targets,
  correctMatches,
  feedback,
}: {
  items: { id: string; label: string }[];
  targets: { id: string; label: string }[];
  correctMatches: Record<string, string>;
  feedback: { correct: string; incorrect: string };
}) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswers = () => {
    const correct = Object.entries(matches).every(
      ([itemId, targetId]) => correctMatches[itemId] === targetId
    );
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleMatch = (itemId: string, targetId: string) => {
    setMatches((prev) => ({
      ...prev,
      [itemId]: targetId,
    }));
  };

  return (
    <div className="my-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="w-1/3 p-2 bg-blue-100 dark:bg-blue-900/50 rounded">
              {item.label}
            </div>
            <select
              value={matches[item.id] || ""}
              onChange={(e) => handleMatch(item.id, e.target.value)}
              className="w-2/3 p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              disabled={submitted}
              aria-label={`Sélection pour ${item.label}`}
            >
              <option value="">-- Sélectionner --</option>
              {targets.map((target) => (
                <option key={target.id} value={target.id}>
                  {target.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          className={cn(
            "mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
            Object.keys(matches).length !== items.length &&
              "opacity-50 cursor-not-allowed"
          )}
          onClick={checkAnswers}
          disabled={Object.keys(matches).length !== items.length}
        >
          Vérifier
        </button>
      )}

      {submitted && (
        <div
          className={cn(
            "mt-4 p-3 rounded",
            isCorrect
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-red-100 dark:bg-red-900/30"
          )}
        >
          <p>{isCorrect ? feedback.correct : feedback.incorrect}</p>
          {!isCorrect && (
            <button
              className="mt-2 px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded text-sm"
              onClick={() => {
                setSubmitted(false);
                setMatches({});
              }}
            >
              Réessayer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// InteractiveCodeMatcher - Pour associer du code à des concepts
export function InteractiveCodeMatcher({
  pairs,
  options,
  correctMapping,
}: {
  pairs: { id: string; code: string; language: string }[];
  options: { id: string; label: string }[];
  correctMapping: Record<string, string>;
}) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleSelection = (pairId: string, optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [pairId]: optionId,
    }));
  };

  const checkAnswers = () => {
    const newResults: Record<string, boolean> = {};
    for (const [pairId, optionId] of Object.entries(selections)) {
      newResults[pairId] = correctMapping[pairId] === optionId;
    }
    setResults(newResults);
    setSubmitted(true);
  };

  const allCorrect = submitted && Object.values(results).every((r) => r);

  return (
    <div className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="space-y-6">
        {pairs.map((pair) => (
          <div
            key={pair.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
              <pre className="text-sm overflow-x-auto">
                <code className={`language-${pair.language}`}>{pair.code}</code>
              </pre>
            </div>
            <div className="p-3 flex items-center space-x-3">
              <span>C&apos;est du:</span>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      !submitted && handleSelection(pair.id, option.id)
                    }
                    className={cn(
                      "px-3 py-1 rounded text-sm font-medium",
                      selections[pair.id] === option.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700",
                      submitted &&
                        correctMapping[pair.id] === option.id &&
                        "ring-2 ring-green-500",
                      submitted &&
                        selections[pair.id] === option.id &&
                        correctMapping[pair.id] !== option.id &&
                        "ring-2 ring-red-500"
                    )}
                    disabled={submitted}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {submitted && (
                <span className="ml-auto">
                  {results[pair.id] ? "✅" : "❌"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={checkAnswers}
          disabled={Object.keys(selections).length !== pairs.length}
        >
          Vérifier
        </button>
      ) : (
        <div
          className={cn(
            "mt-4 p-3 rounded",
            allCorrect
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-yellow-100 dark:bg-yellow-900/30"
          )}
        >
          <p>
            {allCorrect
              ? "✅ Bravo ! Vous avez correctement identifié toutes les technologies."
              : "❌ Pas tout à fait. Revoyez les technologies que vous avez identifiées incorrectement."}
          </p>
          <button
            className="mt-2 px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded text-sm"
            onClick={() => {
              setSubmitted(false);
              if (!allCorrect) setSelections({});
            }}
          >
            {allCorrect ? "Continuer" : "Réessayer"}
          </button>
        </div>
      )}
    </div>
  );
}
