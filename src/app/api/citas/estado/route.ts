import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializa Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(request: Request) {
  try {
    const { id, nuevoEstado } = await request.json();
    console.log("Intentando actualizar ID:", id, "a estado:", nuevoEstado);

    // Ejecutamos el UPDATE en Supabase
    const { error } = await supabase
      .from('citas')
      .update({ estado: nuevoEstado }) // Asegúrate de que el nombre de la columna sea 'estado'
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Estado actualizado correctamente' });

  } catch (error: any) {
    console.error('ERROR DETALLADO EN API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}