import React from "react";
import Link from "next/link";
import type { Course } from "@/types/course.types";

interface CourseHeaderProps {
  course: Course;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Link
          href="/student/courses"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Retour aux cours
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{course.description}</p>

        {course.learningPath && (
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h2 className="font-semibold text-blue-800 mb-2">
              Parcours d&apos;apprentissage: {course.learningPath.title}
            </h2>
            <p className="text-blue-700 text-sm">
              Ce cours fait partie du parcours {course.learningPath.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseHeader;
