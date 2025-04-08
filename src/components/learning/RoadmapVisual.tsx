import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { CheckCircle, Lock, BookOpen } from 'lucide-react';

interface Module {
  id: number | string;
  title: string;
  description: string;
  level: string;
  completed: boolean;
  locked?: boolean;
  href: string;
  progress: number;
}

interface RoadmapVisualProps {
  modules: Module[];
  className?: string;
}

export function RoadmapVisual({ modules, className }: RoadmapVisualProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const moduleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 15
      }
    }
  };

  return (
    <div className={cn("relative py-10", className)}>
      {/* Ligne de connexion verticale */}
      <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-muted" />
      
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {modules.map((module, index) => {
          // Alterner les modules entre gauche et droite
          const isLeft = index % 2 === 0;
          
          return (
            <motion.div
              key={module.id}
              className={cn(
                "relative mb-16 flex w-full items-center justify-center",
                isLeft ? "md:justify-start" : "md:justify-end"
              )}
              variants={moduleVariants}
            >
              {/* Point de connexion sur la ligne */}
              <div className="absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-muted" />
              
              {/* Carte du module */}
              <div 
                className={cn(
                  "relative w-full max-w-md rounded-xl border bg-card p-6 shadow-lg transition-all md:w-5/12",
                  module.completed && "border-green-500",
                  module.locked && "opacity-70"
                )}
              >
                {/* Indicateur d'état */}
                <div className={cn(
                  "absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full",
                  module.completed ? "bg-green-500 text-white" : 
                  module.locked ? "bg-muted text-muted-foreground" : 
                  "bg-primary text-primary-foreground"
                )}>
                  {module.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : module.locked ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <BookOpen className="h-5 w-5" />
                  )}
                </div>
                
                {/* Contenu du module */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{module.title}</h3>
                  <p className="mt-1 text-muted-foreground">{module.description}</p>
                </div>
                
                {/* Niveau et progression */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                    {module.level}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-secondary">
                      <div 
                        className="h-full rounded-full bg-primary" 
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{module.progress}%</span>
                  </div>
                </div>
                
                {/* Bouton d'action */}
                {module.locked ? (
                  <div className="flex items-center justify-center rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                    <Lock className="mr-2 h-4 w-4" />
                    Terminez les modules précédents pour débloquer
                  </div>
                ) : (
                  <Link 
                    href={module.href}
                    className={cn(
                      "flex w-full items-center justify-center rounded-md p-3 text-sm font-medium transition-colors",
                      module.completed ? 
                        "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400" : 
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {module.completed ? "Revoir le module" : "Commencer le module"}
                  </Link>
                )}
                
                {/* Ligne de connexion horizontale */}
                <div 
                  className={cn(
                    "absolute top-1/2 hidden h-1 w-16 -translate-y-1/2 bg-muted md:block",
                    isLeft ? "left-full" : "right-full"
                  )}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
