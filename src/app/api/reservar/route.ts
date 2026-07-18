import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. GET /api/reservar?negocioid=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const negocioid = searchParams.get('negocioid');

    if (!negocioid) {
      return NextResponse.json({ error: 'El parámetro negocioid es obligatorio' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('citas')
      .select(`
        *,
        servicios:servicioid (
          nombre,
          precio
        )
      `)
      .eq('negocioid', negocioid)
      .order('fechahora', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener las citas' }, { status: 500 });
  }
}

// 2. POST /api/reservar
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { negocioid, servicioid, profesionalid, nombrecliente, emailcliente, telefonocliente, fechahora } = body;

    // Validación según tus nombres de columna reales
    if (!negocioid || !servicioid || !profesionalid || !nombrecliente || !telefonocliente || !fechahora) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('citas')
      .insert([{
        negocioid,
        servicioid,
        profesionalid,
        nombrecliente,
        emailcliente: emailcliente || null,
        telefonocliente,
        fechahora
      }])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: 'Error interno al agendar' }, { status: 500 });
  }
}