import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccess } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('hugly_access')?.value;
    if (!accessToken) return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'No session' }, { status: 401 });

    const payload = verifyAccess(accessToken) as any;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, companyName: true }
    });
    if (!user) return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'User not found' }, { status: 401 });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'Invalid or expired session' }, { status: 401 });
  }
}
