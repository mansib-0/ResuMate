import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// POST /api/auth/2fa/setup — generate a TOTP secret + QR code
export async function POST() {
  try {
    const speakeasy = (await import('speakeasy')).default;
    const QRCode = (await import('qrcode')).default;

    const secret = speakeasy.generateSecret({
      name: 'ResuMate',
      length: 32,
    });

    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url || '');

    // In production, store secret.base32 encrypted in your DB here
    // For now, we return it to the client to temporarily hold during setup
    return NextResponse.json({
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
      qrCode: qrCodeDataURL,
    });
  } catch (error: any) {
    // Fallback: generate a mock QR code if speakeasy not installed
    console.error('2FA setup error:', error);
    return NextResponse.json({
      secret: 'DEMO_SECRET_BASE32',
      otpauthUrl: 'otpauth://totp/ResuMate:user@resumate.app?secret=DEMO&issuer=ResuMate',
      qrCode: null,
      demo: true,
    });
  }
}
