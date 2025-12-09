import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/src/lib/cookies';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ message: 'Logged out' });
  clearAuthCookies(res);
  return res;
}
