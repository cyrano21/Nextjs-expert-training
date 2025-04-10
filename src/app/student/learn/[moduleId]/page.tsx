import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { getAuthSession } from "@/lib/auth/authUtils";
import { getCourseBySlug } from "@/lib/courses/course-service";
import { modulesData } from "@/lib/data/modules";
import { Header } from "@/components/navigation/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  BookOpen,
  ChevronLeft,
  Clock,
  FileText,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import CourseLearnContent from "@/components/courses/CourseLearnContent";

export type Props = {
  params: {
    moduleId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function resolveParams(params: { moduleId: string }) {
  // Check if the moduleId is already a slug
  const existingModule = modulesData.find(m => m.slug === params.moduleId);
  if (existingModule) {
    return { moduleId: params.moduleId };
  }

  // If not a slug, try to find a matching module by id
  const moduleById = modulesData.find(m => m.id.toString() === params.moduleId);
  if (moduleById) {
    // Redirect to the slug version
    return { moduleId: moduleById.slug };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await resolveParams(params);

    if (!resolvedParams?.moduleId) {
      return {
        title: "Module non trouvé",
        description: "Le module demandé n'a pas été trouvé",
      };
    }

    const module = modulesData.find(m => m.slug === resolvedParams.moduleId);

    return {
      title: module?.title || "Module",
      description: module?.description || "Détails du module de formation",
    };
  } catch (error) {
    return {
      title: "Erreur de Module",
      description: "Impossible de charger les informations du module",
    };
  }
}

export default async function ModulePage({ params }: Props) {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  }

  const resolvedParams = await resolveParams(params);
  if (!resolvedParams) {
    notFound();
  }

  // If the original moduleId is different from the resolved slug, redirect
  if (params.moduleId !== resolvedParams.moduleId) {
    redirect(`/student/learn/${resolvedParams.moduleId}`);
  }

  const module = modulesData.find(m => m.slug === resolvedParams.moduleId);
  if (!module) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="mb-6 text-sm">
          <Link href="/student/roadmap" className="text-muted-foreground hover:text-primary transition-colors">
            Roadmap
          </Link>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold tracking-tight">
                {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{module.description}</p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">{module.level}</Badge>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{module.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {module.lessons.map((lesson, index) => (
              <Link 
                key={lesson.slug} 
                href={`/student/learn/modules/${module.slug}/${lesson.slug}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold group-hover:text-primary">
                      {`${index + 1}. ${lesson.title}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant={lesson.completed ? "default" : "outline"}
                        className="text-xs"
                      >
                        {lesson.completed ? "Terminé" : "Non Commencé"}
                      </Badge>
                      {lesson.estimatedTime && (
                        <div className="text-muted-foreground text-sm flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {lesson.estimatedTime} min
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
