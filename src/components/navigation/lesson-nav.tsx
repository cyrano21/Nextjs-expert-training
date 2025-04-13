"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonNavProps {
  prevLessonUrl: string | null;
  nextLessonUrl: string | null;
  lessonId: string; // Conservé dans l'interface pour maintenir la compatibilité avec le code appelant
  isCompleted: boolean;
}

export function LessonNav({
  prevLessonUrl,
  nextLessonUrl,
  isCompleted,
}: LessonNavProps) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>

      <div className="flex flex-col space-y-3">
        {prevLessonUrl && (
          <Button variant="outline" size="sm" asChild className="justify-start">
            <Link href={prevLessonUrl}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Leçon précédente
            </Link>
          </Button>
        )}

        <div className="flex items-center justify-center py-2">
          {isCompleted ? (
            <span className="text-sm flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5 mr-1" /> Leçon complétée
            </span>
          ) : (
            <span className="text-sm flex items-center text-primary">
              <Circle className="h-5 w-5 mr-1" /> Leçon en cours
            </span>
          )}
        </div>

        {nextLessonUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="justify-between"
          >
            <Link href={nextLessonUrl}>
              Leçon suivante
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
