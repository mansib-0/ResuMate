import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy');

    if (hasSupabase) {
      const { createClient } = await import('../../../../utils/supabase/server');
      const supabase = await createClient();
      await supabase.auth.signOut();
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
