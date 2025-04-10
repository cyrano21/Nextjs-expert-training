import { redirect } from "next/navigation";
import { modulesData } from "@/lib/data/modules";

export type Props = {
  params: {
    moduleId: string;
    lessonId: string;
  };
};

async function resolveParams(params: { moduleId: string; lessonId: string }) {
  // Check if the moduleId is already a slug
  const foundModule = modulesData.find((m) => m.slug === params.moduleId);
  if (foundModule) {
    const lesson = foundModule.lessons.find((l) => l.slug === params.lessonId);
    if (lesson) {
      return { moduleId: params.moduleId, lessonId: params.lessonId };
    }
  }

  // If not a slug, try to find a matching module by id
  const moduleById = modulesData.find(
    (m) => m.id.toString() === params.moduleId
  );
  if (moduleById) {
    const lesson = moduleById.lessons.find(
      (l) => l.id.toString() === params.lessonId
    );
    if (lesson) {
      // Redirect to the slug version
      return { moduleId: moduleById.slug, lessonId: lesson.slug };
    }
  }

  return null;
}

export default async function LessonCompatibilityPage({ params }: Props) {
  const resolvedParams = await resolveParams(params);

  if (!resolvedParams) {
    return redirect("/student/learn");
  }

  // Redirect to the new route with slug
  return redirect(
    `/student/learn/modules/${resolvedParams.moduleId}/${resolvedParams.lessonId}`
  );
}
