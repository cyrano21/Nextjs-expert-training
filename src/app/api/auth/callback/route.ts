import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/services/supabase/server'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types';

type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProgressInsert = Database['public']['Tables']['user_progress']['Insert']

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const redirectTo = requestUrl.searchParams.get('redirect') || '/student/dashboard'

    if (!code) {
      console.error('Aucun code d\'authentification fourni')
      return NextResponse.redirect(new URL('/', requestUrl.origin))
    }

    const supabase = await createServerSupabaseClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError || !sessionData?.session) {
      console.error('Erreur lors de l\'échange du code:', sessionError)
      return NextResponse.redirect(
        new URL(`/auth/login?error=session_error&redirect=${encodeURIComponent(redirectTo)}`, requestUrl.origin)
      )
    }

    const session = sessionData.session
    const user = session.user

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profileData) {
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]

      const profileInsert: ProfileInsert = {
        id: user.id,
        full_name: fullName ?? '',
        role: 'student',
        avatar_url: user.user_metadata?.avatar_url || null,
        points: 0,
        current_streak: 0,
        last_active_date: new Date().toISOString(),
        badges: [],
        updated_at: new Date().toISOString(),
        username: null,
        website: null,
      }

      await supabase.from('profiles').insert([profileInsert])

      const progressInsert: ProgressInsert = {
        user_id: user.id,
        item_type: 'lesson',
        item_slug: 'intro',
        status: 'not_started',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      await supabase.from('user_progress').insert([progressInsert])

      console.log('Nouveau profil créé pour:', user.email)
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')
    const refreshToken = cookieStore.get('sb-refresh-token')

    const response = NextResponse.redirect(new URL(redirectTo, requestUrl.origin))

    if (!accessToken) {
      response.cookies.set('sb-access-token', session.access_token, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }

    if (!refreshToken) {
      response.cookies.set('sb-refresh-token', session.refresh_token, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }

    return response
  } catch (error) {
    console.error('Erreur lors du callback d\'authentification:', error)
    return NextResponse.redirect(
      new URL('/auth/login?error=auth_callback_error', request.url)
    )
  }
}
