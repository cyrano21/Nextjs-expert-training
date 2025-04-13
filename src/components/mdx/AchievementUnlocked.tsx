"use client";

import React from "react";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AchievementUnlockedProps {
  children: React.ReactNode;
  title: string;
  points?: number;
  className?: string;
}

export function AchievementUnlocked({
  children,
  title,
  points,
  className,
}: AchievementUnlockedProps) {
  return (
    <div
      className={cn(
        "my-6 p-6 rounded-lg border bg-gradient-to-r from-amber-50 to-yellow-100 border-yellow-200 dark:from-amber-950/30 dark:to-yellow-900/20 dark:border-yellow-800/50",
        "flex flex-col items-center text-center",
        className
      )}
    >
      <div className="h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center mb-3">
        <Award className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-1">
        {title}
      </h3>
      {points && (
        <Badge
          variant="outline"
          className="mb-2 bg-amber-100 hover:bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50"
        >
          {points} points
        </Badge>
      )}
      <div className="text-amber-700 dark:text-amber-300/90 mt-2">
        {children}
      </div>
    </div>
  );
}
