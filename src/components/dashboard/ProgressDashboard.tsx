import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

interface ModuleProgress {
  id: string;
  title: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastAccessedAt?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  icon: React.ReactNode;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  moduleTitle: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface ProgressDashboardProps {
  studentName: string;
  totalPoints: number;
  level: number;
  moduleProgress: ModuleProgress[];
  achievements: Achievement[];
  upcomingDeadlines: UpcomingDeadline[];
  className?: string;
}

export function ProgressDashboard({
  studentName,
  totalPoints,
  level,
  moduleProgress,
  achievements,
  upcomingDeadlines,
  className
}: ProgressDashboardProps) {
  // Calcul du progrès global
  const overallProgress = moduleProgress.length > 0
    ? moduleProgress.reduce((acc, module) => acc + module.progress, 0) / moduleProgress.length
    : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className={cn("space-y-6", className)}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* En-tête du tableau de bord */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Bienvenue, {studentName}</CardTitle>
            <CardDescription>
              Voici un aperçu de votre progression dans le parcours Next.js Expert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progression globale</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={overallProgress} className="h-2 w-24" />
                    <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-amber-500/10 p-2 rounded-full">
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points</p>
                  <p className="text-lg font-medium">{totalPoints}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-500/10 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Niveau</p>
                  <p className="text-lg font-medium">{level}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progression des modules */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Vos modules en cours</CardTitle>
            <CardDescription>
              Continuez votre apprentissage là où vous vous êtes arrêté
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleProgress.map((module, index) => (
                <motion.div 
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/student/learn/${module.id}`} className="block">
                    <div className="p-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {module.title}
                        </h3>
                        <Badge variant="outline">
                          {module.lessonsCompleted}/{module.totalLessons} leçons
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progression</span>
                          <span className="font-medium">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                        {module.lastAccessedAt && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Dernière activité: {module.lastAccessedAt}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {moduleProgress.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Vous n&apos;avez pas encore commencé de modules.</p>
                  <Link href="/student/roadmap" className="text-primary hover:underline mt-2 inline-block">
                    Découvrir les modules disponibles
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Échéances à venir */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Échéances à venir</CardTitle>
              <CardDescription>
                Ne manquez pas ces dates importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-start space-x-3">
                    <div className={cn(
                      "flex-shrink-0 w-2 h-2 mt-2 rounded-full",
                      deadline.priority === 'high' && "bg-red-500",
                      deadline.priority === 'medium' && "bg-amber-500",
                      deadline.priority === 'low' && "bg-green-500"
                    )} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{deadline.title}</p>
                        <Badge variant={
                          deadline.priority === 'high' ? "destructive" : 
                          deadline.priority === 'medium' ? "default" : 
                          "outline"
                        }>
                          {deadline.priority === 'high' ? "Urgent" : 
                           deadline.priority === 'medium' ? "Important" : 
                           "Normal"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{deadline.moduleTitle}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        <span>Échéance: {deadline.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {upcomingDeadlines.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Aucune échéance à venir pour le moment.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Réussites récentes */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Réussites récentes</CardTitle>
              <CardDescription>
                Vos dernières réalisations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div 
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {achievement.icon || <Award className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Obtenu le {achievement.earnedAt}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {achievements.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Vous n&apos;avez pas encore obtenu de réussites.</p>
                    <p className="text-sm">Continuez votre apprentissage pour débloquer des récompenses !</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
