import { NextRequest, NextResponse } from 'next/server';
import { verifyRefresh, signAccess, signRefresh } from '@/lib/jwt';
import { setAuthCookies } from '@/lib/cookies';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('hugly_refresh')?.value;
    if (!refreshToken) return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'No refresh token' }, { status: 401 });

    const payload = verifyRefresh(refreshToken) as any;
    const access = signAccess({ sub: payload.sub, email: payload.email });
    const refresh = signRefresh({ sub: payload.sub, email: payload.email });

    const res = NextResponse.json({ message: 'Session refreshed' });
    setAuthCookies(res, access, refresh);
    return res;
  } catch {
    return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'Invalid refresh token' }, { status: 401 });
  }
}
