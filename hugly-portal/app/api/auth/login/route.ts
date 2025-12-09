import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { loginSchema } from '@/src/validation/authSchemas';
import { verifyPassword } from '@/src/lib/password';
import { signAccess, signRefresh } from '@/src/lib/jwt';
import { setAuthCookies } from '@/src/lib/cookies';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json(
        { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const ok = await verifyPassword(data.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    // Log the login attempt
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown",
        userAgent: req.headers.get("user-agent")
      }
    });

    // Issue tokens
    const access = signAccess({ sub: user.id, email: user.email });
    const refresh = signRefresh({ sub: user.id, email: user.email });

    // Respond with cookies set
    const res = NextResponse.json({ message: 'Logged in', user: { id: user.id, email: user.email } });
    setAuthCookies(res, access, refresh);
    return res;
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { code: 'INVALID', message: err?.message || 'Invalid request' },
      { status: 400 }
    );
  }
}
