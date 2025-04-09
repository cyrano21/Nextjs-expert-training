'use client';

import Link from 'next/link';
import { getGreeting } from '@/utils/helpers';
import { fetchDashboardData } from '@/lib/data/student';
import { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { BookOpen, Code, Trophy, ArrowRight, MessageSquare, Activity, AlertTriangle } from 'lucide-react';

interface DashboardContentProps {
  userId: string;
  supabaseUrl: string;
  supabaseKey: string;
}

type DashboardData = Awaited<ReturnType<typeof fetchDashboardData>>;
type CommunityActivity = DashboardData['communityActivity'][number];

export default function DashboardContent({ userId, supabaseUrl, supabaseKey }: DashboardContentProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient<Database>(supabaseUrl, supabaseKey);
        const data = await fetchDashboardData(userId, supabase);
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, [userId, supabaseUrl, supabaseKey]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              No Dashboard Data
            </CardTitle>
            <CardDescription>
              Unable to retrieve your dashboard information. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { user, progress, nextLesson, currentProject, recentBadge, communityActivity } = dashboardData;
  const greeting = getGreeting();

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {greeting}, {user.name || 'Student'}!
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
          <span>Streak: <strong className='text-primary font-medium'>{progress.currentStreak} days 🔥</strong></span>
          <span className='hidden sm:inline'>•</span>
          <span>Points: <strong className='text-primary font-medium'>{progress.points?.toLocaleString() ?? 0} ✨</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {nextLesson ? (
          <Card className="flex flex-col border-primary/30 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5 text-sm">
                <BookOpen className="h-4 w-4" /> Next Up
              </CardDescription>
              <CardTitle className="text-lg line-clamp-2">{nextLesson.title}</CardTitle>
              <Badge variant="secondary">{nextLesson.course}</Badge>
            </CardHeader>
            <CardFooter>
              <Link href={`/learn/modules/${nextLesson.slug}`} passHref legacyBehavior>
                <Button className="w-full" size="sm">Start Lesson <ArrowRight className="ml-2 h-4 w-4" /></Button>
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

        {/* Current Project */}
        {currentProject && (
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5 text-sm">
                <Code className="h-4 w-4" /> Current Project
              </CardDescription>
              <CardTitle className="text-lg">{currentProject.title}</CardTitle>
              <Badge variant="outline">{currentProject.progress}% Complete</Badge>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <Progress value={currentProject.progress} />
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
            <CardFooter>
              <Link href={`/practice/projects/${currentProject.slug}`} passHref legacyBehavior>
                <Button className="w-full" size="sm" variant="secondary">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardFooter>
          </Card>
        )}

        {/* Progress & Badges */}
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-sm">
              <Trophy className="h-4 w-4 text-amber-500" /> Your Progress
            </CardDescription>
            <CardTitle className="text-lg">Achievements</CardTitle>
            {recentBadge ? (
              <Badge className='bg-amber-100 text-amber-800'>Latest: {recentBadge.name}</Badge>
            ) : <Badge variant="outline">No badges yet</Badge>}
          </CardHeader>
          <CardContent className="flex-grow">
            <Label className='text-xs text-muted-foreground'>Completion</Label>
            <div className='flex items-center gap-2 mt-1'>
              <Progress value={progress.overallCompletion} />
              <span className='text-xs'>{progress.overallCompletion}%</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/rewards/badges" passHref legacyBehavior>
              <Button variant="ghost" className="w-full text-sm">View All <ArrowRight className="ml-auto h-4 w-4" /></Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Daily Challenge */}
        <Card className="flex flex-col border-dashed border hover:shadow transition-all">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-sm">
              <Activity className="h-4 w-4" /> Quick Practice
            </CardDescription>
            <CardTitle className="text-lg">Daily Challenge</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">A small coding puzzle (coming soon)</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm" disabled>
              Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Community Activity */}
      {communityActivity.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" /> Community Buzz
          </h2>
          <Card>
            <CardContent className="p-4 space-y-2">
              {communityActivity.map((activity: CommunityActivity, index: number) => (
                <Link key={index} href={activity.slug} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                  <span className="text-sm text-foreground">{activity.text}</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
              <div className="pt-2">
                <Link href="/community/forum" passHref legacyBehavior>
                  <Button variant="link" className="p-0 text-sm">View All</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
