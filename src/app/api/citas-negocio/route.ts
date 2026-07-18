/*import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Asegúrate de importar el cliente que creamos

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get('negocioId');

    if (!negocioId) {
      return NextResponse.json({ error: 'negocioId es requerido' }, { status: 400 });
    }

    // Consulta equivalente a Supabase
    const { data, error } = await supabase
      .from('Citas')
      .select(`
        Id, 
        NombreCliente, 
        TelefonoCliente, 
        EmailCliente, 
        FechaHora, 
        Estado,
        Servicios (Nombre),
        Profesionales (Nombre)
      `)
      .eq('negocio_id', negocioId)
      .order('FechaHora', { ascending: false });

    if (error) {
      throw error;
    }

    // Transformamos los datos para que coincidan con la estructura que espera tu frontend
    const formattedData = data.map((cita: any) => ({
      ...cita,
      NombreServicio: cita.Servicios?.Nombre,
      NombreProfesional: cita.Profesionales?.Nombre
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error en API de citas:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
  */