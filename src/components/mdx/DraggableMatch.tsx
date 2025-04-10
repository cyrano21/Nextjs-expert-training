"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchPair {
  id: string;
  left: string;
  right: string;
}

interface DraggableMatchProps {
  pairs: MatchPair[];
  className?: string;
}

export function DraggableMatch({ pairs, className }: DraggableMatchProps) {
  // Dans une implémentation réelle, il faudrait une vraie fonctionnalité de glisser-déposer
  // Ici, c'est une version simplifiée avec sélection
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
      <h3 className="font-semibold text-lg mb-4">Associez les éléments</h3>

      <div className="flex flex-col md:flex-row gap-8 mb-6">
        {/* Left items */}
        <div className="flex-1 space-y-2">
          {pairs.map((pair) => (
            <div
              key={`left-${pair.id}`}
              className={cn(
                "p-3 border rounded-md cursor-pointer transition-colors",
                selectedLeft === pair.id && "border-primary bg-primary/5",
                matches[pair.id] && !selectedLeft && "border-blue-500",
                checkResults &&
                  isCorrect(pair.id) &&
                  "border-green-500 bg-green-500/10",
                checkResults &&
                  !isCorrect(pair.id) &&
                  matches[pair.id] &&
                  "border-red-500 bg-red-500/10"
              )}
              onClick={() => !checkResults && handleLeftSelect(pair.id)}
            >
              <div className="flex justify-between items-center">
                <span>{pair.left}</span>
                {checkResults && (
                  <>
                    {isCorrect(pair.id) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      matches[pair.id] && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right items */}
        <div className="flex-1 space-y-2">
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
              <span>{pair.right}</span>
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
