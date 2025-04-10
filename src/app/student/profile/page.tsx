import React from "react";
import { Header } from "@/components/navigation/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Award,
  Calendar,
  Clock,
  Download,
  FileText,
  Settings,
} from "lucide-react";
import { FallbackImg } from "@/components/ui/fallback-img";

export default function ProfilePage() {
  // Données simulées pour la page de profil
  const student = {
    name: "Thomas Dubois",
    email: "thomas.dubois@example.com",
    joinedDate: "15 janvier 2024",
    level: 3,
    totalPoints: 1250,
    completedLessons: 18,
    completedModules: 2,
    profileImage: "/avatars/student-1.png",
    bio: "Développeur web passionné par les technologies modernes. Je suis actuellement en train d'apprendre Next.js pour améliorer mes compétences en développement frontend.",
  };

  const certificates = [
    {
      id: "cert-1",
      title: "Next.js Fundamentals",
      issuedDate: "10 février 2024",
      imageUrl: "/certificates/nextjs-fundamentals.png",
    },
    {
      id: "cert-2",
      title: "Styling et UI",
      issuedDate: "5 mars 2024",
      imageUrl: "/certificates/styling-ui.png",
    },
  ];

  const achievements = [
    {
      id: "ach-1",
      title: "Premier pas",
      description: "Compléter votre première leçon",
      earnedDate: "16 janvier 2024",
      icon: <Award className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "ach-2",
      title: "Apprenti Next.js",
      description: 'Compléter le module "Next.js Fundamentals"',
      earnedDate: "10 février 2024",
      icon: <Award className="h-5 w-5 text-emerald-500" />,
    },
    {
      id: "ach-3",
      title: "Designer UI",
      description: 'Compléter le module "Styling et UI"',
      earnedDate: "5 mars 2024",
      icon: <Award className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: "ach-4",
      title: "Assiduité",
      description: "Se connecter 7 jours consécutifs",
      earnedDate: "22 janvier 2024",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "ach-5",
      title: "Marathonien",
      description: "Compléter 5 leçons en une journée",
      earnedDate: "28 janvier 2024",
      icon: <Clock className="h-5 w-5 text-purple-500" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Profil</h1>
              <p className="text-muted-foreground">
                Gérez votre profil et consultez vos accomplissements
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Sidebar avec informations de profil */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-3 text-center">
                  <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-background">
                    <FallbackImg
                      src={student.profileImage}
                      alt={student.name}
                      className="h-full w-full object-cover"
                      fallbackSrc="https://via.placeholder.com/100"
                    />
                  </div>
                  <CardTitle>{student.name}</CardTitle>
                  <CardDescription>{student.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted p-3 text-center">
                        <p className="text-sm text-muted-foreground">Niveau</p>
                        <p className="text-2xl font-bold">{student.level}</p>
                      </div>
                      <div className="rounded-lg bg-muted p-3 text-center">
                        <p className="text-sm text-muted-foreground">Points</p>
                        <p className="text-2xl font-bold">
                          {student.totalPoints}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Leçons complétées
                        </span>
                        <span className="font-medium">
                          {student.completedLessons}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Modules complétés
                        </span>
                        <span className="font-medium">
                          {student.completedModules}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Membre depuis
                        </span>
                        <span className="font-medium">
                          {student.joinedDate}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">
                        {student.bio}
                      </p>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Modifier le profil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contenu principal */}
            <div className="md:col-span-2">
              <Tabs defaultValue="achievements">
                <TabsList className="mb-6 grid w-full grid-cols-3">
                  <TabsTrigger value="achievements">
                    <Award className="mr-2 h-4 w-4" />
                    Accomplissements
                  </TabsTrigger>
                  <TabsTrigger value="certificates">
                    <FileText className="mr-2 h-4 w-4" />
                    Certificats
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </TabsTrigger>
                </TabsList>

                {/* Onglet Accomplissements */}
                <TabsContent value="achievements" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vos accomplissements</CardTitle>
                      <CardDescription>
                        Badges et récompenses que vous avez obtenus
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                              {achievement.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {achievement.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Obtenu le {achievement.earnedDate}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Certificats */}
                <TabsContent value="certificates" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vos certificats</CardTitle>
                      <CardDescription>
                        Certificats obtenus après avoir complété des modules
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {certificates.map((certificate) => (
                          <div
                            key={certificate.id}
                            className="flex flex-col items-center space-y-4 rounded-lg border p-6 sm:flex-row sm:space-x-6 sm:space-y-0"
                          >
                            <div className="h-32 w-48 overflow-hidden rounded-md border bg-muted">
                              <FallbackImg
                                src={certificate.imageUrl}
                                alt={certificate.title}
                                className="h-full w-full object-cover"
                                fallbackSrc="https://via.placeholder.com/300x200?text=Certificate"
                              />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                              <h3 className="text-lg font-medium">
                                {certificate.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Délivré le {certificate.issuedDate}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button size="sm" variant="outline">
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger
                                </Button>
                                <Button size="sm" variant="outline">
                                  Partager
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {certificates.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground/30" />
                            <h3 className="text-lg font-medium">
                              Aucun certificat pour le moment
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Complétez des modules pour obtenir des certificats
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Paramètres */}
                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres du compte</CardTitle>
                      <CardDescription>
                        Gérez vos préférences et paramètres de compte
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="mb-4 text-lg font-medium">
                            Informations personnelles
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label
                                htmlFor="profileName"
                                className="text-sm font-medium"
                              >
                                Nom
                              </label>
                              <input
                                id="profileName"
                                type="text"
                                className="w-full rounded-md border bg-background px-3 py-2"
                                defaultValue={student.name}
                                aria-label="Nom complet"
                                placeholder="Votre nom complet"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="profileEmail"
                                className="text-sm font-medium"
                              >
                                Email
                              </label>
                              <input
                                id="profileEmail"
                                type="email"
                                className="w-full rounded-md border bg-background px-3 py-2"
                                defaultValue={student.email}
                                aria-label="Adresse email"
                                placeholder="votre@email.com"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-4 text-lg font-medium">
                            Préférences
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  Notifications par email
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Recevoir des emails sur les nouveaux modules
                                  et mises à jour
                                </p>
                              </div>
                              <div className="h-6 w-11 rounded-full bg-muted p-1">
                                <div className="h-4 w-4 translate-x-5 rounded-full bg-primary"></div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Mode sombre</p>
                                <p className="text-sm text-muted-foreground">
                                  Activer le mode sombre pour l&apos;interface
                                </p>
                              </div>
                              <div className="h-6 w-11 rounded-full bg-muted p-1">
                                <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button>Enregistrer les modifications</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
