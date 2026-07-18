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
    // Buscamos las citas en Supabase
    const { data, error } = await supabase
      .from('citas')
      .select('fechahora') // Traemos solo la columna de fecha y hora
      .eq('profesionalid', profesionalId) // Asegúrate que el nombre de columna en tu DB sea este
      .gte('fechahora', `${fecha}T00:00:00`)
      .lte('fechahora', `${fecha}T23:59:59`)
      .neq('estado', 'Cancelada');

    if (error) throw error;

    // Formateamos las horas igual que antes (HH:MM AM/PM)
    const horasFormateadas = data.map(c => {
      return new Date(c.fechahora).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    });

    return NextResponse.json(horasFormateadas);
  } catch (error) {
    console.error("Error al buscar citas:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}