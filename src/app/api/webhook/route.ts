import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('No Stripe key — demo mode webhook');
    return NextResponse.json({ received: true });
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let event: any;
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = await getSupabaseAdmin();

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const tier = session.metadata?.tier || 'pro';

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
        const periodEnd = new Date((subscription.current_period_end ?? 0) * 1000).toISOString();

        if (supabase && customerId) {
          await supabase.from('users').update({
            stripe_customer_id: customerId,
            subscription_tier: tier === 'ultra_pro' ? 'ultra_pro' : 'pro',
            subscription_status: 'active',
            current_period_end: periodEnd,
          }).eq('stripe_customer_id', customerId);

          // Also try by client_reference_id (user UUID)
          if (session.client_reference_id) {
            await supabase.from('users').update({
              stripe_customer_id: customerId,
              subscription_tier: tier === 'ultra_pro' ? 'ultra_pro' : 'pro',
              subscription_status: 'active',
              current_period_end: periodEnd,
            }).eq('id', session.client_reference_id);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const status = subscription.status;
        const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        if (supabase) {
          await supabase.from('users').update({
            subscription_status: status,
            current_period_end: periodEnd,
          }).eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        if (supabase) {
          await supabase.from('users').update({
            subscription_tier: 'free',
            subscription_status: 'cancelled',
            current_period_end: null,
          }).eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        if (supabase) {
          await supabase.from('users').update({
            subscription_status: 'past_due',
          }).eq('stripe_customer_id', customerId);
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}
