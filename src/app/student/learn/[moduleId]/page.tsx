import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession, getLessonWithNavigation } from "@/lib/actions";
import { Clock } from "lucide-react";

interface PageProps {
  params: {
    moduleId: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    // Use a default lessonId, typically the first lesson of the module
    const moduleData = await getLessonWithNavigation(params.moduleId, 'lesson-1');

    if (!moduleData) {
      return {
        title: "Module introuvable",
        description: "Ce module n'existe pas ou a été supprimé.",
      };
    }

    const moduleInfo = moduleData;

    return {
      title: `${moduleInfo.moduleTitle || "Module"} | Expert Academy`,
      description: "Module de formation Expert Academy",
    };
  } catch {
    return {
      title: "Erreur de chargement",
      description: "Impossible de charger les informations du module",
    };
  }
}

export default async function ModulePage({ params }: PageProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/student/learn/${params.moduleId}`);
  }

  let moduleData;

  try {
    // Use a default lessonId, typically the first lesson of the module
    moduleData = await getLessonWithNavigation(params.moduleId, 'lesson-1');

    if (!moduleData) {
      return (
        <div className="container mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">Module introuvable</h1>
          <p>Ce module n&apos;existe pas ou a été supprimé.</p>
          <div className="mt-8">
            <Link
              href="/student/dashboard"
              className="text-blue-500 hover:underline"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      );
    }

    // Use moduleData directly instead of moduleData.module
    const moduleInfo = moduleData;

    // For this mock data, we'll create a lessons array
    const lessons = [
      {
        title: moduleData.frontmatter.title,
        description: moduleData.frontmatter.description,
        slug: moduleData.lessonId,
      },
    ];

    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Link
            href="/student/dashboard"
            className="text-blue-500 hover:underline inline-flex items-center gap-1"
          >
            ← Retour au tableau de bord
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {moduleInfo.moduleTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Module de formation
          </p>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Clock className="mr-2 h-4 w-4" />
            <span>{lessons.length} leçons</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Contenu du module</h2>

          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0"
              >
                <Link
                  href={`/student/learn/${params.moduleId}/${lesson.slug}`}
                  className="group flex items-start p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <div className="flex-grow">
                    <h3 className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {index + 1}. {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {lesson.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("Erreur lors du chargement du module:", err);

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Erreur de chargement</h1>
        <p>Une erreur s&apos;est produite lors du chargement du module.</p>
        <div className="mt-8">
          <Link
            href="/student/dashboard"
            className="text-blue-500 hover:underline"
          >
            Retour au tableau de bord
          </Link>
          <p>Une erreur s&apos;est produite lors du chargement du module.</p>
        </div>
      </div>
    );
  }
}
