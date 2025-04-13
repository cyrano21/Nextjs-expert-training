// src/app/student/learn/modules/[moduleId]/page.tsx
import React from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

// --- Imports UI ---
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// --- Imports Logique/Données ---
import { getUserData } from "@/lib/auth/helpers"; // Utiliser notre helper standard
import {
  getModuleBySlug,
  type ModuleBasicInfo,
} from "@/lib/modules/module-service"; // Importer la nouvelle fonction/type

export type PageProps = {
  params: { moduleId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Utiliser directement params après await implicite
  const moduleId = params.moduleId;
  if (!moduleId) {
    return { title: "Module" };
  } // Fallback simple

  try {
    const currentModule = await getModuleBySlug(moduleId);
    if (!currentModule) {
      return { title: "Module Introuvable | Next.js Nexus" };
    }
    return {
      title: `${currentModule.title} | Module | Next.js Nexus`,
      description: currentModule.description,
    };
  } catch (error) {
    console.error(`Metadata error for module ${moduleId}:`, error);
    return { title: "Erreur Module" };
  }
}

export default async function ModulePage({ params }: PageProps) {
  // Utiliser directement params
  const { moduleId } = params;
  if (!moduleId) {
    notFound();
  }

  // Vérifier l'authentification
  const userData = await getUserData(); // Utiliser le helper standard
  if (!userData?.id) {
    // Rediriger vers login si nécessaire pour accéder aux modules
    redirect(`/auth/login?callbackUrl=/student/learn/modules/${moduleId}`);
  }

  // Récupérer les données du module
  const currentModule = await getModuleBySlug(moduleId);
  if (!currentModule) {
    notFound();
  }

  // TODO: Récupérer la liste des leçons et la progression si nécessaire pour affichage
  // const lessonsList = await getLessonsForModule(moduleId, userData.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="mb-6">
        <Link
          href="/student/roadmap"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Retour à la Roadmap
        </Link>
      </nav>

      <Card>
        <CardHeader>
          {currentModule.level && (
            <Badge variant="outline" className="mb-2">
              {currentModule.level}
            </Badge>
          )}
          <CardTitle className="text-2xl lg:text-3xl">
            {currentModule.title}
          </CardTitle>
          <CardDescription className="mt-1">
            {currentModule.description}
          </CardDescription>
          {/* TODO: Ajouter barre de progression ici */}
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Leçons</h3>
          {/* TODO: Lister les leçons ici */}
          <div className="p-6 border rounded-md border-dashed text-center text-muted-foreground">
            <p>(Liste des leçons à venir ici...)</p>
            <p className="text-xs mt-2">
              Implémentez `getModuleLessons` pour les afficher.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
