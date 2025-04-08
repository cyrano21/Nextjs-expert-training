import Link from "next/link";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoadmapPage() {
  // Données du parcours d'apprentissage
  const modules = [
    {
      id: 1,
      title: "Next.js Fundamentals",
      description: "Maîtrisez les bases de Next.js et de son écosystème",
      duration: "2 semaines",
      level: "Débutant",
      completed: true,
      lessons: [
        { id: 1, title: "Introduction à Next.js", completed: true },
        { id: 2, title: "Configuration et Structure de Projet", completed: true },
        { id: 3, title: "Routing avec App Router", completed: true },
        { id: 4, title: "Rendu Côté Serveur vs Côté Client", completed: false },
        { id: 5, title: "Data Fetching et Caching", completed: false },
      ],
    },
    {
      id: 2,
      title: "Styling et UI",
      description: "Créez des interfaces utilisateur modernes et réactives",
      duration: "2 semaines",
      level: "Débutant-Intermédiaire",
      completed: false,
      lessons: [
        { id: 1, title: "Tailwind CSS Fondamentaux", completed: true },
        { id: 2, title: "Composants UI Réutilisables", completed: false },
        { id: 3, title: "Animations et Transitions", completed: false },
        { id: 4, title: "Responsive Design", completed: false },
        { id: 5, title: "Thèmes et Mode Sombre", completed: false },
      ],
    },
    {
      id: 3,
      title: "Authentification et Autorisation",
      description: "Implémentez des systèmes d&apos;authentification sécurisés",
      duration: "2 semaines",
      level: "Intermédiaire",
      completed: false,
      lessons: [
        { id: 1, title: "Introduction à Supabase", completed: false },
        { id: 2, title: "Authentification avec Supabase", completed: false },
        { id: 3, title: "Gestion des Sessions", completed: false },
        { id: 4, title: "Contrôle d&apos;Accès et Autorisation", completed: false },
        { id: 5, title: "Sécurité des Applications Web", completed: false },
      ],
    },
    {
      id: 4,
      title: "API Routes et Backend",
      description: "Développez des API robustes et performantes",
      duration: "2 semaines",
      level: "Intermédiaire",
      completed: false,
      lessons: [
        { id: 1, title: "API Routes avec Next.js", completed: false },
        { id: 2, title: "Intégration de Bases de Données", completed: false },
        { id: 3, title: "Validation de Données", completed: false },
        { id: 4, title: "Gestion des Erreurs", completed: false },
        { id: 5, title: "Tests d&apos;API", completed: false },
      ],
    },
    {
      id: 5,
      title: "Déploiement et Performance",
      description: "Optimisez et déployez vos applications Next.js",
      duration: "2 semaines",
      level: "Avancé",
      completed: false,
      lessons: [
        { id: 1, title: "Déploiement sur Vercel", completed: false },
        { id: 2, title: "Optimisation des Images", completed: false },
        { id: 3, title: "Stratégies de Caching", completed: false },
        { id: 4, title: "Analyse de Performance", completed: false },
        { id: 5, title: "SEO et Métadonnées", completed: false },
      ],
    },
    {
      id: 6,
      title: "Projet Final",
      description: "Appliquez toutes vos connaissances dans un projet complet",
      duration: "4 semaines",
      level: "Avancé",
      completed: false,
      lessons: [
        { id: 1, title: "Planification et Architecture", completed: false },
        { id: 2, title: "Développement Frontend", completed: false },
        { id: 3, title: "Développement Backend", completed: false },
        { id: 4, title: "Tests et Débogage", completed: false },
        { id: 5, title: "Déploiement et Présentation", completed: false },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col gap-6">
          {/* En-tête de la feuille de route */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Feuille de Route d&apos;Apprentissage</h1>
            <p className="text-muted-foreground">
              Votre parcours pour devenir un expert Next.js certifié
            </p>
          </div>

          {/* Progression globale */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Progression Globale</h2>
                    <p className="text-sm text-muted-foreground">
                      Complétez tous les modules pour obtenir votre certification
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">15%</span>
                    <p className="text-sm text-muted-foreground">9/60 leçons complétées</p>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[15%] rounded-full bg-primary"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des modules */}
          <div className="flex flex-col gap-6">
            {modules.map((module) => (
              <Card key={module.id} className={module.completed ? "border-green-500" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                        {module.level}
                      </span>
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                        {module.duration}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {module.lessons.filter((lesson) => lesson.completed).length}/{module.lessons.length} leçons complétées
                    </div>
                    <div className="h-2 w-1/3 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${(module.lessons.filter((lesson) => lesson.completed).length / module.lessons.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              lesson.completed
                                ? "bg-green-500 text-white"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {lesson.completed ? (
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
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              lesson.id
                            )}
                          </div>
                          <span className={lesson.completed ? "text-muted-foreground line-through" : ""}>
                            {lesson.title}
                          </span>
                        </div>
                        <Button
                          variant={lesson.completed ? "outline" : "default"}
                          size="sm"
                          asChild
                        >
                          <Link href={`/student/learn/${module.id}/${lesson.id}`}>
                            {lesson.completed ? "Revoir" : "Commencer"}
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Certification */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Certification Next.js Expert</CardTitle>
              <CardDescription>
                Complétez tous les modules et réussissez l&apos;examen final pour obtenir votre certification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Statut: <span className="font-medium">En cours</span></p>
                  <p className="text-sm text-muted-foreground">
                    Estimé: 14 semaines pour compléter
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Examen Final (Verrouillé)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
