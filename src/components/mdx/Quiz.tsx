"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, HelpCircle, AlertTriangle } from "lucide-react";

interface QuizProps {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points?: number; // Ajout des points pour la gamification
}

export function Quiz({
  questionId,
  question,
  options,
  correctAnswer,
  explanation,
  points = 5, // Points par défaut
}: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (!submitted) {
      setSelectedOption(index);
    }
  };

  const checkAnswer = () => {
    setSubmitted(true);
    setShowExplanation(true);
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setSubmitted(false);
    setShowExplanation(false);
  };

  return (
    <div
      className={cn(
        "my-8 rounded-lg border shadow-sm p-6",
        submitted && isCorrect(selectedOption)
          ? "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-900"
          : submitted
          ? "bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900"
          : "bg-card"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{question}</h3>
        {/* Badge de points si disponible */}
        {points > 0 && (
          <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-1">
            <span>+{points} points</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-6">
        {options.map((option, index) => (
          <div
            key={`${questionId}-${index}`}
            className={cn(
              "flex items-center gap-3 p-3 rounded-md cursor-pointer border",
              "transition-all duration-200",
              selectedOption === index &&
                !submitted &&
                "border-primary bg-primary/5",
              submitted &&
                index === correctAnswer &&
                "border-green-500 bg-green-500/10",
              submitted &&
                selectedOption === index &&
                index !== correctAnswer &&
                "border-red-500 bg-red-500/10",
              submitted
                ? "cursor-default"
                : "hover:border-primary/50 hover:bg-primary/5"
            )}
            onClick={() => handleOptionSelect(index)}
          >
            {/* Ajout d'une condition pour transformer l'indicateur en un élément visuel plus évident */}
            {submitted ? (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {index === correctAnswer ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  selectedOption === index && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  selectedOption === index && "border-primary bg-primary/20"
                )}
              >
                {selectedOption === index && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            )}
            <span
              className={cn(
                "text-sm",
                selectedOption === index && !submitted && "font-medium",
                submitted &&
                  index === correctAnswer &&
                  "font-medium text-green-700 dark:text-green-400",
                submitted &&
                  selectedOption === index &&
                  index !== correctAnswer &&
                  "font-medium text-red-700 dark:text-red-400"
              )}
            >
              {option}
            </span>
          </div>
        ))}
      </div>

      {showExplanation && explanation && (
        <div
          className={cn(
            "mt-4 mb-6 p-4 rounded-md text-sm border",
            isCorrect(selectedOption)
              ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
              : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900"
          )}
        >
          <div className="flex gap-2 mb-2 items-start">
            {isCorrect(selectedOption) ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            )}
            <div>
              <p className="font-medium">
                {isCorrect(selectedOption) ? "Correct!" : "Pas tout à fait."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {submitted ? (
          <Button variant="outline" onClick={resetQuiz}>
            Réessayer
          </Button>
        ) : (
          <Button
            onClick={checkAnswer}
            disabled={selectedOption === null}
            className={
              selectedOption !== null ? "bg-primary hover:bg-primary/90" : ""
            }
          >
            Vérifier
          </Button>
        )}
      </div>
    </div>
  );

  // Fonction utilitaire pour déterminer si la réponse est correcte
  function isCorrect(selectedOption: number | null): boolean {
    return selectedOption === correctAnswer;
  }
}
