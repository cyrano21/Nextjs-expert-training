// src/app/student/dashboard/page.tsx

import { cookies } from 'next/headers'; // Importer cookies
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase'; // Assurez-vous que ce chemin est correct
import { getGreeting } from '@/utils/helpers';
import { getRedirectPathByRole } from '@/utils/roles'; // Assurez-vous que ce chemin est correct
// IMPORTANT: Replace this import with your actual data fetching logic
// import { getStudentDashboardData, StudentDashboardData } from '@/lib/data/student';

// Import UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Label } from '@/components/ui/label';
import { ArrowRight, BookOpen, Code, MessageSquare, Trophy, Activity } from 'lucide-react';
import { Suspense } from 'react';

// --- Interface StudentDashboardData ---
interface StudentDashboardData {
  user: { name: string | null };
  progress: { overallCompletion: number; currentStreak: number; points: number; };
  nextLesson: { title: string; slug: string; course: string; } | null;
  currentProject: { title: string; slug: string; progress: number; } | null;
  recentBadge: { name: string; id: string; } | null;
  communityActivity: { type: 'forum' | 'showcase'; text: string; slug: string; }[];
}

// --- Placeholder Data Fetching Function ---
// REMEMBER TO REPLACE WITH ACTUAL LOGIC
async function fetchDashboardData(userId: string): Promise<StudentDashboardData | null> {
  console.log(`SIMULATING fetchDashboardData for user: ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 700));
  try {
    const simulatedData: StudentDashboardData = {
      user: { name: 'Cyrano Student' },
      progress: { overallCompletion: 42, currentStreak: 3, points: 850 },
      nextLesson: { title: 'Understanding Server Components', slug: 'nextjs-advanced/01-server-components', course: 'Next.js Advanced' },
      currentProject: { title: 'Portfolio Site Enhancement', slug: 'portfolio-v2', progress: 65 },
      recentBadge: { name: 'CSS Wizard', id: 'css-mastery' },
      communityActivity: [
        { type: 'forum', text: 'Debating RSC vs Client Components for forms...', slug: 'forum/789' },
        { type: 'showcase', text: 'User JaneDoe shared a cool animation project!', slug: 'showcase/anim-proj-1' },
      ]
    };
    return simulatedData;
  } catch (error) {
    console.error("Error fetching student dashboard data:", error);
    return null;
  }
}

// --- Loading Skeleton Component ---
function DashboardLoadingSkeleton() {
    // ... (code du skeleton inchangé)
    return (
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-3/5 rounded-md" />
                <Skeleton className="h-5 w-2/5 rounded-md" />
            </div>
            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => ( // Adjust map count if grid changes
                    <Card key={i}>
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-4 w-1/3 rounded" />
                            <Skeleton className="h-6 w-4/5 rounded" />
                            <Skeleton className="h-5 w-1/4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-3/4 rounded mt-2" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-full rounded-md" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
             {/* Community Skeleton */}
             <div className="space-y-3 pt-4">
                  <Skeleton className="h-6 w-1/4 rounded" />
                  <Card>
                     <CardContent className="p-4 space-y-3">
                         <Skeleton className="h-5 w-full rounded" />
                         <Skeleton className="h-5 w-full rounded" />
                     </CardContent>
                  </Card>
             </div>
        </div>
    );
}

// --- Main Dashboard Page Component ---
export default async function StudentDashboardPage() {
  // **** CORRECTION : Appeler cookies() ici ****
  const cookieStore = cookies();

  // Créer le client Supabase APRÈS avoir appelé cookies()
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore
  });

  // Récupérer la session utilisateur
  console.log("Attempting to get session for /student/dashboard..."); // Log
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();

  if (sessionError) {
     console.error("Error getting user session for dashboard:", sessionError.message);
     // Rediriger vers login même en cas d'erreur de session ici, car on ne peut pas continuer
     redirect('/auth/login?message=Session error');
   }

  // Rediriger si pas d'utilisateur trouvé (double sécurité avec middleware)
  if (!user) {
    console.log("No user found for dashboard, redirecting to login."); // Log
    redirect('/auth/login?message=Authentication required');
  }

  // Vérifier le rôle utilisateur
  const userRole = user.user_metadata?.role ?? 'student';
  if (userRole !== 'student') {
    console.warn(`User ${user.id} with role ${userRole} accessed student dashboard. Redirecting.`);
    redirect(getRedirectPathByRole(userRole)); // Utiliser la logique de redirection par rôle
  }

  // Afficher le contenu via Suspense
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      {/* Passer userId au composant asynchrone */}
      <DashboardContent userId={user.id} />
    </Suspense>
  );
}


// --- Async Component for Content ---
// (Le code de DashboardContent reste le même que précédemment)
async function DashboardContent({ userId }: { userId: string }) {
  // **** NOTE IMPORTANTE **** : Si fetchDashboardData utilise AUSSI
  // createServerComponentClient à l'intérieur, assurez-vous qu'il
  // reçoit et utilise le cookieStore ou appelle cookies() lui-même.
  // Idéalement, passez le client Supabase déjà initialisé en argument
  // à fetchDashboardData si possible.
  const dashboardData = await fetchDashboardData(userId);

  // ... (le reste du code de DashboardContent reste inchangé) ...
    // Handle data fetching failure
  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
         <Card className="border-destructive/50 bg-destructive/10">
             <CardHeader>
                 <CardTitle className="text-destructive flex items-center gap-2">
                     <AlertTriangle /> Error Loading Dashboard
                 </CardTitle>
             </CardHeader>
             <CardContent>
                 <p className="text-destructive">We couldn&apos;t load your dashboard data at this time. Please try refreshing the page. If the problem persists, contact support.</p>
             </CardContent>
         </Card>
      </div>
    );
  }

  // Destructure data for easier use
  const {
      user: userData,
      progress,
      nextLesson,
      currentProject,
      recentBadge,
      communityActivity
  } = dashboardData;

  const greeting = getGreeting(); // "Good morning", "Good afternoon", etc.

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
          {greeting}, {userData.name || 'Student'}!
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
           <span>Streak: <strong className='text-primary font-medium'>{progress.currentStreak} days 🔥</strong></span>
           <span className='hidden sm:inline'>•</span>
           <span>Points: <strong className='text-primary font-medium'>{progress.points?.toLocaleString() ?? 0} ✨</strong></span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Next Lesson Card */}
        {nextLesson ? (
          <Card className="flex flex-col border-primary/30 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5 text-sm">
                <BookOpen className="h-4 w-4" /> Next Up
              </CardDescription>
              <CardTitle className="text-lg line-clamp-2">{nextLesson.title}</CardTitle>
              <Badge variant="secondary" className="w-fit">{nextLesson.course}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Placeholder for potential description */}
            </CardContent>
            <CardFooter>
              <Link href={`/learn/modules/${nextLesson.slug}`} passHref legacyBehavior>
                <Button className="w-full" variant="default" size="sm">
                  Start Lesson <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
            <Card className="flex flex-col items-center justify-center text-center bg-muted/50 border-dashed">
               <CardHeader>
                  <CardTitle className="text-lg text-muted-foreground">All Caught Up!</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className='text-sm text-muted-foreground'>Explore new courses or practice your skills.</p>
               </CardContent>
                <CardFooter>
                   <Link href="/learn/courses" passHref legacyBehavior>
                       <Button variant="outline" size="sm">Browse Courses</Button>
                   </Link>
               </CardFooter>
            </Card>
        )}

        {/* Current Project Card */}
        {currentProject ? (
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5 text-sm">
                <Code className="h-4 w-4" /> Current Project
              </CardDescription>
              <CardTitle className="text-lg line-clamp-2">{currentProject.title}</CardTitle>
              <Badge variant="outline">{currentProject.progress}% Complete</Badge>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <Progress value={currentProject.progress} className="w-full h-2" indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500" />
              <p className="text-xs text-muted-foreground">Keep building momentum!</p>
            </CardContent>
            <CardFooter>
              <Link href={`/practice/projects/${currentProject.slug}`} passHref legacyBehavior>
                <Button variant="secondary" className="w-full" size="sm">
                  Continue Project <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
             <Card className="flex flex-col items-center justify-center text-center bg-muted/50 border-dashed">
                <CardHeader>
                   <CardTitle className="text-lg text-muted-foreground">Start a Project</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className='text-sm text-muted-foreground'>Apply your knowledge by building something real.</p>
                </CardContent>
                 <CardFooter>
                    <Link href="/practice/projects" passHref legacyBehavior>
                        <Button variant="outline" size="sm">Explore Projects</Button>
                    </Link>
                </CardFooter>
             </Card>
        )}

        {/* Stats / Rewards Card */}
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-sm">
              <Trophy className="h-4 w-4 text-amber-500" /> Your Progress
            </CardDescription>
            <CardTitle className="text-lg">Achievements</CardTitle>
             <div className='flex flex-wrap gap-1.5 pt-1'>
                {recentBadge ? (
                    <Badge variant="default" className='bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'>
                       Latest: {recentBadge.name}
                    </Badge>
                ) : (
                   <Badge variant="outline">No badges yet</Badge>
                )}
             </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-xs text-muted-foreground mb-3">
                {recentBadge ? `You're doing great!` : "Complete modules and projects to earn badges!"}
             </p>
            <div>
                <Label className='text-xs text-muted-foreground font-medium'>Platform Completion</Label>
                <div className='flex items-center gap-2 mt-1'>
                   <Progress value={progress.overallCompletion} className="w-full h-1.5" />
                   <span className='text-xs font-semibold text-muted-foreground'>{progress.overallCompletion}%</span>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/rewards/badges" passHref legacyBehavior>
              <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                View All Rewards <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Optional: Quick Actions / Challenges Card (Add if needed) */}
         <Card className="flex flex-col border-dashed border-border/70 hover:border-primary/50 hover:shadow transition-all">
           <CardHeader>
             <CardDescription className="flex items-center gap-1.5 text-sm">
               <Activity className="h-4 w-4" /> Quick Practice
             </CardDescription>
             <CardTitle className="text-lg">Daily Challenge</CardTitle>
           </CardHeader>
           <CardContent className="flex-grow">
             <p className="text-sm text-muted-foreground">
                Sharpen your skills with a quick coding puzzle. (Coming soon!)
             </p>
           </CardContent>
           <CardFooter>
             {/* <Link href="/practice/challenges" passHref legacyBehavior> */}
               <Button variant="outline" className="w-full" size="sm" disabled>
                 Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
             {/* </Link> */}
           </CardFooter>
         </Card>

      </div>

      {/* Community Activity Section */}
      {communityActivity && communityActivity.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" /> Community Buzz
          </h2>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4 space-y-2"> {/* Reduced padding slightly */}
              {communityActivity.map((activity, index) => (
                <Link
                  href={activity.slug}
                  key={index}
                  className="flex items-center gap-3 rounded-md p-2 -m-1 transition-colors hover:bg-muted/50"
                >
                  {/* Optional Icon based on type */}
                  {/* {activity.type === 'forum' ? <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <Award className="h-4 w-4 text-muted-foreground flex-shrink-0" />} */}
                  <span className="text-sm truncate flex-grow text-foreground/90">{activity.text}</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Link>
              ))}
              <div className="pt-2">
                <Link href="/community/forum" passHref legacyBehavior>
                  <Button variant="link" className="p-0 h-auto text-sm font-medium">View all activity</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}