import { NextResponse } from 'next/server';
import { getConnection, sql } from '@/lib/db';

// 1. GET /api/servicios?negocioId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get('negocioId');

    if (!negocioId) {
      return NextResponse.json(
        { error: 'El parámetro negocioId es obligatorio' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('NegocioId', sql.UniqueIdentifier, negocioId)
      .query('SELECT * FROM Servicios WHERE NegocioId = @NegocioId ORDER BY FechaCreacion DESC');

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('❌ Error en GET /api/servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los servicios' },
      { status: 500 }
    );
  }
}

// 2. POST /api/servicios
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { NegocioId, Nombre, Descripcion, Precio, DuracionMinutos } = body;

    if (!NegocioId || !Nombre || Precio === undefined) {
      return NextResponse.json(
        { error: 'NegocioId, Nombre y Precio son campos obligatorios' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('NegocioId', sql.UniqueIdentifier, NegocioId)
      .input('Nombre', sql.NVarChar, Nombre)
      .input('Descripcion', sql.NVarChar, Descripcion || null)
      .input('Precio', sql.Decimal(10, 2), Precio)
      .input('DuracionMinutos', sql.Int, DuracionMinutos || 30)
      .query(`
        INSERT INTO Servicios (NegocioId, Nombre, Descripcion, Precio, DuracionMinutos)
        OUTPUT INSERTED.*
        VALUES (@NegocioId, @Nombre, @Descripcion, @Precio, @DuracionMinutos)
      `);

    return NextResponse.json(result.recordset[0], { status: 201 });
  } catch (error) {
    console.error('❌ Error en POST /api/servicios:', error);
    return NextResponse.json(
      { error: 'Error interno al crear el servicio' },
      { status: 500 }
    );
  }
}