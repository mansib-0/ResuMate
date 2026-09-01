import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy');

    if (!hasSupabase) {
      return NextResponse.json({ success: true });
    }

    const { createClient } = await import('../../../../utils/supabase/server');
    const supabase = await createClient();
    const pseudoEmail = `${username}@resumate.app`;

    const { error } = await supabase.auth.signInWithPassword({ email: pseudoEmail, password });
    if (error) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
