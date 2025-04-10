import React from "react";
import { getAuthSession } from "@/lib/auth/authUtils";
import { Header } from "@/components/navigation/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AreaChart,
  BookOpen,
  Calendar,
  Clock,
  ListChecks,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getAllCourses } from "@/lib/courses/course-service";

export const metadata = {
  title: "Tableau de bord | Expert Academy",
  description: "Gérez votre apprentissage et suivez vos progrès",
};

export default async function StudentDashboard() {
  // S'assurer que l'utilisateur est authentifié comme étudiant
  const { user } = await getAuthSession("student");

  // Récupérer les cours pour l'étudiant
  const allCourses = await getAllCourses();
  const studentCourses = allCourses.slice(0, 3); // Simuler les cours de l'étudiant

  // Simuler des données de progression
  const progressData = studentCourses.map((course) => ({
    ...course,
    progress: Math.floor(Math.random() * 100),
    lastAccessDate: "Il y a 2 jours",
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground mt-2">
              Bienvenue {user.user_metadata?.name || "Étudiant"}, voici un
              aperçu de votre progression
            </p>
          </div>

          {/* Actions rapides */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Cours en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressData.length}</div>
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto text-sm text-muted-foreground"
                >
                  <Link href="/student/learn">Voir tous mes cours</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Ajout de cartes supplémentaires pour les actions rapides */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Feuille de route
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4 étapes</div>
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto text-sm text-muted-foreground"
                >
                  <Link href="/student/roadmap">Voir ma progression</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Certificats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto text-sm text-muted-foreground"
                >
                  <Link href="/student/certificates">Voir mes certificats</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Temps d&rsquo;apprentissage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">3.5</span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    heures cette semaine
                  </span>
                </div>
                <div className="mt-1">
                  <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    +12% vs semaine dernière
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Nouvelle carte pour la progression globale */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <AreaChart className="mr-2 h-5 w-5" /> Progression globale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    progressData.reduce(
                      (sum, course) => sum + course.progress,
                      0
                    ) / progressData.length
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Basé sur {progressData.length} cours
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Progression des cours */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Progression des cours</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/student/learn">Voir tout</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {progressData.map((course) => (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">
                        {course.title}
                      </CardTitle>
                      <span className="inline-flex h-6 items-center rounded-full bg-muted px-2 text-xs font-medium">
                        {course.level}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2 h-10">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progression</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {course.estimatedTimeMinutes} min
                      </div>
                      <div>Mis à jour {course.lastAccessDate}</div>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button asChild className="w-full">
                      <Link href={`/student/learn/${course.id}`}>
                        Continuer
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Calendrier et activités récentes */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" /> Événements à venir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    Aucun événement prévu
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Consultez votre emploi du temps pour voir les prochains
                    cours.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListChecks className="mr-2 h-5 w-5" /> Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">
                          {
                            [
                              "Module complété",
                              "Quiz réussi",
                              "Cours commencé",
                            ][i - 1]
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Il y a {i} jour{i > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
