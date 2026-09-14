import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('dummy')) {
      return NextResponse.json({ url: '/pricing' });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://resu-mate-seven.vercel.app';

    // Get customer ID from request body (passed from settings page)
    let customerId: string | undefined;
    try {
      const body = await req.json();
      customerId = body.customerId;
    } catch {}

    if (!customerId) {
      return NextResponse.json({ url: '/pricing' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal error:', error);
    return NextResponse.json({ url: '/pricing' });
  }
}
