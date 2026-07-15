import { NextResponse } from 'next/server';
import sql from 'mssql';

// Copia aquí exactamente el mismo objeto 'config' que tienes en tu otro archivo route.ts
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    serverName: 'localhost'
  }
};

export async function POST(request: Request) {
  try {
    const { id } = await request.json(); // Recibe el ID desde el frontend
    
    const pool = await sql.connect(config);
    
    // Ejecutamos el DELETE
    await pool.request()
      .input('id', sql.UniqueIdentifier, id) // Aseguramos que el ID sea correcto
      .query('DELETE FROM dbo.Citas WHERE Id = @id');
      
    pool.close();
    
    return NextResponse.json({ message: "Cita eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    return NextResponse.json({ error: "No se pudo eliminar la cita" }, { status: 500 });
  }
}