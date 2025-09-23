import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const sb = createClient();
    
    await sb.from('zapi_webhook_events').insert({
      kind: 'disconnected',
      payload
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook disconnected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
