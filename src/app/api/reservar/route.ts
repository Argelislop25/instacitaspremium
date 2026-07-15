import { NextResponse } from 'next/server';
import { getConnection, sql } from '@/lib/db';

// 1. GET /api/reservar?negocioId=...
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
      .query(`
        SELECT c.*, s.Nombre AS ServicioNombre, s.Precio, s.DuracionMinutos 
        FROM Citas c
        INNER JOIN Servicios s ON c.ServicioId = s.Id
        WHERE c.NegocioId = @NegocioId 
        ORDER BY c.FechaHora ASC
      `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('❌ Error en GET /api/reservar:', error);
    return NextResponse.json(
      { error: 'Error al obtener las citas' },
      { status: 500 }
    );
  }
}

// 2. POST /api/reservar
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { NegocioId, ServicioId, ProfesionalId, NombreCliente, EmailCliente, TelefonoCliente, FechaHora } = body;

    // Validamos que todos los campos requeridos estén presentes
    if (!NegocioId || !ServicioId || !ProfesionalId || !NombreCliente || !TelefonoCliente || !FechaHora) {
      return NextResponse.json(
        { error: 'Todos los campos excepto el email son obligatorios' },
        { status: 400 }
      );
    }

    const fechaFormateada = new Date(FechaHora);

    const pool = await getConnection();
    const result = await pool.request()
      .input('NegocioId', sql.UniqueIdentifier, NegocioId)
      .input('ServicioId', sql.UniqueIdentifier, ServicioId)
      .input('ProfesionalId', sql.UniqueIdentifier, ProfesionalId)
      .input('NombreCliente', sql.NVarChar, NombreCliente)
      .input('EmailCliente', sql.NVarChar, EmailCliente || null)
      .input('TelefonoCliente', sql.NVarChar, TelefonoCliente)
      .input('FechaHora', sql.DateTime2, fechaFormateada)
      .query(`
        INSERT INTO Citas (NegocioId, ServicioId, ProfesionalId, NombreCliente, EmailCliente, TelefonoCliente, FechaHora)
        OUTPUT INSERTED.*
        VALUES (@NegocioId, @ServicioId, @ProfesionalId, @NombreCliente, @EmailCliente, @TelefonoCliente, @FechaHora)
      `);

    return NextResponse.json(result.recordset[0], { status: 201 });
  } catch (error) {
    console.error('❌ Error en POST /api/reservar:', error);
    return NextResponse.json(
      { error: 'Error interno al agendar la cita' },
      { status: 500 }
    );
  }
}