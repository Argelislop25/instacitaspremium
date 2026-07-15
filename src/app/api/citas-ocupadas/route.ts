import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import sql from 'mssql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profesionalId = searchParams.get('profesionalId');
  const fecha = searchParams.get('fecha');

  try {
    const pool = await getConnection();
    
    // Convertimos la hora de la DB al formato de tus botones: "08:00 PM"
    const result = await pool.request()
      .input('ProfesionalId', sql.UniqueIdentifier, profesionalId)
      .input('Fecha', sql.Date, fecha)
      .query(`
        SELECT FORMAT(FechaHora, 'hh:mm tt') as Hora 
        FROM Citas 
        WHERE ProfesionalId = @ProfesionalId 
        AND CAST(FechaHora AS DATE) = @Fecha
        AND Estado != 'Cancelada'
      `)

    // Devolvemos un array simple como ["08:00 PM", "03:00 PM"]
    return NextResponse.json(result.recordset.map(r => r.Hora));
  } catch (error) {
    console.error("Error al buscar citas:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}