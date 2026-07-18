import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Asegúrate de que esta variable en tu .env.local sea la 'service_role' (la que tiene privilegios de admin)
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

    console.log("🔍 Buscando negocio con slug:", slug);

    if (!slug) {
      return NextResponse.json({ error: 'Slug obligatorio' }, { status: 400 });
    }

   const { data, error } = await supabase
      .from('negocios_id')
      .select('*')
      .eq('slug', slug) // Usa solo esta línea
      .maybeSingle();
    // Esto nos mostrará el error real en la consola de tu terminal de VS Code
    if (error) {
      console.error("❌ ERROR DETALLADO DE SUPABASE:", JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      console.warn("⚠️ No se encontró el registro para:", slug);
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error("❌ Error inesperado:", err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}