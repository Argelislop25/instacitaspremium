import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get('negocioId');

    if (!negocioId) {
      return NextResponse.json({ error: 'negocioId es requerido' }, { status: 400 });
    }

   const { data, error } = await supabase
  .from('citas')
  .select(`
    *,
    servicios (
      nombre
    )
  `)
  .eq('negocioid', negocioId);

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}