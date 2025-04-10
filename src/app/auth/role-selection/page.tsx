'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getRedirectPathByRole } from '@/utils/roles';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Vous devez être connecté');
        router.push('/auth/login');
        return;
      }
      
      // Vérifier si l'utilisateur a déjà un rôle
      if (session.user.user_metadata?.role) {
        const role = session.user.user_metadata.role;
        router.push(getRedirectPathByRole(role));
        return;
      }
      
      setUserEmail(session.user.email || null);
      
      // Vérifier si l'utilisateur est un administrateur autorisé
      if (session.user.email) {
        const { data, error } = await supabase
          .from('admin_emails')
          .select('*')
          .eq('email', session.user.email)
          .single();
          
        if (data) {
          setIsAdmin(true);
          console.log('Utilisateur administrateur détecté:', session.user.email);
        } else if (error) {
          console.log('Erreur de vérification admin:', error.message);
        } else {
          console.log('Utilisateur standard détecté:', session.user.email);
        }
      }
    };
    
    checkSession();
  }, [router]);

  const handleRoleSubmit = async () => {
    if (!userEmail) return;
    
    setIsSubmitting(true);
    try {
      // Mettre à jour le rôle de l'utilisateur dans les métadonnées
      const { error: authError } = await supabase.auth.updateUser({
        data: { role: selectedRole }
      });

      if (authError) {
        console.error('Erreur lors de la mise à jour du rôle:', authError);
        toast.error('Erreur lors de la mise à jour du rôle');
        return;
      }

      // Mettre à jour le profil dans la table profiles
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error fetching user:', error.message);
        toast.error('Erreur lors de la récupération de l\'utilisateur');
        return;
      }
      
      if (user) {
        const handleRoleSelection = async () => {
          try {
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                email: userEmail,
                role: selectedRole,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'id' });

            if (error) {
              console.error('Erreur lors de la sélection du rôle:', error);
              toast.error('Erreur lors de la sélection du rôle');
              return;
            }

            toast.success('Rôle défini avec succès');
            
            // Rediriger vers le tableau de bord approprié
            setTimeout(() => {
              router.push(getRedirectPathByRole(selectedRole));
            }, 1000);
          } catch (unexpectedError) {
            console.error('Erreur inattendue lors de la sélection du rôle:', unexpectedError);
            toast.error('Erreur inattendue lors de la sélection du rôle');
          }
        };

        await handleRoleSelection();
      }
    } catch (error) {
      console.error('Erreur lors de la définition du rôle:', error);
      toast.error('Erreur lors de la définition du rôle');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-xl border-border/30 bg-background/80 shadow-xl backdrop-blur-lg">
        <CardHeader className="space-y-2 p-8 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Bienvenue sur Next.js Expert Academy
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Veuillez sélectionner votre rôle pour continuer
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6">
          <RadioGroup
            value={selectedRole}
            onValueChange={setSelectedRole}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 rounded-md border p-4">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student" className="flex-1 cursor-pointer">
                <div className="font-semibold">Étudiant</div>
                <div className="text-sm text-muted-foreground">Accédez aux cours et suivez votre progression</div>
              </Label>
            </div>
            
            {isAdmin && (
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Enseignant</div>
                  <div className="text-sm text-muted-foreground">Créez et gérez des cours, suivez les progrès des étudiants</div>
                </Label>
              </div>
            )}
            
            {isAdmin && (
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Administrateur</div>
                  <div className="text-sm text-muted-foreground">Gérez tous les aspects de la plateforme</div>
                </Label>
              </div>
            )}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-center bg-background/50 px-8 py-6 border-t border-border/30">
          <Button 
            onClick={handleRoleSubmit} 
            disabled={isSubmitting} 
            className="w-full text-md font-semibold"
            size="lg"
          >
            {isSubmitting ? 'Enregistrement...' : 'Continuer'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
