import React from "react";
import type { Course } from "@/types/course.types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, Info } from "lucide-react";

interface CourseLearnContentProps {
  course: Course;
}

const CourseLearnContent: React.FC<CourseLearnContentProps> = ({ course }) => {
  // Si le cours a un contenu formaté en HTML
  if (course.content) {
    return (
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: course.content }} />
      </div>
    );
  }

  // Contenu par défaut s'il n'y a pas de contenu formaté
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Introduction à {course.title}
      </h2>

      <div className="mb-6">
        <p>
          Ce module vous permettra d&apos;apprendre les concepts essentiels de{" "}
          {course.title}. Au cours de ce module, vous découvrirez comment mettre
          en pratique ces connaissances dans des projets concrets.
        </p>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Informations sur le cours</AlertTitle>
        <AlertDescription>
          Ce cours est de niveau <strong>{course.level}</strong> et devrait vous
          prendre environ
          <strong> {course.estimatedTimeMinutes} minutes</strong> à compléter.
        </AlertDescription>
      </Alert>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">
          Ce que vous allez apprendre
        </h3>
        <p className="mb-4">Dans ce cours, vous découvrirez comment:</p>
        <ul className="list-disc pl-5 space-y-2">
          {course.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Structure du cours</h3>
        <p className="mb-4">
          Le cours est divisé en plusieurs sections qui vous guideront
          progressivement à travers les concepts clés.
        </p>

        <div className="space-y-3 mt-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Section 1: Introduction</h4>
              <span className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                10 min
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Présentation des concepts de base et des objectifs du cours.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Section 2: Concepts fondamentaux</h4>
              <span className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                15 min
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Exploration des principes essentiels et des méthodologies clés.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Section 3: Application pratique</h4>
              <span className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                20 min
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Mise en pratique des connaissances à travers des exercices et des
              projets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearnContent;
