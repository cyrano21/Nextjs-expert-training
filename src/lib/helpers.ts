import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

// Type pour les options de cookie
type CookieOptions = Partial<Omit<ResponseCookie, 'name' | 'value'>>;

export async function getItemAsync(key: string): Promise<string | null> {
  if (typeof window !== 'undefined') {
    // Code côté client
    return localStorage.getItem(key);
  } else {
    // Code côté serveur
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key);
    return cookie?.value || null;
  }
}

export async function setItemAsync(key: string, value: string, options?: CookieOptions): Promise<void> {
  if (typeof window !== 'undefined') {
    // Code côté client
    localStorage.setItem(key, value);
  } else {
    // Code côté serveur
    const cookieStore = await cookies();
    cookieStore.set(key, value, options);
  }
}
