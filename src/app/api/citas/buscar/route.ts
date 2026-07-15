import { NextResponse } from 'next/server';
import sql from 'mssql';

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true, // Ignora el certificado local
    serverName: 'localhost'       // 👈 Agrega esta línea mágica para quitar el error de la IP
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  try {
    // Conexión estable usando ConnectionPool
    const pool = await new sql.ConnectionPool(config).connect();
    
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM dbo.Citas WHERE EmailCliente = @email');
    
    // Cerrar la conexión después de usarla
    await pool.close();
    
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Error en base de datos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}