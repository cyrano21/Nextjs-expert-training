import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LessonNav } from "@/components/navigation/lesson-nav";

// Import des données de curriculum (à remplacer par des appels API)
import { nextjsBeginnerModule } from "@/lib/curriculum/nextjs-beginner";
type PageProps = {
  params: {
    moduleId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

const modules = [
  nextjsBeginnerModule,
  // Ajoutez d'autres modules ici
];

export default async function ModulePage({ params }: PageProps) {
  const { moduleId } = params;

  // Récupération des données du module
  // Dans une application réelle, ces données viendraient d'une API
  const currentModule = modules.find((m) => m.id === moduleId);

  if (!currentModule) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col gap-6">
          {/* Fil d'Ariane et navigation */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  href="/student/dashboard"
                  className="hover:text-foreground"
                >
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/student/roadmap" className="hover:text-foreground">
                  Roadmap
                </Link>
                <span>/</span>
                <span className="text-foreground">{currentModule.title}</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold">{currentModule.title}</h1>
              <p className="text-muted-foreground">
                {currentModule.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" asChild>
                <Link
                  href={`/student/learn/${moduleId}/${currentModule.lessons[0].id}`}
                >
                  Commencer
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Informations du module */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>À propos de ce module</CardTitle>
                  <CardDescription>
                    Durée estimée: {currentModule.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentModule.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Niveau</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {currentModule.level === "Débutant" && (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20">
                            Débutant
                          </span>
                        )}
                        {currentModule.level === "Intermédiaire" && (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
                            Intermédiaire
                          </span>
                        )}
                        {currentModule.level === "Avancé" && (
                          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-500/20">
                            Avancé
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {currentModule.prerequisites.length > 0 && (
                    <div>
                      <h3 className="font-medium">Prérequis</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                        {currentModule.prerequisites.map(
                          (prerequisite, index) => (
                            <li key={index}>{prerequisite}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium">
                      Objectifs d&apos;apprentissage
                    </h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      {currentModule.outcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contenu du module</CardTitle>
                  <CardDescription>
                    {currentModule.lessons.length} leçons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentModule.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm">
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {lesson.description}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link
                      href={`/student/learn/${moduleId}/${currentModule.lessons[0].id}`}
                    >
                      Commencer le module
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar avec navigation et progression */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <LessonNav
                    moduleId={moduleId}
                    lessons={currentModule.lessons}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Votre progression</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Progression du module</span>
                      <span className="font-medium">
                        0/{currentModule.lessons.length}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `0%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Temps estimé</span>
                      <span className="font-medium">
                        {currentModule.duration}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/student/roadmap">
                        Retour à la feuille de route
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ressources supplémentaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="https://nextjs.org/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Documentation officielle Next.js
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://nextjs.org/learn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        Tutoriel Next.js
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
