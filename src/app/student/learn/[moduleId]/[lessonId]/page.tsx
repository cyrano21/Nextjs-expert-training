// src/app/student/learn/[moduleId]/[lessonId]/page.tsx

import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";

// Importer les fonctions du service et les types (Vérifiez les chemins)
import {
  getLessonWithNavigation,
  type LessonWithNavigation,
} from "@/lib/modules/lesson-service"; // Importe le type explicitement
import { ServerMDXRenderer } from "@/components/mdx/ServerMDXRenderer";
import { LessonNav } from "@/components/navigation/lesson-nav";
import { Badge } from "@/components/ui/badge";
import { getUserData } from "../../../../../lib/auth/helpers"; // Chemin relatif pour éviter les problèmes d'alias

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
  // Utilisation du type importé pour clarifier
  const lessonData: LessonWithNavigation | null = await getLessonWithNavigation(
    params.moduleId,
    params.lessonId
  );

  if (!lessonData) {
    return { title: "Leçon Introuvable | Next.js Nexus" };
  }

  return {
    // Accès correct aux propriétés
    title: `${lessonData.frontmatter.title || "Leçon sans titre"} | ${
      lessonData.moduleTitle || "Next.js Nexus"
    }`,
    description:
      lessonData.frontmatter.description ||
      `Apprenez ${
        lessonData.frontmatter.title || "ce sujet"
      } dans notre cours Next.js.`,
  };
}

// --- Composant Page (Server Component) ---
export default async function LessonPage({ params }: PageProps) {
  // 1. Vérification Authentification (Côté serveur)
  const userData = await getUserData();
  const userId = userData?.id;

  if (!userId) {
    const callbackUrl = encodeURIComponent(
      `/student/learn/${params.moduleId}/${params.lessonId}`
    );
    redirect(`/auth/login?callbackUrl=${callbackUrl}`);
  }

  // 2. Récupération des Données (Côté serveur - Utilise le type importé)
  const lessonData: LessonWithNavigation | null = await getLessonWithNavigation(
    params.moduleId,
    params.lessonId
  );

  // 3. Gérer le cas où la leçon n'est pas trouvée
  if (!lessonData) {
    console.log(`Lesson not found for ${params.moduleId}/${params.lessonId}`);
    notFound();
  }

  // 4. Extraire les données nécessaires (Maintenant correct car lessonData est typé)
  const {
    frontmatter,
    rawSource,
    moduleTitle,
    prevLesson,
    nextLesson,
    completionStatus,
    moduleId,
    lessonId,
  } = lessonData; // La déstructuration fonctionne car le type est correct

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
        {/* Correction de l'erreur de syntaxe potentielle (assurez-vous qu'il n'y a rien d'autre) */}
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
        {/* Utiliser ServerMDXRenderer avec la source brute */}
        <ServerMDXRenderer rawSource={rawSource} />
      </main>

      {/* Navigation de Leçon */}
      <LessonNav
        lessonId={lessonUniqueId}
        isCompleted={completionStatus.isCompleted}
        prevLessonUrl={prevUrl}
        nextLessonUrl={nextUrl}
        // Props de titre non nécessaires ici
      />
    </div>
  );
}
