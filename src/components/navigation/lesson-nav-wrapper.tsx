"use client";

import { LessonNav } from "./lesson-nav";

interface LessonNavWrapperProps {
  lessonId: string;
  isCompleted: boolean;
  prevLessonUrl: string | null;
  nextLessonUrl: string | null;
}

export function LessonNavWrapper({
  lessonId,
  isCompleted,
  prevLessonUrl,
  nextLessonUrl,
}: LessonNavWrapperProps) {
  return (
    <LessonNav
      lessonId={lessonId}
      isCompleted={isCompleted}
      prevLessonUrl={prevLessonUrl}
      nextLessonUrl={nextLessonUrl}
    />
  );
}
