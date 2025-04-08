import React from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

export interface LessonStatus {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  href: string;
}

interface ModuleProgressProps {
  lessons: LessonStatus[];
  currentLessonId?: string;
  className?: string;
}

export function ModuleProgress({ lessons, currentLessonId, className }: ModuleProgressProps) {
  return (
    <div className={cn("relative py-4", className)}>
      {/* Ligne de progression */}
      <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-muted" />
      
      {/* Points de progression */}
      <div className="relative flex justify-between">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === currentLessonId;
          
          // Déterminer le style en fonction du statut
          let bgColor = "bg-muted";
          let textColor = "text-muted-foreground";
          let borderColor = "border-background";
          let icon = <Circle className="w-4 h-4" />;
          
          if (lesson.status === 'completed') {
            bgColor = "bg-green-500";
            textColor = "text-green-500";
            borderColor = "border-green-500";
            icon = <CheckCircle className="w-4 h-4 text-white" />;
          } else if (lesson.status === 'in-progress' || isCurrent) {
            bgColor = "bg-primary";
            textColor = "text-primary";
            borderColor = "border-primary";
            icon = <Circle className="w-4 h-4 text-white" />;
          } else if (lesson.status === 'locked') {
            icon = <Lock className="w-4 h-4" />;
          }
          
          return (
            <TooltipProvider key={lesson.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    {lesson.status !== 'locked' ? (
                      <Link href={lesson.href}>
                        <motion.div
                          className={cn(
                            "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2",
                            bgColor,
                            borderColor,
                            "transition-all duration-200",
                            isCurrent && "ring-2 ring-offset-2 ring-primary"
                          )}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {icon}
                        </motion.div>
                      </Link>
                    ) : (
                      <div
                        className={cn(
                          "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-not-allowed",
                          bgColor,
                          borderColor
                        )}
                      >
                        {icon}
                      </div>
                    )}
                    <span 
                      className={cn(
                        "mt-2 text-xs font-medium max-w-[80px] text-center truncate",
                        textColor,
                        isCurrent && "font-bold text-foreground"
                      )}
                    >
                      {lesson.title}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {lesson.status === 'completed' && 'Terminé'}
                    {lesson.status === 'in-progress' && 'En cours'}
                    {lesson.status === 'available' && 'Disponible'}
                    {lesson.status === 'locked' && 'Verrouillé'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
