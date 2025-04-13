// src/app/student/learn/[moduleId]/[lessonId]/page.tsx

import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react"; // Import CheckCircle

// --- Imports Logique & Données ---
import { getUserData } from "@/lib/auth/helpers"; // Utiliser l'alias si possible et que le fichier existe
import {
  getLessonWithNavigation,
  type LessonWithNavigation,
} from "@/lib/modules/lesson-service";

// --- Imports Composants ---
import ServerMDXRenderer from "@/components/mdx/ServerMDXRenderer";
// Importer le WRAPPER au lieu du composant LessonNav directement
import { LessonNavWrapper } from "@/components/navigation/lesson-nav-wrapper";
import { Badge } from "@/components/ui/badge";
// Importer d'autres composants UI si nécessaire (Alert, Skeleton sont utilisés dans ServerMDXRenderer)

interface PageProps {
  params: {
    moduleId: string;
    lessonId: string;
  };
}

// --- Génération des Métadonnées (Inchangée) ---
// --- generateMetadata ---
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // CORRECTION : Attendre params d'abord
  const awaitedParams = await params;
  const moduleId = awaitedParams.moduleId;
  const lessonId = awaitedParams.lessonId;

  try {
    // Passer les variables locales moduleId/lessonId
    const lessonData: LessonWithNavigation | null =
      await getLessonWithNavigation(moduleId, lessonId);

    if (!lessonData) {
      return { title: "Leçon Introuvable | Next.js Nexus" };
    }

    const title = lessonData.frontmatter.title || "Leçon sans titre";
    const description =
      lessonData.frontmatter.description || `Apprenez ${title}.`;
    return {
      title: `${title} | ${lessonData.moduleTitle || "Next.js Nexus"}`,
      description,
    };
  } catch (error) {
    console.error(`[Metadata Error - ${moduleId}/${lessonId}]:`, error);
    return {
      title: "Erreur Leçon",
      description: "Impossible de charger les métadonnées.",
    };
  }
}

// --- Composant Page (Server Component) ---
export default async function LessonPage({ params }: PageProps) {
  // Attendre les paramètres avant de les utiliser
  const awaitedParams = await params;
  const { moduleId, lessonId } = awaitedParams;

  // 1. Authentification (Serveur)
  const userData = await getUserData();
  const userId = userData?.id;
  if (!userId) {
    const callbackUrl = encodeURIComponent(
      `/student/learn/${moduleId}/${lessonId}`
    );
    redirect(`/auth/login?callbackUrl=${callbackUrl}`);
  }

  // 2. Récupération Données (Serveur)
  const lessonData: LessonWithNavigation | null = await getLessonWithNavigation(
    moduleId,
    lessonId
  );
  if (!lessonData) {
    notFound();
  }

  // 3. Extraction Données (Serveur)
  const {
    frontmatter,
    rawSource,
    moduleTitle,
    prevLesson,
    nextLesson,
    completionStatus,
  } = lessonData;

  const lessonUniqueId = `${moduleId}/${lessonId}`;
  const prevUrl = prevLesson
    ? `/student/learn/${moduleId}/${prevLesson.slug}`
    : null;
  const nextUrl = nextLesson
    ? `/student/learn/${moduleId}/${nextLesson.slug}`
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-6 pb-4 border-b">
        <nav className="text-sm text-muted-foreground mb-2">
          <Link href="/student/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          {" / "}
          <Link href="/student/roadmap" className="hover:text-primary">
            Roadmap
          </Link>
          {moduleTitle && ` / ${moduleTitle}`}
        </nav>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-1">
          {frontmatter?.title || "Leçon"}
        </h1>
        {frontmatter?.description && (
          <p className="mt-1 text-lg text-muted-foreground">
            {frontmatter.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
          {completionStatus.isCompleted && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
              <CheckCircle className="h-3.5 w-3.5" /> Terminé
            </span>
          )}
          {frontmatter?.estimatedTimeMinutes && (
            <span>~ {frontmatter.estimatedTimeMinutes} min</span>
          )}
          {frontmatter?.tags && frontmatter.tags.length > 0 && (
            <div className="flex gap-1.5">
              {frontmatter.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mb-8">
        {/* ServerMDXRenderer est un Client Component qui gère le rendu MDX */}
        <ServerMDXRenderer rawSource={rawSource} />
      </main>

      {/* Utilisation du Wrapper Client pour la navigation */}
      <footer className="mt-12 pt-6 border-t">
        <LessonNavWrapper
          lessonId={lessonUniqueId}
          isCompleted={completionStatus.isCompleted}
          prevLessonUrl={prevUrl}
          nextLessonUrl={nextUrl}
          // Note: Les titres prev/next ne sont plus passés ici car
          // LessonNavWrapper ne les utilise pas (et LessonNav non plus directement)
        />
      </footer>
    </div>
  );
}
