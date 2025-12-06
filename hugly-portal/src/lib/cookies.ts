import { NextResponse } from 'next/server';

export function setAuthCookies(res: NextResponse, accessToken: string, refreshToken: string) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set({
    name: 'hugly_access',
    value: accessToken,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 15 * 60
  });
  res.cookies.set({
    name: 'hugly_refresh',
    value: refreshToken,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set({ name: 'hugly_access', value: '', maxAge: 0 });
  res.cookies.set({ name: 'hugly_refresh', value: '', maxAge: 0 });
}
