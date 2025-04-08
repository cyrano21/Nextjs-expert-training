"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { Lesson } from "@/types/curriculum";

interface LessonNavProps {
  moduleId: string;
  lessons: Lesson[];
  currentLessonId?: string;
}

export function LessonNav({ moduleId, lessons, currentLessonId }: LessonNavProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Leçons
        </h2>
        <div className="space-y-1">
          {lessons.map((lesson, index) => {
            const href = `/student/learn/${moduleId}/${lesson.id}`;
            const isActive = pathname === href || currentLessonId === lesson.id;
            
            return (
              <Link
                key={lesson.id}
                href={href}
                className={cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs">
                    {index + 1}
                  </div>
                  <span className="truncate">{lesson.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
