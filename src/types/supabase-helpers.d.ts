import type { RequestCookie } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type { SupabaseClient } from '@supabase/supabase-js';

declare module '@supabase/auth-helpers-nextjs' {
  export function createServerComponentClient<Database = unknown, SchemaName extends string = 'public'>(
    options: {
      cookies: () => {
        get: (name: string) => RequestCookie | null;
        getAll: () => RequestCookie[];
      }
    }
  ): SupabaseClient<Database, SchemaName>;
}
