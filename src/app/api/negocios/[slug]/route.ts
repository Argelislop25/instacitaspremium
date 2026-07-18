import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: 'El slug del negocio es obligatorio' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('negocios')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`❌ Error en GET /api/negocios/[slug]:`, error);
    return NextResponse.json({ error: 'Error interno al obtener el negocio' }, { status: 500 });
  }
}