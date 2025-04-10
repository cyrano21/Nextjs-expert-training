import React from "react";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseObjectivesProps {
  objectives: string[];
  className?: string;
  iconSize?: number;
  showProgress?: boolean;
}

const CourseObjectives: React.FC<CourseObjectivesProps> = ({
  objectives,
  className,
  iconSize = 16,
  showProgress = false,
}) => {
  if (!objectives || objectives.length === 0) {
    return null;
  }

  // Simuler des objectifs complétés (en production, cela viendrait d'une API/base de données)
  const completedObjectives = showProgress ? [0, 2] : [];

  return (
    <div className={cn("mb-6", className)}>
      <h3 className="text-xl font-semibold mb-3">
        Objectifs d&apos;apprentissage
      </h3>
      <ul className="space-y-3">
        {objectives.map((objective, index) => {
          const isCompleted = completedObjectives.includes(index);
          return (
            <li
              key={index}
              className={cn(
                "flex items-start gap-3",
                isCompleted
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  isCompleted
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : "bg-primary/10 dark:bg-primary-900/20"
                )}
              >
                <Award
                  className={cn(
                    "shrink-0",
                    isCompleted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-primary"
                  )}
                  size={iconSize}
                />
              </div>
              <span className="text-sm">{objective}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CourseObjectives;
