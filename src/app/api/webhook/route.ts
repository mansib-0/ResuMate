import { NextResponse } from 'next/server';
import { stripe } from '../../../utils/stripe/server';
import { createClient } from '@supabase/supabase-js';

// We need a service role key to bypass RLS in the webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn("Missing STRIPE_WEBHOOK_SECRET, skipping validation for demo purposes.");
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const customerId = session.customer;

        if (userId) {
          await supabaseAdmin
            .from('users')
            .update({
              subscription_tier: 'premium',
              stripe_customer_id: customerId,
            })
            .eq('id', userId);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await supabaseAdmin
          .from('users')
          .update({ subscription_tier: 'free' })
          .eq('stripe_customer_id', subscription.customer);
        break;
      }
      // ... handle other events
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
