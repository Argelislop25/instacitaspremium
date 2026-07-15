import { NextResponse } from 'next/server';
import { getConnection, sql } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Negocios ORDER BY FechaCreacion DESC');
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('❌ Error en GET /api/negocios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los negocios de la base de datos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Nombre, Telefono, LogoUrl } = body;

    if (!Nombre) {
      return NextResponse.json({ error: 'El nombre del negocio es obligatorio' }, { status: 400 });
    }

    const Slug = Nombre
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');

    const pool = await getConnection();
    const result = await pool.request()
      .input('Nombre', sql.NVarChar, Nombre)
      .input('Slug', sql.NVarChar, Slug)
      .input('Telefono', sql.NVarChar, Telefono || null)
      .input('LogoUrl', sql.NVarChar, LogoUrl || null)
      .query(`
        INSERT INTO Negocios (Nombre, Slug, Telefono, LogoUrl)
        OUTPUT INSERTED.*
        VALUES (@Nombre, @Slug, @Telefono, @LogoUrl)
      `);

    return NextResponse.json(result.recordset[0], { status: 201 });
  } catch (error: any) {
    console.error('❌ Error en POST /api/negocios:', error);
    if (error.number === 2627 || error.number === 2601) {
      return NextResponse.json({ error: 'Ya existe un negocio registrado con ese nombre' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno al intentar crear el negocio' }, { status: 500 });
  }
}