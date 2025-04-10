// src/app/page.tsx
import { cookies } from "next/headers";
export const dynamic = "force-dynamic"; // Ajoute ça tout en haut

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";
import LandingHeroImage from "@/components/LandingHeroImage";
// Import components used by your Landing Page
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, LogIn } from "lucide-react";

// --- Landing Page Header Component ---
function LandingPageHeader({
  isLoggedIn,
  userRole,
}: {
  isLoggedIn: boolean;
  userRole: string | null;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">Expert Academy</span>
        </Link>
        <div className="flex-1"></div>
        <nav className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="transition-colors duration-200 hover:text-primary"
              >
                <Link
                  href={`/${userRole}/dashboard`}
                  className="flex items-center"
                >
                  <span>Mon tableau de bord</span>
                </Link>
              </Button>
              <form action="/auth/logout" method="post">
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="transition-colors duration-200"
                >
                  Déconnexion
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="transition-colors duration-200 hover:text-primary"
              >
                <Link href="/auth/login" className="flex items-center">
                  <LogIn className="mr-1 h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <Link href="/auth/register">Inscription</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

// --- Landing Page Content Component ---
function PublicLandingPage({
  isLoggedIn,
  userRole,
}: {
  isLoggedIn: boolean;
  userRole: string | null;
}) {
  const features = [
    {
      title: "Cours de qualité",
      description:
        "Accédez à des cours créés par des experts dans leur domaine.",
      icon: "🚀",
    },
    {
      title: "Apprentissage flexible",
      description: "Apprenez à votre rythme, où que vous soyez.",
      icon: "👨‍🏫",
    },
    {
      title: "Certification",
      description:
        "Obtenez des certifications reconnues dans votre domaine d'expertise.",
      icon: "🏆",
    },
    {
      title: "Portfolio de projets",
      description:
        "Construisez un portfolio impressionnant de projets tout au long de votre parcours.",
      icon: "💼",
    },
  ];

  // Simplifions le code en le réécrivant complètement
  return (
    <div className="flex min-h-screen flex-col">
      <LandingPageHeader isLoggedIn={isLoggedIn} userRole={userRole} />

      <main className="flex-1 bg-background">
        <section className="w-full overflow-hidden py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground text-balance">
                    Bienvenue sur Expert Academy
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl text-balance">
                    Votre plateforme d&apos;apprentissage en ligne pour
                    développer vos compétences
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button size="lg" asChild className="font-semibold">
                    <Link href="/auth/register">Commencer à apprendre</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/#features">Découvrir nos fonctionnalités</Link>
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center aspect-square max-h-[400px] xl:max-h-[550px]">
                <LandingHeroImage />
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                  Pourquoi choisir notre académie?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Notre approche complète de l&apos;enseignement vous garantit
                  des compétences pratiques et des connaissances théoriques.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="h-full text-center bg-card hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <CardHeader className="items-center">
                    <div className="text-5xl mb-3 p-3 bg-primary/10 rounded-full inline-flex">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                {isLoggedIn ? (
                  <>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                      Continuez votre parcours d&apos;apprentissage
                    </h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Accédez à votre tableau de bord pour reprendre vos cours
                      et suivre votre progression.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                      Prêt à commencer votre parcours?
                    </h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Rejoignez des milliers d&apos;apprenants qui ont
                      transformé leur carrière avec Expert Academy.
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                {isLoggedIn ? (
                  <Button size="lg" asChild className="font-semibold">
                    <Link href={`/${userRole}/dashboard`}>
                      Accéder à mon tableau de bord
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild className="font-semibold">
                      <Link href="/auth/register">
                        S&apos;inscrire maintenant
                      </Link>
                    </Button>
                    <Button variant="secondary" size="lg" asChild>
                      <Link href="/auth/login">Se connecter</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 border-t border-border/50 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Expert Academy. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Main Page Logic (Server Component) ---
export default async function Home() {
  const cookieStore = await cookies();

  try {
    const supabase = createServerComponentClient<Database>({
      cookies: () => cookieStore,
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const isLoggedIn = !!session?.user;
    const userRole = isLoggedIn
      ? session?.user?.user_metadata?.role || "student"
      : null;

    // Afficher la landing page pour tout le monde
    return <PublicLandingPage isLoggedIn={isLoggedIn} userRole={userRole} />;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error
    );

    // En cas d'erreur, afficher la landing page sans état de connexion
    return <PublicLandingPage isLoggedIn={false} userRole={null} />;
  }
}
