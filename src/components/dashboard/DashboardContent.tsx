'use client';

import { useState, useEffect } from 'react';
import { CourseMetadata } from '@/lib/data/courses';
import { fetchDashboardData } from '@/lib/data/student';
import { getGreeting } from '@/lib/utils/greeting';

import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/courses/CourseCard';

// Icons
import { BookOpen, Target, ArrowRight, MessageSquare, Trophy, TrendingUp, AlertTriangle } from 'lucide-react';

// Types
interface DashboardContentProps {
  userId: string;
}

type DashboardData = Awaited<ReturnType<typeof fetchDashboardData>>;

export function DashboardContent({ 
  userId 
}: DashboardContentProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [courses, setCourses] = useState<CourseMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const greeting = dashboardData?.user.name 
    ? `Hello, ${dashboardData.user.name}` 
    : getGreeting();

  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {
        const dashData = await fetchDashboardData(userId);
        setDashboardData(dashData);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError('Unable to load dashboard information');
        setIsLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses', { 
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        const coursesData = await res.json();
        setCourses(coursesData);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };

    fetchDashboardInfo();
    fetchCourses();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 bg-red-50">
        <AlertTriangle className="mr-2 text-red-500" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{greeting}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-4">
            <BookOpen className="text-blue-500" />
            <div>
              <p className="font-semibold">Cours en cours</p>
              <p className="text-muted-foreground">{dashboardData?.inProgressCourses || 0}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Target className="text-green-500" />
            <div>
              <p className="font-semibold">Objectifs atteints</p>
              <p className="text-muted-foreground">{dashboardData?.completedCourses || 0}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Trophy className="text-yellow-500" />
            <div>
              <p className="font-semibold">Points de compétence</p>
              <p className="text-muted-foreground">{dashboardData?.skillPoints || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Vos cours</h3>
          <Button variant="outline" size="sm">
            Voir tous les cours <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Activité récente</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="text-purple-500" />
              <p>Vous avez terminé le module Next.js Basics</p>
            </div>
            <span className="text-sm text-muted-foreground">Il y a 2 jours</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-green-500" />
              <p>Progression dans le cours Typescript Avancé</p>
            </div>
            <span className="text-sm text-muted-foreground">Il y a 5 jours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
