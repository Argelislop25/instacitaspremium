import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import sql from 'mssql';

// src/app/api/citas-negocio/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get('negocioId');

    const pool = await getConnection();
    const result = await pool.request()
      .input('negocioId', sql.UniqueIdentifier, negocioId)
      .query(`
        SELECT 
          C.Id, C.NombreCliente, C.TelefonoCliente, C.EmailCliente, 
          C.FechaHora, C.Estado,
          S.Nombre AS NombreServicio,
          P.Nombre AS NombreProfesional
        FROM Citas C
        LEFT JOIN Servicios S ON C.ServicioId = S.Id
        LEFT JOIN Profesionales P ON C.ProfesionalId = P.Id
        WHERE C.NegocioId = @negocioId 
        ORDER BY C.FechaHora DESC
      `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}