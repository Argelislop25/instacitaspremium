import { NextResponse } from 'next/server';
import { getConnection, sql } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: { slug: string } }
) {
  try {
    const params = await context.params; 
    const slug = params?.slug;

    if (!slug) {
      return NextResponse.json({ error: 'El slug del negocio es obligatorio' }, { status: 400 });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('Slug', sql.NVarChar, slug)
      .query('SELECT * FROM Negocios WHERE Slug = @Slug');

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    console.error(`❌ Error en GET /api/negocios/[slug]:`, error);
    return NextResponse.json({ error: 'Error interno al obtener el negocio' }, { status: 500 });
  }
}