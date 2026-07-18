import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializa Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .order('fechahora', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener citas' }, { status: 500 });
  }
}