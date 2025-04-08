import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { MentorAvatar } from "@/components/ai/MentorAvatar";
import { nextjsBeginnerModule } from "@/lib/curriculum/nextjs-beginner";
export const dynamic = 'force-dynamic'

export type PageProps = {
  params: {
    moduleId: string;
    lessonId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export function generateMetadata({ params }: PageProps) {
  const { moduleId, lessonId } = params;
  const moduleData =
    moduleId === "nextjs-beginner" ? nextjsBeginnerModule : null;

  if (!moduleData) {
    return {
      title: "Module Not Found",
      description: "The requested module could not be found.",
    };
  }

  const lesson = moduleData.lessons.find((l) => l.id === lessonId);

  if (!lesson) {
    return {
      title: "Lesson Not Found",
      description: "The requested lesson could not be found.",
    };
  }

  return {
    title: `${lesson.title} - ${moduleData.title}`,
    description: lesson.description,
  };
}

export default function LessonPage({ params }: PageProps) {
  const { moduleId, lessonId } = params;

  const moduleData =
    moduleId === "nextjs-beginner" ? nextjsBeginnerModule : null;

  if (!moduleData) {
    notFound();
  }

  const lesson = moduleData.lessons.find((l) => l.id === lessonId);

  if (!lesson) {
    notFound();
  }

  const currentLessonIndex = moduleData.lessons.findIndex(
    (l) => l.id === lessonId
  );
  const previousLesson =
    currentLessonIndex > 0 ? moduleData.lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < moduleData.lessons.length - 1
      ? moduleData.lessons[currentLessonIndex + 1]
      : null;

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
                <Link
                  href={`/student/learn/${moduleId}`}
                  className="hover:text-foreground"
                >
                  {moduleData.title}
                </Link>
                <span>/</span>
                <span className="text-foreground">{lesson.title}</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold">{lesson.title}</h1>
              <p className="text-muted-foreground">{lesson.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {previousLesson && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/student/learn/${moduleId}/${previousLesson.id}`}
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
                      className="mr-1"
                    >
                      <path d="M15 18-6-6 6-6" />
                    </svg>
                    Précédent
                  </Link>
                </Button>
              )}
              {nextLesson && (
                <Button size="sm" asChild>
                  <Link href={`/student/learn/${moduleId}/${nextLesson.id}`}>
                    Suivant
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
                      <path d="M9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Théorie et pratique */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Théorie</CardTitle>
                  <CardDescription>
                    Durée estimée: {lesson.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose-custom max-w-none dark:text-white">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: markdownToHtml(lesson.content.theory),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exercice pratique</CardTitle>
                  <CardDescription>
                    Mettez en pratique ce que vous avez appris
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose-custom max-w-none dark:text-white">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: markdownToHtml(lesson.content.practice),
                      }}
                    />
                  </div>

                  {/* Éditeur de code pour les exercices */}
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Votre code</h3>
                    <MonacoEditor
                      defaultLanguage="javascript"
                      defaultValue="// Écrivez votre code ici"
                      height="300px"
                    />
                    <div className="flex justify-end mt-2">
                      <Button>Vérifier la solution</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quiz</CardTitle>
                  <CardDescription>Testez vos connaissances</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lesson.content.quiz.map((quizItem, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="font-medium">
                          {index + 1}. {quizItem.question}
                        </h3>
                        <div className="space-y-2">
                          {quizItem.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="radio"
                                id={`question-${index}-option-${optionIndex}`}
                                name={`question-${index}`}
                                className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                              />
                              <label
                                htmlFor={`question-${index}-option-${optionIndex}`}
                                className="text-sm"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end mt-4">
                      <Button>Soumettre les réponses</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar avec ressources et mentor */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Progression du module</span>
                        <span className="font-medium">
                          {currentLessonIndex + 1}/{moduleData.lessons.length}
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${
                              ((currentLessonIndex + 1) /
                                moduleData.lessons.length) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Temps estimé restant</span>
                        <span className="font-medium">1h 30m</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Votre mentor IA</CardTitle>
                  <CardDescription>
                    Besoin d&apos;aide? Votre mentor est là pour vous
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-4">
                  <MentorAvatar
                    name="Alex"
                    role="Expert Next.js"
                    avatarUrl="/mentor-avatar.png"
                    status="online"
                    onChat={() => console.log("Chat with mentor")}
                  />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Alex peut vous aider à comprendre les concepts difficiles
                      et à résoudre vos exercices.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Poser une question
                  </Button>
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
                    <li>
                      <a
                        href="https://github.com/vercel/next.js/tree/canary/examples"
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
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                        Exemples Next.js
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

// Fonction simple pour convertir le markdown en HTML
function markdownToHtml(markdown: string): string {
  const html = markdown
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^\- (.*$)/gm, "<li>$1</li>")
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>'
    )
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/^\s*(\n)?(.+)/gm, function (m) {
      return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|table|tr|th|td)/.test(m)
        ? m
        : "<p>" + m + "</p>";
    })
    .replace(/\n/g, "<br>");

  return html;
}
