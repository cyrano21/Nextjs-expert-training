import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AchievementCardProps {
  title: string;
  description: string;
  date: string;
  type: 'badge' | 'certificate' | 'trophy';
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  className?: string;
}

export function AchievementCard({
  title,
  description,
  date,
  type,
  level = 'bronze',
  className,
}: AchievementCardProps) {
  const levelColors = {
    bronze: 'bg-amber-600',
    silver: 'bg-slate-400',
    gold: 'bg-amber-400',
    platinum: 'bg-indigo-300',
  };

  const iconMap = {
    badge: Award,
    certificate: Calendar,
    trophy: Trophy,
  };

  const Icon = iconMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", levelColors[level])}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <div className="space-y-1">
          <h3 className="font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center pt-2 text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>
      </div>
      
      {/* Effet de brillance sur hover */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
