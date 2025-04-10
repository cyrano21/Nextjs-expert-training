import React from "react";
import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/auth/authUtils";
import { getModuleBySlug } from "@/lib/modules/module-service";

// Renommer les props pour utiliser slug au lieu de moduleId
export type PageProps = {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  
  if (!resolvedParams?.slug) {
    return {
      title: "Module non trouvé",
    };
  }

  const currentModule = await getModuleBySlug(resolvedParams.slug);

  if (!currentModule) {
    return {
      title: "Module non trouvé",
    };
  }

  return {
    title: currentModule.title,
    description: currentModule.description,
  };
}

export default async function ModulePage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  
  if (!resolvedParams?.slug) {
    return notFound();
  }

  // Vérifier l'authentification
  await getAuthSession("student");

  const currentModule = await getModuleBySlug(resolvedParams.slug);

  if (!currentModule) {
    return notFound();
  }

  return (
    <div>
      <h1>{currentModule.title}</h1>
      {/* Contenu du module */}
    </div>
  );
}
