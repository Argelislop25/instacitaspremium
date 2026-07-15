import { NextResponse } from 'next/server';
import sql from 'mssql';

// Reutilizamos tu configuración exacta
const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    serverName: 'localhost'
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export async function POST(request: Request) {
  try {
    const { id, nombre, slug, telefono } = await request.json();
    
    const pool = await new sql.ConnectionPool(config).connect();
    
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('slug', sql.NVarChar, slug)
      .input('telefono', sql.NVarChar, telefono)
      .query(`
        INSERT INTO dbo.Negocios (Id, Nombre, Slug, Telefono, FechaCreacion)
        VALUES (@id, @nombre, @slug, @telefono, GETDATE())
      `);
    
    await pool.close();
    return NextResponse.json({ message: "Negocio registrado con éxito" });
  } catch (error) {
    console.error("Error al guardar:", error);
    return NextResponse.json({ error: "Error interno al guardar" }, { status: 500 });
  }
}