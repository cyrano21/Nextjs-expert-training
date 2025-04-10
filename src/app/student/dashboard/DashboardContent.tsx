"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // Importer le router

// Data fetching and types
import { fetchDashboardData } from "@/lib/data/student"; // Ajustez path
import { CourseMetadata } from "@/lib/data/courses"; // Assurez-vous que ce type existe et est correct
import { getGreeting } from "@/lib/utils/greeting"; // Ajustez path

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CourseCard } from "@/components/courses/CourseCard"; // Utilisez votre CourseCard dédié

// Icons
import {
  BookOpen,
  Target,
  ArrowRight,
  MessageSquare,
  Trophy,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Star,
  RefreshCw,
  Code,
  PlayCircle,
  ListChecks,
  Calendar,
  AreaChart,
} from "lucide-react";

// Ajout de l'import de cn manquant
import { cn } from "@/lib/utils";

// Types
interface DashboardContentProps {
  userId: string;
  initialUserName?: string | null;
}

type LessonItem = {
  title: string;
  moduleId: string;
  slug: string;
  description?: string;
};

type ProjectItem = {
  title: string;
  moduleId: string;
  slug: string;
  progress: number;
};

type CourseItem = {
  id: string;
  title: string;
  description?: string;
  progress: number;
  lastAccessDate?: string;
  moduleId: string;
  slug?: string;
  estimatedTimeMinutes?: number;
  level?: string;
};

type CommunityActivityItem = {
  type: string;
  text: string;
  moduleId: string;
  slug: string;
};

interface CompleteDataShape {
  user: {
    name: string;
    id: string;
  };
  progress: {
    points: number;
    currentStreak: number;
    overallCompletion: number;
  };
  nextLesson: LessonItem | null;
  currentProject: ProjectItem | null;
  recentBadge: { name: string; id: string } | null;
  communityActivity: CommunityActivityItem[];
  enrolledCourses: CourseItem[];
}

type DashboardData = CompleteDataShape | null;

// --- Skeletons avec les types React.FC pour corriger les erreurs "n'est pas un type d'élément JSX valide" ---
const GreetingSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 mb-8">
      <div className="h-8 w-64 bg-muted rounded"></div>
      <div className="h-4 w-40 bg-muted rounded"></div>
    </div>
  );
};

const CardSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="h-5 w-24 bg-muted rounded"></div>
      <div className="h-8 w-full bg-muted rounded"></div>
      <div className="h-4 w-2/3 bg-muted rounded"></div>
    </div>
  );
};

const CourseListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-32 bg-muted rounded"></div>
        <div className="h-8 w-20 bg-muted rounded"></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <div className="h-5 w-2/3 bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 w-20 bg-muted rounded"></div>
              <div className="h-4 w-16 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
export default function DashboardContent({
  userId,
  initialUserName,
}: DashboardContentProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialiser le router

  const greeting = getGreeting();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Obtenir les données brutes
      const rawData = await fetchDashboardData(userId);

      // Vérification plus complète de la structure des données
      if (
        rawData &&
        typeof rawData === "object" &&
        "user" in rawData &&
        rawData.user &&
        typeof rawData.user === "object" &&
        "name" in rawData.user &&
        "progress" in rawData &&
        "enrolledCourses" in rawData
      ) {
        // Ajouter l'ID manquant si nécessaire pour assurer la compatibilité avec CompleteDataShape
        const enhancedData = {
          ...rawData,
          user: {
            ...rawData.user,
            id: "id" in rawData.user ? rawData.user.id : userId, // Utiliser l'ID passé en prop si absent des données
          },
        };

        // Maintenant on peut faire la conversion de type en toute sécurité
        setDashboardData(enhancedData as unknown as CompleteDataShape);
      } else {
        throw new Error("Données incomplètes reçues du serveur");
      }
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError(
        err.message || "Unable to load dashboard information. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
        <GreetingSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
        </div>
        <CourseListSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton /> <CardSkeleton />
        </div>
      </div>
    );
  }

  // --- Render Error State ---
  if (error || !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Unable to load dashboard information. Please try again."}
          </AlertDescription>
          <Button variant="destructive" size="sm" onClick={loadData}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry Loading
          </Button>
        </Alert>
      </div>
    );
  }

  // --- Render Success State ---
  const {
    user,
    progress,
    nextLesson,
    currentProject,
    recentBadge,
    communityActivity,
    enrolledCourses,
  } = dashboardData as CompleteDataShape;
  const userName = user?.name || initialUserName || "Learner";
  const userPoints = progress?.points ?? 0;
  const userStreak = progress?.currentStreak ?? 0;
  const overallCompletion = progress?.overallCompletion ?? 0;

  const nextAction = nextLesson || currentProject;
  const nextActionType = nextLesson
    ? "lesson"
    : currentProject
    ? "project"
    : "explore";
  const nextActionTitle =
    nextLesson?.title || currentProject?.title || "Explore Courses";
  const nextActionSlug = nextLesson?.slug
    ? `/student/learn/modules/${nextLesson.moduleId}/${nextLesson.slug}`
    : currentProject?.slug
    ? `/student/practice/projects/${currentProject.slug}`
    : "/student/courses";
  const nextActionDescription =
    nextLesson?.description ||
    (currentProject
      ? `Continue working on the ${currentProject.title} project.`
      : "Find your next learning challenge.");
  const nextActionButtonText = nextLesson
    ? "Start Lesson"
    : currentProject
    ? "Continue Project"
    : "Explore Courses";
  const NextActionIcon = nextLesson
    ? PlayCircle
    : currentProject
    ? Code
    : BookOpen;

  const learningTimeThisWeek = "3.5";
  const learningTimeTrend = "+12%";
  const certificateCount = 0;

  return (
    <TooltipProvider delayDuration={300}>
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-gray-800 dark:text-gray-100">
                {greeting}, {userName}!{" "}
                <span className="inline-block animate-wiggle">👋</span>
              </h1>
              <p className="text-muted-foreground">
                Here's your learning snapshot for today.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4 shrink-0">
              <StatCard
                value={userStreak.toString()}
                label="Day Streak"
                icon={Sparkles}
                iconColor="text-amber-500"
                suffix="🔥"
              />
              <StatCard
                value={userPoints.toLocaleString()}
                label="Points"
                icon={Star}
                iconColor="text-yellow-500"
                suffix="✨"
              />
              <StatCard
                value={`${overallCompletion}%`}
                label="Overall Progress"
                icon={AreaChart}
                iconColor="text-green-500"
              />
            </div>
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gradient-to-br from-primary/80 via-primary to-blue-700 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-200 ease-out group overflow-hidden">
                <CardHeader>
                  <CardDescription className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80">
                    <Target className="h-4 w-4" /> Your Next Focus
                  </CardDescription>
                  <CardTitle className="text-xl lg:text-2xl line-clamp-2">
                    {nextActionTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary-foreground/90 line-clamp-2">
                    {nextActionDescription}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={nextActionSlug} passHref legacyBehavior>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto shadow hover:shadow-md bg-white text-primary hover:bg-gray-100"
                    >
                      <NextActionIcon className="mr-2 h-5 w-5" />{" "}
                      {nextActionButtonText}{" "}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Courses</h2>
                  <Link href="/student/courses" passHref legacyBehavior>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80"
                    >
                      View All <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                {enrolledCourses && enrolledCourses.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {enrolledCourses.slice(0, 4).map((course: CourseItem) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        progress={course.progress}
                        lastAccessDate={course.lastAccessDate}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed text-center py-10">
                    <CardContent>
                      <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground mb-4">
                        You haven't enrolled in any courses yet.
                      </p>
                      <Link href="/student/courses" passHref legacyBehavior>
                        <Button>Explore Courses</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </section>
            </div>
            <div className="space-y-6">
              <Card className="hover:shadow-md transition-shadow duration-200 ease-out">
                <CardHeader>
                  <CardDescription className="flex items-center gap-1.5 text-sm">
                    <Trophy className="h-4 w-4 text-amber-500" /> Achievements
                  </CardDescription>
                  <CardTitle className="text-lg">Badges & Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentBadge ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-sm border-amber-600 text-xs">
                        Latest: {recentBadge.name}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No badges earned yet. Keep learning!
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/rewards/badges" passHref legacyBehavior>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                    >
                      View All Badges <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="hover:shadow-md transition-shadow duration-200 ease-out">
                <CardHeader>
                  <CardDescription className="flex items-center gap-1.5 text-sm">
                    <MessageSquare className="h-4 w-4 text-purple-500" />{" "}
                    Community Buzz
                  </CardDescription>
                  <CardTitle className="text-lg">Latest Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {communityActivity && communityActivity.length > 0 ? (
                    <ul className="space-y-2">
                      {communityActivity
                        .slice(0, 3)
                        .map((activity: CommunityActivityItem, index) => (
                          <li key={index}>
                            <Link
                              href={
                                activity.slug ||
                                `/community/${activity.moduleId}`
                              }
                              className="group flex items-center gap-2 rounded p-1.5 text-sm hover:bg-muted/50 transition-colors"
                            >
                              <span className="truncate flex-grow text-muted-foreground group-hover:text-foreground">
                                {activity.text}
                              </span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground/50 shrink-0 group-hover:text-foreground/80 transition-colors" />
                            </Link>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent community updates.
                    </p>
                  )}
                </CardContent>
                {communityActivity && communityActivity.length > 0 && (
                  <CardFooter>
                    <Link href="/community/forum" passHref legacyBehavior>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground hover:text-primary justify-between"
                      >
                        Go to Community <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                )}
              </Card>
              <Card className="hover:shadow-md transition-shadow duration-200 ease-out">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="mr-2 h-5 w-5 text-indigo-500" />{" "}
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-6">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No upcoming live sessions or deadlines.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}

// --- Composant Helper pour les Stat Cards ---
interface StatCardProps {
  value: string;
  label: string;
  icon: React.ElementType;
  iconColor?: string;
  suffix?: string;
}

function StatCard({
  value,
  label,
  icon: Icon,
  iconColor = "text-muted-foreground",
  suffix,
}: StatCardProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-card border border-transparent hover:border-border hover:bg-muted/50 transition-colors">
      <Icon className={cn("h-5 w-5", iconColor)} aria-hidden="true" />
      <div>
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {value}
        </span>
        {suffix && (
          <span className="text-xs ml-0.5" aria-hidden="true">
            {suffix}
          </span>
        )}
        <span className="block text-xs text-muted-foreground leading-tight">
          {label}
        </span>
      </div>
    </div>
  );
}
