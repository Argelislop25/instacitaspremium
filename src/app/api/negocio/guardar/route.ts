import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Inicializamos Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. Extraemos los datos del request
    const { id, nombre, slug, telefono } = await request.json();
    
    // 2. Insertamos usando el cliente de Supabase
    // Nota: Usamos 'negocios' en minúsculas y nombres de columnas también en minúsculas
    const { data, error } = await supabase
      .from('negocios')
      .insert([
        {
          id: id,
          nombre: nombre,
          slug: slug,
          telefono: telefono,
          fecha_creacion: new Date().toISOString() // Supabase prefiere ISO strings para fechas
        }
      ]);

    // 3. Manejo de errores de base de datos
    if (error) {
      console.error("Error en Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Negocio registrado con éxito" });
    
  } catch (error) {
    console.error("Error al guardar:", error);
    return NextResponse.json({ error: "Error interno al procesar la solicitud" }, { status: 500 });
  }
}