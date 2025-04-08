// Déclarations de types pour les modules Deno et Supabase

declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2.49.4' {
  export function createClient(url: string, key: string): SupabaseClient;
  
  interface SupabaseClient {
    auth: {
      admin: {
        updateUserById(userId: string, data: { user_metadata: Record<string, any> }): Promise<{
          data: any;
          error: Error | null;
        }>;
      };
    };
  }
}

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};