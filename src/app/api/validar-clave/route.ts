import { NextResponse } from 'next/server';
import sql from 'mssql';

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // Cambia a true si estás en Azure
    trustServerCertificate: true,
  },
};

export async function POST(req: Request) {
  const { clave } = await req.json();

  try {
    const pool = await sql.connect(dbConfig);
    
    const result = await pool.request()
      .input('clave', sql.NVarChar, clave)
      .query('SELECT Id FROM Negocios WHERE ClaveAdmin = @clave');

    if (result.recordset.length > 0) {
      return NextResponse.json({ negocioId: result.recordset[0].Id }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Clave no válida' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    return NextResponse.json({ error: 'Error en servidor' }, { status: 500 });
  }  

}