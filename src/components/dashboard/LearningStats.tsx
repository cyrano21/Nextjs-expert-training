import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, TrendingUp, Award, BookOpen } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DailyActivity {
  date: string;
  minutes: number;
}

interface WeeklyProgress {
  week: string;
  lessonsCompleted: number;
}

interface LearningStatsProps {
  totalTimeSpent: number; // en minutes
  streak: number;
  dailyActivity: DailyActivity[];
  weeklyProgress: WeeklyProgress[];
  className?: string;
}

export function LearningStats({
  totalTimeSpent,
  streak,
  dailyActivity,
  weeklyProgress,
  className
}: LearningStatsProps) {
  // Formatage du temps total
  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Trouver la valeur maximale pour le graphique d'activité
  const maxDailyActivity = Math.max(...dailyActivity.map(day => day.minutes), 30);
  const maxWeeklyProgress = Math.max(...weeklyProgress.map(week => week.lessonsCompleted), 3);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={cn("space-y-6", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Temps total d'apprentissage */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Temps total d&apos;apprentissage</CardDescription>
              <CardTitle className="text-2xl">{formatTimeSpent(totalTimeSpent)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>Cette semaine: {formatTimeSpent(dailyActivity.slice(-7).reduce((acc, day) => acc + day.minutes, 0))}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Série de jours consécutifs */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Série actuelle</CardDescription>
              <CardTitle className="text-2xl">{streak} jours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Continuez à apprendre pour maintenir votre série !</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leçons complétées */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Leçons complétées</CardDescription>
              <CardTitle className="text-2xl">{weeklyProgress.reduce((acc, week) => acc + week.lessonsCompleted, 0)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="mr-1 h-4 w-4" />
                <span>Cette semaine: {weeklyProgress.slice(-1)[0]?.lessonsCompleted || 0}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tendance d'apprentissage */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tendance d&apos;apprentissage</CardDescription>
              <CardTitle className="text-2xl">
                <TrendingUp className="inline h-6 w-6 text-green-500" />
                <span className="ml-1">En hausse</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Award className="mr-1 h-4 w-4" />
                <span>Vous êtes dans le top 20% des apprenants</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Graphique d'activité quotidienne */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Activité quotidienne</CardTitle>
              <CardDescription>
                Minutes d&apos;apprentissage par jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <div className="flex h-full items-end space-x-2">
                  {dailyActivity.slice(-14).map((day, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center">
                      <motion.div 
                        className="w-full rounded-t-sm bg-primary"
                        style={{ 
                          height: `${(day.minutes / maxDailyActivity) * 100}%`,
                          minHeight: day.minutes > 0 ? '4px' : '0'
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.minutes / maxDailyActivity) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      />
                      <div className="mt-2 w-full text-center text-xs text-muted-foreground">
                        {new Date(day.date).getDate()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Graphique de progression hebdomadaire */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Progression hebdomadaire</CardTitle>
              <CardDescription>
                Leçons complétées par semaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <div className="flex h-full items-end space-x-6">
                  {weeklyProgress.slice(-7).map((week, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center">
                      <motion.div 
                        className="relative w-full rounded-t-sm bg-primary"
                        style={{ height: `${(week.lessonsCompleted / maxWeeklyProgress) * 100}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(week.lessonsCompleted / maxWeeklyProgress) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        {week.lessonsCompleted > 0 && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                            {week.lessonsCompleted}
                          </div>
                        )}
                      </motion.div>
                      <div className="mt-2 w-full text-center text-xs text-muted-foreground">
                        {week.week}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
