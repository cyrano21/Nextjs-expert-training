import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { access_token, refresh_token } = await request.json();

  const response = NextResponse.json({ success: true });

  response.cookies.set('sb-access-token', access_token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  response.cookies.set('sb-refresh-token', refresh_token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return response;
}
