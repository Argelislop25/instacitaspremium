import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. GET /api/servicios?negocioId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get('negocioId');

    if (!negocioId) {
      return NextResponse.json(
        { error: 'El parámetro negocioId es obligatorio' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('negocioid', negocioId)
      .order('fechacreacion', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error en GET /api/servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los servicios' },
      { status: 500 }
    );
  }
}

// 2. POST /api/servicios
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { NegocioId, Nombre, Descripcion, Precio, DuracionMinutos } = body;

    if (!NegocioId || !Nombre || Precio === undefined) {
      return NextResponse.json(
        { error: 'NegocioId, Nombre y Precio son campos obligatorios' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('servicios')
      .insert([{
        negocioid: NegocioId,
        nombre: Nombre,
        descripcion: Descripcion,
        precio: Precio,
        duracionminutos: DuracionMinutos || 30
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('❌ Error en POST /api/servicios:', error);
    return NextResponse.json(
      { error: 'Error interno al crear el servicio' },
      { status: 500 }
    );
  }
}