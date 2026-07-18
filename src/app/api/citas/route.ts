import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Asegúrate de importar el cliente aquí

export async function GET() {
  try {
    // Obtenemos la fecha actual en formato ISO para comparar
    const ahora = new Date().toISOString();
    
    // Consulta a Supabase
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .gte('fechahora', ahora)
      .order('fechahora', { ascending: true });

    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener citas en Supabase:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
