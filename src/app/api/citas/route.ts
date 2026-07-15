import sql from 'mssql';
import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    // Conectamos usando tu configuración
    const pool = await sql.connect(config);
    
    // Hacemos la consulta
const result = await pool.request().query(`
  SELECT * FROM dbo.Citas 
  WHERE FechaHora >= GETDATE() 
  ORDER BY FechaHora ASC
`);
    // Cerramos la conexión
    pool.close();
    
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}