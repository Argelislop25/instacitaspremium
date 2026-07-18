import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. GET /api/negocios
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('negocios_id')
      .select('*')
      .order('fechacreacion', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error en GET /api/negocios_id:', error);
    return NextResponse.json(
      { error: 'Error al obtener los negocios de la base de datos' },
      { status: 500 }
    );
  }
}

// 2. POST /api/negocios
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Nombre, Telefono, LogoUrl } = body;

    if (!Nombre) {
      return NextResponse.json({ error: 'El nombre del negocio es obligatorio' }, { status: 400 });
    }

    const Slug = Nombre
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');

    const { data, error } = await supabase
      .from('negocios_id')
      .insert([{
        nombre: Nombre,
        slug: Slug,
        telefono: Telefono || null,
        logourl: LogoUrl || null
      }])
      .select()
      .single();

    if (error) {
      // Error 23505 es el código de Supabase/Postgres para violación de unicidad (duplicados)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Ya existe un negocio registrado con ese nombre o slug' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error en POST /api/negocios_id:', error);
    return NextResponse.json({ error: 'Error interno al intentar crear el negocio' }, { status: 500 });
  }
}