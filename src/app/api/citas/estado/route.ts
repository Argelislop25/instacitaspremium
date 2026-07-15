import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { enviarNotificacionTelegram } from '@/lib/telegram';
import sql from 'mssql';

export async function PATCH(request: Request) {
  try {
    const { id, nuevoEstado } = await request.json();
    console.log("Intentando actualizar ID:", id, "a estado:", nuevoEstado); // Log para consola del servidor

    const pool = await getConnection();
    
    // Ejecutamos y capturamos el resultado
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('estado', sql.NVarChar, nuevoEstado)
      .query('UPDATE Citas SET Estado = @estado WHERE Id = @id');

    console.log("Resultado SQL:", result);
    return NextResponse.json({ message: 'Estado actualizado correctamente' });

  } catch (error: any) {
    console.error('ERROR DETALLADO EN API:', error); // ESTO ES LO QUE NECESITAMOS VER
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  
}