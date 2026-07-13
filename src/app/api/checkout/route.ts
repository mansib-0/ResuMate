import { NextResponse } from 'next/server';
import { stripe } from '../../../utils/stripe/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { tier } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ url: '/dashboard?upgrade=success' });
    }

    // Determine which price ID to use
    const priceId = tier === 'ultra_pro' 
      ? process.env.STRIPE_ULTRA_PRO_PRICE_ID 
      : process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      // Fallback for demo if specific tier keys are missing
      return NextResponse.json({ url: '/dashboard?upgrade=success&demo=true' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing`,
      client_reference_id: user?.id,
      metadata: {
        tier: tier
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
