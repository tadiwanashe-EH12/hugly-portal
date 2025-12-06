import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/validation/authSchemas';
import { verifyPassword } from '@/lib/password';
import { signAccess, signRefresh } from '@/lib/jwt';
import { setAuthCookies } from '@/lib/cookies';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return NextResponse.json({ code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password' }, { status: 401 });

    const ok = await verifyPassword(data.password, user.passwordHash);
    if (!ok) return NextResponse.json({ code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password' }, { status: 401 });

    await prisma.auditLog.create({ data: { userId: user.id, action: 'LOGIN', ip: req.ip, userAgent: req.headers.get('user-agent') } });

    const access = signAccess({ sub: user.id, email: user.email });
    const refresh = signRefresh({ sub: user.id, email: user.email });

    const res = NextResponse.json({ message: 'Logged in' });
    setAuthCookies(res, access, refresh);
    return res;
  } catch (err: any) {
    return NextResponse.json({ code: 'INVALID', message: err?.message || 'Invalid request' }, { status: 400 });
  }
}
