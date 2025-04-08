'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getRedirectPathByRole } from '@/utils/roles';

interface RoleSelectorProps {
  userEmail: string;
  adminEmail?: string; // L'email de l'administrateur qui peut définir les rôles enseignant
}

export function RoleSelector({ userEmail, adminEmail }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est un administrateur autorisé
    const checkAdminStatus = async () => {
      if (userEmail) {
        const { data, error } = await supabase
          .from('admin_emails')
          .select('*')
          .eq('email', adminEmail || userEmail)
          .single();

        if (error) {
          console.error('Admin status check failed:', error);
        }

        if (data) {
          setIsAdmin(true);
        }
      }
    };

    checkAdminStatus();
  }, [userEmail, adminEmail]);

  const handleRoleChange = async () => {
    setIsSubmitting(true);
    try {
      // Mettre à jour le rôle de l'utilisateur dans les métadonnées
      const { error } = await supabase.auth.updateUser({
        data: { role: selectedRole }
      });

      if (error) {
        throw error;
      }

      // Mettre à jour le profil dans la table profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('email', userEmail);

      if (profileError) {
        console.error('Erreur lors de la mise à jour du profil:', profileError);
      }

      toast.success('Rôle mis à jour avec succès');
      
      // Rediriger vers le tableau de bord approprié
      setTimeout(() => {
        router.push(getRedirectPathByRole(selectedRole));
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sélectionnez votre rôle</CardTitle>
        <CardDescription>
          Choisissez le rôle qui correspond à votre utilisation de la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      <CardFooter>
        <Button 
          onClick={handleRoleChange} 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : 'Confirmer'}
        </Button>
      </CardFooter>
    </Card>
  );
}