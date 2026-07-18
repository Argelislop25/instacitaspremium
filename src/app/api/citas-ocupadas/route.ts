import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profesionalId = searchParams.get('profesionalId');
  const fecha = searchParams.get('fecha');

  try {
    // 1. Buscamos las citas con el rango correcto
    const { data, error } = await supabase
      .from('citas')
      .select('fechahora')
      .eq('profesionalid', profesionalId)
      .gte('fechahora', `${fecha}T00:00:00`)
      .lte('fechahora', `${fecha}T23:59:59`)
      .neq('estado', 'Cancelada');

    if (error) throw error;

    // 2. Formateo manual para evitar inconsistencias de formato
    const horasFormateadas = data.map(c => {
      const date = new Date(c.fechahora);
      // Ajustamos a la zona horaria local si es necesario o usamos UTC directamente
      let hours = date.getUTCHours(); 
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12; // La hora 0 es 12
      const strHours = hours.toString().padStart(2, '0');
      
      return `${strHours}:${minutes} ${ampm}`;
    });

    console.log("Horas enviadas al frontend para bloquear:", horasFormateadas);

    return NextResponse.json(horasFormateadas);
  } catch (error) {
    console.error("Error al buscar citas:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}