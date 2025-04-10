"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodePair {
  id: string;
  left: string;
  right: string;
  language?: string;
}

interface InteractiveCodeMatcherProps {
  pairs: CodePair[];
  className?: string;
}

export function InteractiveCodeMatcher({
  pairs,
  className,
}: InteractiveCodeMatcherProps) {
  // Même logique simplifiée que DraggableMatch
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [checkResults, setCheckResults] = useState<boolean>(false);

  const handleLeftSelect = (id: string) => {
    setSelectedLeft(id);
  };

  const handleRightSelect = (id: string) => {
    if (selectedLeft) {
      setMatches((prev) => ({ ...prev, [selectedLeft]: id }));
      setSelectedLeft(null);
    }
  };

  const checkAnswers = () => {
    setCheckResults(true);
  };

  const resetExercise = () => {
    setMatches({});
    setSelectedLeft(null);
    setCheckResults(false);
  };

  const isCorrect = (leftId: string) => {
    return pairs.find((p) => p.id === leftId)?.id === matches[leftId];
  };

  return (
    <div className={cn("my-6 p-4 border rounded-lg bg-card", className)}>
      <h3 className="font-semibold text-lg mb-4">Associez les codes</h3>

      <div className="flex flex-col lg:flex-row gap-8 mb-6">
        {/* Code snippets */}
        <div className="flex-1 space-y-4">
          {pairs.map((pair) => (
            <div
              key={`left-${pair.id}`}
              className={cn(
                "p-3 border rounded-md cursor-pointer transition-colors font-mono text-sm",
                "bg-zinc-950 border-zinc-800 text-zinc-300",
                "dark:bg-zinc-900 dark:border-zinc-700",
                selectedLeft === pair.id && "border-primary",
                matches[pair.id] && !selectedLeft && "border-blue-500",
                checkResults && isCorrect(pair.id) && "border-green-500",
                checkResults &&
                  !isCorrect(pair.id) &&
                  matches[pair.id] &&
                  "border-red-500"
              )}
              onClick={() => !checkResults && handleLeftSelect(pair.id)}
            >
              <pre className="whitespace-pre-wrap">
                <code>{pair.left}</code>
              </pre>
            </div>
          ))}
        </div>

        {/* Descriptions */}
        <div className="flex-1 space-y-4">
          {pairs.map((pair) => (
            <div
              key={`right-${pair.id}`}
              className={cn(
                "p-3 border rounded-md cursor-pointer transition-colors",
                Object.values(matches).includes(pair.id) &&
                  !selectedLeft &&
                  "border-blue-500",
                checkResults &&
                  Object.entries(matches).find(
                    ([key, val]) => val === pair.id && isCorrect(key)
                  ) &&
                  "border-green-500 bg-green-500/10",
                checkResults &&
                  Object.entries(matches).find(
                    ([key, val]) => val === pair.id && !isCorrect(key)
                  ) &&
                  "border-red-500 bg-red-500/10"
              )}
              onClick={() =>
                selectedLeft && !checkResults && handleRightSelect(pair.id)
              }
            >
              <div>{pair.right}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {checkResults ? (
          <Button onClick={resetExercise}>Réessayer</Button>
        ) : (
          <Button
            onClick={checkAnswers}
            disabled={Object.keys(matches).length !== pairs.length}
          >
            Vérifier
          </Button>
        )}
      </div>
    </div>
  );
}
