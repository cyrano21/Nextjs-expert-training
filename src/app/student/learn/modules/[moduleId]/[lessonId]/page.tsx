// src/app/student/learn/modules/[moduleId]/[lessonId]/page.tsx
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

// --- Imports de Logique & Données ---
import { getAuthSession } from "@/lib/auth/authUtils";
import { getLessonWithNavigation } from "@/lib/modules/lesson-service";
import { getCompiledMdx, mdxComponents } from "@/lib/mdx";

// --- Imports de Composants ---
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Clock } from "lucide-react";
import {
  ChevronLeft,
  AlertTriangle,
  ListChecks,
  StickyNote,
} from "lucide-react";

// Créons le composant LessonNav qui est utilisé mais manquant
import React from "react";

interface LessonNavProps {
  lessonId: string;
  isCompleted: boolean;
  prevLessonUrl: string | null;
  nextLessonUrl: string | null;
}

const LessonNav: React.FC<LessonNavProps> = ({
  lessonId,
  isCompleted,
  prevLessonUrl,
  nextLessonUrl,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        {prevLessonUrl && (
          <Button variant="outline" asChild>
            <Link href={prevLessonUrl}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Leçon précédente
            </Link>
          </Button>
        )}
      </div>

      <div>
        <Button variant={isCompleted ? "outline" : "default"}>
          {isCompleted ? "Déjà terminé" : "Marquer comme terminé"}
        </Button>
      </div>

      <div>
        {nextLessonUrl && (
          <Button asChild>
            <Link href={nextLessonUrl}>
              Leçon suivante
              <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

// Pour le rendu client du MDX
import { MDXRemote } from "next-mdx-remote";

interface ClientMDXRendererProps {
  compiledSource: string;
  components: any;
  scope?: any;
  frontmatter?: any;
}

const ClientMDXRenderer: React.FC<ClientMDXRendererProps> = ({
  compiledSource,
  components,
  scope,
  frontmatter,
}) => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <MDXRemote
        compiledSource={compiledSource}
        components={components}
        scope={scope}
        frontmatter={frontmatter}
      />
    </div>
  );
};

// --- Props de la Page ---
interface PageProps {
  params: {
    moduleId: string;
    lessonId: string;
  };
}

// --- Génération des Métadonnées ---
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const lessonData = await getLessonWithNavigation(
      params.moduleId,
      params.lessonId
    );
    if (!lessonData?.lesson) {
      return { title: "Leçon Introuvable" };
    }
    return {
      title: `${lessonData.lesson.title} | Next.js Nexus`,
      description:
        lessonData.lesson.description ||
        `Apprenez ${lessonData.lesson.title} dans le module ${params.moduleId}.`,
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Erreur Leçon",
      description: "Impossible de charger les métadonnées.",
    };
  }
}

// --- Composant Page ---
export default async function LessonPage({ params }: PageProps) {
  const { moduleId, lessonId } = params;

  const session = await getAuthSession();
  if (!session?.user) {
    redirect(
      `/auth/login?callbackUrl=/student/learn/modules/${moduleId}/${lessonId}`
    );
  }
  const userId = session.user.id;

  let lessonData;
  let mdxSource = null;
  let isCompleted = false;
  let fetchError = null;

  try {
    lessonData = await getLessonWithNavigation(moduleId, lessonId);
    if (!lessonData?.lesson) {
      throw new Error("Lesson data not found.");
    }

    mdxSource = await getCompiledMdx(moduleId, lessonId);
    if (!mdxSource) {
      throw new Error("MDX content could not be compiled.");
    }
  } catch (error: any) {
    console.error(`Error loading lesson ${moduleId}/${lessonId}:`, error);
    fetchError =
      error.message || "An unknown error occurred while loading the lesson.";
  }

  if (fetchError || !lessonData?.lesson) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-lg">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Erreur de Chargement</AlertTitle>
            <AlertDescription>
              Impossible de charger le contenu de cette leçon (
              {fetchError || "Leçon introuvable"}). Veuillez réessayer ou
              contacter le support si le problème persiste.
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/student/dashboard">
                    Retour au Tableau de Bord
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const { lesson, prevLesson, nextLesson } = lessonData;
  const { compiledSource, frontmatter, scope } = mdxSource || {};
  const lessonFullId = `${moduleId}/${lessonId}`;

  const prevLessonUrl = prevLesson
    ? `/student/learn/modules/${moduleId}/${prevLesson.slug}`
    : null;
  const nextLessonUrl = nextLesson
    ? `/student/learn/modules/${moduleId}/${nextLesson.slug}`
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="mb-6 text-sm">
          <Link
            href="/student/roadmap"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Roadmap
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <article className="lg:col-span-3 space-y-6">
            <header className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-lg text-muted-foreground">
                  {lesson.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                {lesson.estimatedTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> Environ {lesson.estimatedTime}{" "}
                    min
                  </span>
                )}
              </div>
            </header>

            <hr className="my-6" />

            {compiledSource ? (
              <ClientMDXRenderer
                compiledSource={compiledSource}
                components={mdxComponents}
                scope={scope}
                frontmatter={frontmatter}
              />
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}
          </article>

          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 self-start">
            {lesson.objectives && lesson.objectives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-blue-500" /> Dans cette
                    Leçon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside marker:text-blue-400">
                    {lesson.objectives.map((objective, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {objective}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <StickyNote className="h-5 w-5 text-yellow-500" /> Vos Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  (Fonctionnalité à venir pour prendre des notes sur la leçon)
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
        <footer className="mt-12 border-t pt-8">
          <LessonNav
            lessonId={lessonFullId}
            isCompleted={isCompleted}
            prevLessonUrl={prevLessonUrl}
            nextLessonUrl={nextLessonUrl}
          />
        </footer>
      </main>
    </div>
  );
}
