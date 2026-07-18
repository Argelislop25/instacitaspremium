import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { clave } = await req.json();

  try {
    // Buscamos el negocio que coincida con la clave
    const { data, error } = await supabase
      .from('negocios_id') // Asegúrate de que tu tabla se llame 'negocios'
      .select('id')
      .eq('claveadmin', clave) // Asegúrate de que tu columna sea 'claveadmin'
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Clave no válida' }, { status: 401 });
    }

    return NextResponse.json({ negocioId: data.id }, { status: 200 });
  } catch (error) {
    console.error('Error al validar clave:', error);
    return NextResponse.json({ error: 'Error en servidor' }, { status: 500 });
  }
}