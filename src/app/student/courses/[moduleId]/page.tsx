import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCourseBySlug } from "@/lib/courses/course-service";
import CourseContent from "@/components/courses/CourseContent";
import CourseHeader from "@/components/courses/CourseHeader";
import { getAuthSession } from "@/lib/auth/authUtils";
import { Button } from "@/components/ui/button";

type Props = {
  params: {
    slug: string;
  };
};

// Utiliser la nouvelle API pour générer les métadonnées
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Attendre les paramètres avant de les utiliser
    const resolvedParams = await Promise.resolve(params);

    if (!resolvedParams?.slug) {
      return {
        title: "Course Not Found",
        description: "The requested course could not be found",
      };
    }

    const course = await getCourseBySlug(resolvedParams.slug);

    if (!course) {
      return {
        title: "Course Not Found",
        description: "The requested course could not be found",
      };
    }

    return {
      title: `${course.title} | Expert Academy`,
      description: course.description,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error Loading Course",
      description: "An error occurred while loading the course",
    };
  }
}

export default async function CourseDetailPage({ params }: Props) {
  try {
    // Attendre les paramètres avant de les utiliser
    const resolvedParams = await Promise.resolve(params);

    if (!resolvedParams?.slug) {
      notFound();
    }

    // Vérifier l'authentification de l'utilisateur
    await getAuthSession("student");

    // Utiliser le slug résolu
    const course = await getCourseBySlug(resolvedParams.slug);

    if (!course) {
      notFound();
    }

    // Ajouter un lien vers la page d'apprentissage du cours
    return (
      <div className="container mx-auto px-4 py-8">
        <CourseHeader course={course} />
        <CourseContent course={course} />
        <div className="mt-6 flex space-x-4">
          <Button asChild>
            <Link href={`/student/learn/${course.slug}`}>
              Commencer l&apos;apprentissage
            </Link>
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering course page:", error);
    notFound();
  }
}
