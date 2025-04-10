'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

type AdminEmail = {
  id: string;
  email: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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
      fetchUsers();
      fetchAdminEmails();
    };
    
    checkAdminStatus();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast.error('Erreur lors de la récupération des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_emails')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setAdminEmails(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des emails administrateurs:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Mettre à jour le rôle dans la table profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (profileError) throw profileError;
      
      // Mettre à jour les métadonnées de l'utilisateur
      const { error: authError } = await supabase.functions.invoke('update-user-role', {
        body: { userId, role: newRole }
      });
      
      if (authError) throw authError;
      
      toast.success('Rôle mis à jour avec succès');
      fetchUsers(); // Rafraîchir la liste des utilisateurs
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const addAdminEmail = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('admin_emails')
        .insert({ email: newAdminEmail });
        
      if (error) throw error;
      
      toast.success('Administrateur ajouté avec succès');
      setNewAdminEmail('');
      fetchAdminEmails(); // Rafraîchir la liste des administrateurs
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'administrateur:', error);
      toast.error('Erreur lors de l\'ajout de l\'administrateur');
    }
  };

  const removeAdminEmail = async (email: string) => {
    try {
      const { error } = await supabase
        .from('admin_emails')
        .delete()
        .eq('email', email);
        
      if (error) throw error;
      
      toast.success('Administrateur supprimé avec succès');
      fetchAdminEmails(); // Rafraîchir la liste des administrateurs
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un administrateur:', error);
      toast.error('Erreur lors de la suppression de l\'administrateur');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Vérification des droits d&apos;accès...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des utilisateurs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>Gérez les rôles des utilisateurs de la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Chargement des utilisateurs...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Date d&apos;inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role || 'Non défini'}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={user.role}
                            onValueChange={(value: string) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Étudiant</SelectItem>
                              <SelectItem value="teacher">Enseignant</SelectItem>
                              <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Administrateurs autorisés</CardTitle>
              <CardDescription>Gérez les emails qui peuvent attribuer le rôle d&apos;enseignant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Ajouter un administrateur</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="admin-email"
                      placeholder="email@exemple.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                    <Button onClick={addAdminEmail}>Ajouter</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Administrateurs actuels</h3>
                  {adminEmails.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun administrateur défini</p>
                  ) : (
                    <ul className="space-y-2">
                      {adminEmails.map((admin) => (
                        <li key={admin.id} className="flex items-center justify-between text-sm">
                          <span>{admin.email}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAdminEmail(admin.email)}
                          >
                            Supprimer
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <p>Il&apos;s important de gérer les utilisateurs soigneusement.</p>
    </div>
  );
}
