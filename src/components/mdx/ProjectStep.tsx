import React from "react";
import { cn } from "@/lib/utils";

interface ProjectStepProps {
  children: React.ReactNode;
  title: string;
  id?: string;
  stepNumber?: number;
  className?: string;
}

export function ProjectStep({
  children,
  title,
  id,
  stepNumber,
  className,
}: ProjectStepProps) {
  return (
    <div
      id={id}
      className={cn("my-8 rounded-lg border bg-card p-6 relative", className)}
    >
      {stepNumber && (
        <div className="absolute -left-3 -top-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-sm">
            {stepNumber}
          </span>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="prose dark:prose-invert max-w-none">{children}</div>
    </div>
  );
}
