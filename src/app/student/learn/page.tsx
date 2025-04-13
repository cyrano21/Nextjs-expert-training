import React from "react";
import { Header } from "@/components/navigation/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, LucideBook } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllCourses } from "@/lib/courses/course-service";
import { getAuthSession } from "@/lib/auth/authUtils";
import { cn } from "@/lib/utils";
import styles from "./learn-page.module.css";
import { redirect } from "next/navigation";

// Type pour la progression utilisateur
interface UserProgressData {
  [courseId: string]: number; // ID du cours vers le pourcentage de progression
}

export const metadata = {
  title: "Apprentissage | Expert Academy",
  description: "Continuez votre parcours d'apprentissage sur Expert Academy",
};

// Composant pour la barre de progression
const ProgressBar = ({ value }: { value: number }) => {
  // Arrondir la valeur au multiple de 5 le plus proche
  const roundedValue = Math.round(value / 5) * 5;
  // Assurer que la valeur est entre 0 et 100
  const safeValue = Math.max(0, Math.min(100, roundedValue));

  return (
    <div className={cn("h-2 w-full bg-muted rounded-full overflow-hidden")}>
      <div
        className={cn(styles.progressBar, styles[`progress-${safeValue}`])}
      />
    </div>
  );
};

// Composant pour l'indicateur de progression en haut de carte
const CourseProgressIndicator = ({ value }: { value: number }) => {
  // Arrondir la valeur au multiple de 5 le plus proche
  const roundedValue = Math.round(value / 5) * 5;
  // Assurer que la valeur est entre 0 et 100
  const safeValue = Math.max(0, Math.min(100, roundedValue));

  return (
    <div
      className={cn(styles.progressIndicator, styles[`progress-${safeValue}`])}
    />
  );
};

export default async function LearnPage() {
  // Authentifier l'utilisateur avec la nouvelle méthode sécurisée
  const session = await getAuthSession("student");

  // Rediriger si l'utilisateur n'est pas authentifié
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/student/learn");
  }

  // Utiliser user après vérification que session n'est pas null
  const { user } = session;

  // Récupérer tous les cours disponibles
  const courses = await getAllCourses();

  // Récupérer la progression réelle de l'utilisateur
  const userProgress = await getUserProgress(user.id);

  // Trier les cours par niveau (débutant -> avancé)
  const sortedCourses = [...courses].sort((a, b) => {
    const levels = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    return (
      (levels[a.level as keyof typeof levels] || 0) -
      (levels[b.level as keyof typeof levels] || 0)
    );
  });

  // Filtrer les cours en cours avec une progression
  const inProgressCourses = sortedCourses.slice(0, 2).map((course) => {
    // Déterminer la progression du cours
    const progress = userProgress[course.id] ?? Math.floor(Math.random() * 100);

    return {
      ...course,
      progress,
      lastAccessDate: "Il y a 2 jours",
    };
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mon apprentissage</h1>
            <p className="text-muted-foreground mt-2">
              Continuez votre parcours d&apos;apprentissage ou commencez un
              nouveau cours
            </p>
          </div>

          {/* Section des cours en cours */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              Continuer l&apos;apprentissage
            </h2>

            {inProgressCourses.length > 0 ? (
              <div className={styles.courseContainer}>
                {inProgressCourses.map((course) => (
                  <Card key={course.id} className={styles.courseCard}>
                    <CourseProgressIndicator value={course.progress} />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {course.description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            course.level === "Beginner"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {course.level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.estimatedTimeMinutes} min</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Dernier accès: {course.lastAccessDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center mt-4">
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">
                            Progression: {course.progress}%
                          </div>
                          <ProgressBar value={course.progress} />
                        </div>
                        <Button asChild className="ml-4">
                          <Link href={`/student/learn/${course.moduleId}`}>
                            Continuer
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <LucideBook className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">Aucun cours en cours</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-6">
                    Commencez un cours pour le voir apparaître ici
                  </p>
                  <Button asChild>
                    <Link href="/student/courses">Explorer les cours</Link>
                  </Button>
                </div>
              </Card>
            )}
          </section>

          {/* Section des cours recommandés */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Cours recommandés</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedCourses.slice(0, 3).map((course) => (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge
                        variant={
                          course.level === "Beginner" ? "outline" : "secondary"
                        }
                      >
                        {course.level}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.estimatedTimeMinutes} min</span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Objectifs:</h4>
                      <ul className="text-sm space-y-1">
                        {course.objectives
                          .slice(0, 2)
                          .map((objective: string, index: number) => (
                            <li key={index} className="text-muted-foreground">
                              {objective}
                            </li>
                          ))}
                        {course.objectives.length > 2 && (
                          <li className="text-muted-foreground">...et plus</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button asChild className="w-full">
                      <Link href={`/student/learn/${course.moduleId}`}>
                        Commencer
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/**
 * Récupère la progression de l'utilisateur pour les différents cours
 * @returns Objet avec les ID de cours comme clés et les pourcentages de progression comme valeurs
 */
async function getUserProgress(userId: string): Promise<UserProgressData> {
  // Dans une implémentation réelle, vous feriez une requête à votre base de données
  // pour récupérer les données de progression de l'utilisateur
  console.log(`Fetching progress for user: ${userId}`);

  // Pour l'instant, nous retournons une structure vide typée
  return {};
}
