// src/app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
export const dynamic = 'force-dynamic'; // Ajoute ça tout en haut

// **** REMOVED SupabaseClient from import ****
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// **** CORRECTED PATH assuming types are in src/types ****
import { Database } from '@/types/supabase'; // Changed path from database to supabase
import { getRedirectPathByRole } from '@/utils/roles';

// Import components used by your Landing Page
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, LogIn } from 'lucide-react';

// --- Landing Page Header Component ---
function LandingPageHeader() {
    // ... (code du header inchangé)
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Code className="h-6 w-6 text-primary" />
                    <span className="font-bold sm:inline-block">Next.js Nexus</span>
                </Link>
                <div className="flex-1"></div>
                <nav className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild className="transition-colors duration-200 hover:text-primary">
                        <Link href="/auth/login" className="flex items-center">
                             <LogIn className="mr-1 h-4 w-4 sm:mr-2" />
                            <span className='hidden sm:inline'>Login</span>
                        </Link>
                    </Button>
                    <Button size="sm" asChild className="transition-all duration-200 hover:scale-105 hover:shadow-md">
                        <Link href="/auth/sign-up">
                            Sign Up
                        </Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}

// --- Landing Page Content Component ---
function PublicLandingPage() {
    // ... (code du contenu de la landing page inchangé)
    const features = [
        { title: "Interactive Learning", description: "Learn Next.js through hands-on exercises and real-world projects", icon: "🚀" },
        { title: "Expert Mentorship", description: "Get guidance from industry professionals and AI-powered mentors", icon: "👨‍🏫" },
        { title: "Certification", description: "Earn a recognized certification to showcase your Next.js expertise", icon: "🏆" },
        { title: "Project Portfolio", description: "Build an impressive portfolio of Next.js projects during your journey", icon: "💼" },
    ];
    return (
        <div className="flex min-h-screen flex-col">
            <LandingPageHeader />
            <main className="flex-1 bg-background">
                 {/* Hero Section */}
                 <section className="w-full overflow-hidden py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background via-muted/20 to-background">
                     <div className="container px-4 md:px-6">
                         <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                             <div className="flex flex-col justify-center space-y-6">
                                 <div className="space-y-3">
                                     <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground text-balance">
                                         Become a Next.js Expert
                                     </h1>
                                     <p className="max-w-[600px] text-muted-foreground md:text-xl text-balance">
                                         Master the most powerful React framework with our comprehensive curriculum.
                                         From beginner to certified expert in weeks, not months.
                                     </p>
                                 </div>
                                 <div className="flex flex-col gap-3 min-[400px]:flex-row">
                                     <Button size="lg" asChild className="font-semibold" glow={true}>
                                         <Link href="/auth/sign-up">Start Learning Now</Link>
                                     </Button>
                                     <Button variant="outline" size="lg" asChild>
                                         <Link href="/#features">Explore Features</Link>
                                     </Button>
                                 </div>
                             </div>
                             <div className="relative flex items-center justify-center aspect-square max-h-[400px] xl:max-h-[550px]">
                                 <Image
                                     src="/images/landing-hero.svg" // Verify path in /public/images/
                                     alt="Next.js Learning Illustration"
                                     fill
                                     className="object-contain drop-shadow-lg"
                                     priority
                                 />
                             </div>
                         </div>
                     </div>
                 </section>
                  {/* Features Section */}
                  <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
                      <div className="container px-4 md:px-6">
                         <div className="flex flex-col items-center justify-center space-y-4 text-center">
                             <div className="space-y-2">
                                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                                     Why Choose Our Academy?
                                 </h2>
                                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                     Our comprehensive approach to teaching Next.js ensures you gain practical skills and theoretical knowledge.
                                 </p>
                             </div>
                         </div>
                         <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12">
                             {features.map((feature) => (
                                 <Card key={feature.title} className="h-full text-center bg-card hover:border-primary/30 hover:shadow-md transition-all">
                                     <CardHeader className="items-center">
                                         <div className="text-5xl mb-3 p-3 bg-primary/10 rounded-full inline-flex">{feature.icon}</div>
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
                  {/* CTA Section */}
                  <section className="w-full py-12 md:py-24 lg:py-32">
                      <div className="container px-4 md:px-6">
                         <div className="flex flex-col items-center justify-center space-y-4 text-center">
                             <div className="space-y-2">
                                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                                     Ready to Start Your Journey?
                                 </h2>
                                 <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                     Join thousands of developers who have transformed their careers with our Next.js Expert Academy.
                                 </p>
                             </div>
                             <div className="flex flex-col gap-3 min-[400px]:flex-row">
                                 <Button size="lg" asChild className="font-semibold" glow={true}>
                                     <Link href="/auth/sign-up">Sign Up Now</Link>
                                 </Button>
                                 <Button variant="secondary" size="lg" asChild>
                                     <Link href="/auth/login">Login</Link>
                                 </Button>
                             </div>
                         </div>
                      </div>
                  </section>
            </main>
             {/* Consistent Footer */}
             <footer className="w-full py-6 border-t border-border/50 bg-muted/50">
                 <div className="container px-4 md:px-6">
                     <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
                         <p className="text-center text-sm text-muted-foreground">
                             &copy; {new Date().getFullYear()} Next.js Nexus. All rights reserved.
                         </p>
                     </div>
                 </div>
             </footer>
        </div>
    );
}


// --- Main Page Logic (Server Component) ---
export default async function HomePage() {
    const cookieStore = cookies();

    // **** ADDED TYPE ANNOTATION using Database type ****
    const supabase = createServerComponentClient<Database>({ // Use generated types
        cookies: () => cookieStore
    });

    console.log("Attempting to get session...");
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error("Error getting session:", sessionError.message);
    }

    if (session) {
        const role = session.user.user_metadata?.role ?? 'student';
        const redirectPath = getRedirectPathByRole(role);
        console.log(`Session found for user ${session.user.id}, role ${role}. Redirecting to ${redirectPath}`);
        redirect(redirectPath);
    }

    console.log("No active session found. Rendering public landing page.");
    return <PublicLandingPage />;
}