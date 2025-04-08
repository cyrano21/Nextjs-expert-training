// Fonction Edge Supabase pour mettre à jour le rôle d'un utilisateur
// Cette fonction nécessite des droits d'administration dans Supabase

// Importer les types définis dans types.d.ts
/// <reference path="./types.d.ts" />

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Récupérer les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variables d\'environnement manquantes');
    }

    // Créer un client Supabase avec la clé de service (droits admin)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer les données de la requête
    const { userId, role } = await req.json();

    if (!userId || !role) {
      throw new Error('userId et role sont requis');
    }

    // Vérifier que le rôle est valide
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      throw new Error('Rôle invalide');
    }

    // Mettre à jour les métadonnées de l'utilisateur
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});