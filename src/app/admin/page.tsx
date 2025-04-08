'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Vous devez être connecté');
        router.push('/auth/login');
        return;
      }
      
      const userRole = session.user.user_metadata?.role;
      if (userRole !== 'admin') {
        toast.error('Accès non autorisé');
        router.push('/student/dashboard');
        return;
      }
      
      setIsAdmin(true);
      fetchStats();
    };
    
    checkAdminStatus();
  }, [router]);

  const fetchStats = async () => {
    try {
      // Récupérer le nombre total d'utilisateurs
      const { count: totalCount, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (totalError) throw totalError;
      
      // Récupérer le nombre d'enseignants
      const { count: teacherCount, error: teacherError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher');
        
      if (teacherError) throw teacherError;
      
      // Récupérer le nombre d'étudiants
      const { count: studentCount, error: studentError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');
        
      if (studentError) throw studentError;
      
      setUserCount(totalCount || 0);
      setTeacherCount(teacherCount || 0);
      setStudentCount(studentCount || 0);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      toast.error('Erreur lors de la récupération des statistiques');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">
          {isLoading ? 'Chargement...' : 'Vérification des droits d\'accès...'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{userCount}</CardTitle>
            <CardDescription>Utilisateurs totaux</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{teacherCount}</CardTitle>
            <CardDescription>Enseignants</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{studentCount}</CardTitle>
            <CardDescription>Étudiants</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <CardDescription>Gérez les rôles et les accès des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button className="w-full">Gérer les utilisateurs</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contenu pédagogique</CardTitle>
            <CardDescription>Gérez les cours et les modules de formation</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/teacher/content">
              <Button className="w-full">Gérer le contenu</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}