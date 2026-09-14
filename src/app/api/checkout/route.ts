import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { tier, userEmail } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('dummy')) {
      // Demo mode — no real Stripe keys
      return NextResponse.json({ url: '/dashboard?upgrade=success&demo=true' });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const priceId = tier === 'ultra_pro'
      ? process.env.STRIPE_PRICE_ID_ULTRA
      : process.env.STRIPE_PRICE_ID_PRO;

    if (!priceId) {
      return NextResponse.json({ url: '/dashboard?upgrade=success&demo=true' });
    }

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://resu-mate-seven.vercel.app';

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&upgraded=1`,
      cancel_url: `${appUrl}/pricing?cancelled=1`,
      metadata: { tier },
    };

    // Pre-fill email if provided
    if (userEmail) sessionParams.customer_email = userEmail;

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
