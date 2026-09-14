import { NextResponse } from 'next/server';

// POST /api/auth/2fa/verify — verify a TOTP code
export async function POST(req: Request) {
  try {
    const { token, secret } = await req.json();

    if (!token || !secret) {
      return NextResponse.json({ valid: false, error: 'Missing token or secret' }, { status: 400 });
    }

    // Demo mode — accept code "123456"
    if (secret === 'DEMO_SECRET_BASE32') {
      return NextResponse.json({ valid: token === '123456' });
    }

    const speakeasy = (await import('speakeasy')).default;

    const valid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // allow 30s drift
    });

    return NextResponse.json({ valid });
  } catch (error: any) {
    console.error('2FA verify error:', error);
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}
