import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen } from "lucide-react";

// Définir un type pour les props qui correspond aux données que vous passez
export interface CourseCardProps {
  course: {
    id: string;
    title: string;
    moduleId: string;
    description?: string;
    estimatedTimeMinutes?: number;
    level?: string;
    // Ajout d'un champ slug pour éviter les erreurs TypeScript
    slug?: string;
  };
  progress: number;
  // Ajout de lastAccessDate pour compatibilité
  lastAccessDate?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  lastAccessDate,
}) => {
  // Utiliser moduleId comme fallback pour slug
  const courseUrl = `/student/learn/${course.slug || course.moduleId}`;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="flex-1 p-4">
        <Link href={courseUrl} className="block h-full">
          <div>
            <h3 className="font-medium mb-1 line-clamp-1 hover:text-primary transition-colors">
              {course.title}
            </h3>
            {course.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {course.description}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              {course.estimatedTimeMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.estimatedTimeMinutes} min
                </span>
              )}
              {course.level && <span>{course.level}</span>}
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </Link>
      </CardContent>
      <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t">
        <div className="flex justify-between w-full">
          <span>{progress}% terminé</span>
          {lastAccessDate && <span>Dernier accès: {lastAccessDate}</span>}
        </div>
      </CardFooter>
    </Card>
  );
};
