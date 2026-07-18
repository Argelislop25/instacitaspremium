
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializamos el cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { id } = await request.json(); // Recibimos el ID desde el frontend

    // Ejecutamos el DELETE en Supabase
    const { error } = await supabase
      .from('citas')
      .delete()
      .eq('id', id); // 'id' debe coincidir con la columna en tu tabla de Supabase

    if (error) throw error;

    return NextResponse.json({ message: "Cita eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    return NextResponse.json({ error: "No se pudo eliminar la cita" }, { status: 500 });
  }
}