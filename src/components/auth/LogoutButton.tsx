"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Optionally show an error toast/message
        return;
      }

      // Redirect to login page
      router.push('/auth/login');
    } catch (err) {
      console.error('Unexpected logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="transition-colors duration-200"
    >
      {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
    </Button>
  );
}
