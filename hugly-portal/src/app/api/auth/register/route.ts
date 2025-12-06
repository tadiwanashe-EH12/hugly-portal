import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/validation/authSchemas';
import { hashPassword } from '@/lib/password';
import { signAccess, signRefresh } from '@/lib/jwt';
import { setAuthCookies } from '@/lib/cookies';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    if (!data.acceptedTerms) {
      return NextResponse.json({ code: 'TERMS_NOT_ACCEPTED', message: 'You must accept the terms' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ code: 'EMAIL_IN_USE', message: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);
    const dob = data.dateOfBirth ? new Date(data.dateOfBirth) : null;

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        idNumber: data.idNumber || null,
        gender: data.gender || null,
        dateOfBirth: dob,
        phone: data.phone || null,
        address: data.address || null,
        role: data.role || null,
        department: data.department || null,
        companyName: data.companyName || null,
        companyAddress: data.companyAddress || null,
        acceptedTermsAt: new Date()
      }
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: 'REGISTER', ip: req.ip, userAgent: req.headers.get('user-agent') }
    });

    const access = signAccess({ sub: user.id, email: user.email });
    const refresh = signRefresh({ sub: user.id, email: user.email });

    const res = NextResponse.json({ message: 'Registered', user: { id: user.id, email: user.email } }, { status: 201 });
    setAuthCookies(res, access, refresh);
    return res;
  } catch (err: any) {
    const message = err?.message || 'Invalid request';
    return NextResponse.json({ code: 'INVALID', message }, { status: 400 });
  }
}
