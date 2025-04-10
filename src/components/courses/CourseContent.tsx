import React from "react";
import type { Course } from "@/types/course.types";
import CourseObjectives from "./CourseObjectives";

interface CourseContentProps {
  course: Course;
}

const CourseContent: React.FC<CourseContentProps> = ({ course }) => {
  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Contenu du cours</h2>

        <div className="mb-6">
          <CourseObjectives objectives={course.objectives} />
        </div>

        <div className="prose prose-slate max-w-none">
          {course.content ? (
            <div dangerouslySetInnerHTML={{ __html: course.content }} />
          ) : (
            <p className="text-gray-500 italic">
              Le contenu détaillé de ce cours est en cours de préparation.
            </p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-3">
            Informations complémentaires
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <span className="font-medium">Niveau :</span> {course.level}
            </li>
            <li>
              <span className="font-medium">Durée estimée :</span>{" "}
              {course.estimatedTimeMinutes} minutes
            </li>
            <li>
              <span className="font-medium">Tags :</span>{" "}
              {course.tags?.join(", ")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
