import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// GET: return session list for logged-in user
export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Demo mode: return mock sessions
      return NextResponse.json({
        sessions: [
          {
            id: 'demo-session-1',
            device: 'Chrome on macOS',
            ip_address: '192.168.1.1',
            created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            last_seen_at: new Date().toISOString(),
            is_current: true,
          },
          {
            id: 'demo-session-2',
            device: 'Chrome on Android',
            ip_address: '103.56.92.11',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            last_seen_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            is_current: false,
          },
        ]
      });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ sessions: [] });

    const { data } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('last_seen_at', { ascending: false });

    return NextResponse.json({ sessions: data || [] });
  } catch {
    return NextResponse.json({ sessions: [] });
  }
}

// DELETE: revoke a session by id
export async function DELETE(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await supabase.from('user_sessions').update({ is_active: false }).eq('id', sessionId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
