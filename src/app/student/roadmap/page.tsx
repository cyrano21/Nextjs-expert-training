// src/app/student/roadmap/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Ajout CardContent
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  PlayCircle,
  Lock,
  Circle,
  ArrowRight,
  Award, // Pour la carte Certification éventuelle
  Clock, // Pour le temps estimé
  AreaChart, // Pour la progression globale
} from "lucide-react";
import { cn } from "@/lib/utils";
// Assurez-vous que ce chemin et les types sont corrects
import { modulesData, ModuleMetadata, LessonMetadata } from "@/lib/data/modules"; // Supposons que LessonMetadata existe

// Helper pour calculer la progression
const calculateProgress = (items: { completed: boolean }[]) => {
  if (!items || items.length === 0) return 0;
  const completedCount = items.filter(item => item.completed).length;
  return Math.round((completedCount / items.length) * 100);
};

// Fonction pour trouver la prochaine leçon (supposée correcte)
const findNextLesson = (modules: ModuleMetadata[]) => {
  const currentModule = modules.find(module => module.status !== 'locked' && !module.completed);
  if (!currentModule) return null;
  const nextLesson = currentModule.lessons.find(lesson => !lesson.completed);
  return nextLesson ? { module: currentModule, lesson: nextLesson } : null;
};

// --- Composant Leçon Amélioré ---
function RoadmapLessonItem({
  lesson,
  moduleSlug, // Slug du module parent pour l'URL
  isLocked,   // Le module parent est-il verrouillé ?
  isNextUp    // Est-ce la prochaine leçon ?
}: {
  lesson: LessonMetadata; // Utiliser le type importé
  moduleSlug: string;
  isLocked: boolean;
  isNextUp: boolean;
}) {
  const getIcon = () => {
    if (isLocked) return <Lock className="h-4 w-4 text-muted-foreground/50 shrink-0" />;
    if (lesson.completed) return <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />;
    if (isNextUp) return <PlayCircle className="h-4 w-4 text-primary shrink-0 animate-pulse" />; // Utiliser couleur primary
    return <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0" />;
  };

  // !! VÉRIFIER CETTE URL !! Doit correspondre à la structure de fichiers
  // Utilisez lesson.slug si vous avez un slug textuel pour les leçons
  const lessonUrl = `/student/learn/modules/${moduleSlug}/${lesson.slug ?? lesson.id}`; // Priorise slug si existant

  const buttonText = isLocked ? "Verrouillé" : lesson.completed ? "Revoir" : isNextUp ? "Commencer" : "Voir";
  const buttonVariant = isLocked ? "outline" : lesson.completed ? "ghost" : isNextUp ? "default" : "outline";

  return (
    <div className={cn(
        "flex items-center justify-between rounded-md border p-3 transition-colors",
        !isLocked && "hover:bg-muted/50",
        isLocked && "opacity-60 cursor-not-allowed bg-secondary/30",
        // Style renforcé pour isNextUp
        isNextUp && !isLocked && "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
    )}>
      <Link
        href={isLocked ? "#" : lessonUrl}
        aria-disabled={isLocked}
        tabIndex={isLocked ? -1 : undefined}
        className={cn("flex items-center gap-3 group flex-grow", isLocked ? "pointer-events-none" : "cursor-pointer")}
      >
        {getIcon()}
        <span className={cn(
          "text-sm truncate",
          lesson.completed ? "text-muted-foreground line-through" : "text-foreground",
          isNextUp && !isLocked && "font-semibold text-primary",
          isLocked && "text-muted-foreground"
        )}>
          {lesson.title}
        </span>
      </Link>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
         {/* Afficher temps estimé avec icône */}
         {lesson.estimatedTime && !isLocked && (
            <span className="hidden sm:flex items-center text-xs text-muted-foreground gap-1">
              <Clock className="h-3 w-3" />
              {lesson.estimatedTime} mins
            </span>
          )}
         <Button
           variant={buttonVariant}
           size="sm"
           asChild
           disabled={isLocked}
           className={cn(
               lesson.completed && !isLocked && "text-muted-foreground hover:text-primary",
               isLocked && "pointer-events-none" // Empêche clic
           )}
         >
           <Link href={isLocked ? "#" : lessonUrl} aria-disabled={isLocked} tabIndex={isLocked ? -1 : undefined}>
             {buttonText}
             {!lesson.completed && !isLocked && <ArrowRight className="ml-1.5 h-3 w-3" />}
           </Link>
         </Button>
      </div>
    </div>
  );
}

// --- Page Principale ---
export default async function RoadmapPage() { // Rendre la fonction async si besoin de fetch user data
  // TODO: Récupérer l'ID utilisateur et passer les vraies données de modules/progression
  // const userId = ...;
  // const userModulesData = await getUserRoadmapData(userId); // Fonction à créer
  const userModulesData = modulesData; // Utilisation des données statiques pour l'instant

  const nextLessonInfo = findNextLesson(userModulesData);
  const allLessons = userModulesData.flatMap(m => m.lessons);
  const globalCompletionPercent = calculateProgress(allLessons);
  const completedLessonsCount = allLessons.filter(l => l.completed).length;
  const totalLessonsCount = allLessons.length;

  const currentModule = userModulesData.find(m => m.status === 'in_progress' || (!m.completed && m.status === 'available'));
  const defaultOpenModule = currentModule ? [currentModule.moduleId] : [];


  return (
    // Assurez-vous que le layout parent fournit le Header si nécessaire
    <main className="flex-1 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-2">
             Votre Feuille de Route
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Suivez votre parcours personnalisé pour devenir un expert Next.js.
          </p>
        </div>

        {/* Progression Globale */}
         <Card className="mb-8 shadow-sm overflow-hidden border border-border">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                      <AreaChart className="h-5 w-5 text-primary"/>
                      Progression Globale
                  </h2>
                  <Progress value={globalCompletionPercent} className="w-full h-2.5" indicatorClassName="bg-gradient-to-r from-blue-400 to-primary" />
                </div>
                <div className="text-center sm:text-right flex-shrink-0 pt-2 sm:pt-0">
                  <span className="text-3xl font-bold text-primary tabular-nums">{globalCompletionPercent}%</span>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {completedLessonsCount} / {totalLessonsCount} leçons
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>


        {/* Carte Prochaine Leçon (si existante) */}
        {nextLessonInfo && (
          <Card className="mb-8 bg-primary/5 border-primary/20 shadow-sm group hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg text-primary mb-1">
                    <PlayCircle className="h-5 w-5 animate-pulse" />
                    Prochaine Étape
                  </CardTitle>
                  <CardDescription className="text-base text-foreground font-medium">
                    {nextLessonInfo.module.title} - {nextLessonInfo.lesson.title}
                  </CardDescription>
                </div>
                <Button
                  size="sm" // Taille ajustée
                  className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 shadow-sm hover:shadow-md"
                  asChild
                >
                  {/* Utiliser le slug pour le lien */}
                  <Link href={`/student/learn/modules/${nextLessonInfo.module.moduleId}/${nextLessonInfo.lesson.slug ?? nextLessonInfo.lesson.id}`}>
                    Commencer <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Liste des modules avec Accordéon */}
        <Accordion
          type="multiple"
          defaultValue={defaultOpenModule}
          className="w-full space-y-4"
        >
          {userModulesData.map((module) => {
            const moduleCompletionPercent = calculateProgress(module.lessons);
            const isLocked = module.status === 'locked';
            const isCompleted = module.status === 'completed';
            const isInProgress = module.status === 'in_progress';

            return (
              <AccordionItem
                key={module.id}
                value={module.moduleId} // Utiliser moduleId comme valeur
                className={cn(
                  "border rounded-lg overflow-hidden bg-card shadow-sm transition-opacity",
                  isLocked && "opacity-60 border-dashed cursor-not-allowed",
                  isCompleted && "border-green-200 dark:border-green-800/50" // Style module complété
                )}
                disabled={isLocked}
              >
                <AccordionTrigger className={cn(
                    "px-4 py-4 sm:px-6 text-left hover:bg-muted/50 text-base sm:text-lg font-semibold",
                    isLocked && "cursor-not-allowed hover:bg-transparent"
                )}>
                  <div className="flex items-center gap-3 w-full pr-2 sm:pr-4">
                    {/* Icône Statut Module */}
                    {isCompleted && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                    {isInProgress && <PlayCircle className="h-5 w-5 text-blue-500 shrink-0" />}
                    {isLocked && <Lock className="h-5 w-5 text-muted-foreground/60 shrink-0" />}
                    {!isCompleted && !isInProgress && !isLocked && <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0" />}

                    <span className={cn("flex-grow", isCompleted && "text-green-700 dark:text-green-400")}>{module.title}</span>

                    {/* Badges et Progression (droite) */}
                    <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                       <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1 text-xs">
                           <Clock className="h-3 w-3" /> {module.duration}
                       </Badge>
                       <Badge variant={isLocked ? "outline" : "secondary"} className="hidden lg:inline-flex text-xs">
                          {module.level}
                       </Badge>
                       {!isLocked && (
                         <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground w-16 justify-end tabular-nums">
                            <span>{moduleCompletionPercent}%</span>
                            {/* Mini barre de progression */}
                            <Progress value={moduleCompletionPercent} className="w-8 h-1.5" />
                         </div>
                       )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-0 pb-4 sm:px-6 border-t bg-background">
                  <p className="text-sm text-muted-foreground mt-4 mb-4">{module.description}</p>
                  <div className="grid gap-2">
                    {module.lessons.map((lesson) => (
                      <RoadmapLessonItem
                         key={lesson.id} // Utiliser un ID stable
                         lesson={lesson}
                         moduleSlug={module.moduleId} // Utiliser moduleId comme slug
                         isLocked={isLocked} // L'état verrouillé vient du module
                         isNextUp={
                           !!nextLessonInfo &&
                           nextLessonInfo.module.moduleId === module.moduleId &&
                           // Comparer par slug ou ID unique de la leçon
                           (nextLessonInfo.lesson.slug ?? String(nextLessonInfo.lesson.id)) === (lesson.slug ?? String(lesson.id))
                         }
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Certification */}
        {/* ... (Carte Certification comme avant) ... */}

      </div>
    </main>
  );
}