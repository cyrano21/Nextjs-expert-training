'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { getRedirectPathByRole, getWelcomeMessageByRole } from '@/utils/roles';
import { toast } from 'sonner';

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
  
        if (error || !data.session) {
          toast.error('Connexion échouée');
          router.replace('/auth/login');
          return;
        }
  
        const session = data.session;
  
        await fetch('/api/auth/set-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });
  
        const hasRole = !!session.user.user_metadata?.role;
        const userEmail = session.user.email;
  
        if (!hasRole) {
          toast.success('Connexion réussie', {
            description: `Bienvenue ${userEmail}, veuillez sélectionner votre rôle`,
          });
          setTimeout(() => {
            router.push('/auth/role-selection');
          }, 1000);
          return;
        }
  
        const role = session.user.user_metadata.role;
        const redirect = searchParams.get('redirect');
        const fallbackRedirect = getRedirectPathByRole(role);
  
        toast.success(getWelcomeMessageByRole(role), {
          description: `Bienvenue ${userEmail}`,
        });
  
        // 👇 Redirection complète pour transmettre les cookies côté serveur
        window.location.href =
          redirect === '/auth/callback' || !redirect
            ? fallbackRedirect
            : redirect;
  
      } catch (err) {
        console.error('Erreur pendant le callback OAuth:', err);
        toast.error('Erreur de connexion');
        router.replace('/auth/login');
      }
    };
  
    handleOAuthRedirect();
  }, [router, searchParams]);
  
 
  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm animate-pulse">
        Connexion en cours...
      </p>
    </div>
  );
}
