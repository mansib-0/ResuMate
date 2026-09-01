import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const hasStripe =
      process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.includes('dummy');

    if (!hasStripe) {
      return NextResponse.json({ url: '/pricing' });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.billingPortal.sessions.create({
      customer: process.env.STRIPE_DEMO_CUSTOMER_ID || 'cus_demo',
      return_url: appUrl + '/settings',
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ url: '/pricing' });
  }
}
