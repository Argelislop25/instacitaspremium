import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { enviarNotificacionTelegram } from '@/lib/telegram';
import sql from 'mssql';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("--- 🕵️ Datos recibidos para insertar:", data);

    // Lógica para convertir "02:00 PM" a "14:00:00"
    const convertirA24h = (hora12: string) => {
      let [hora, minuto] = hora12.replace(' AM', '').replace(' PM', '').split(':');
      let h24 = parseInt(hora);
      if (hora12.includes('PM') && h24 !== 12) h24 += 12;
      if (hora12.includes('AM') && h24 === 12) h24 = 0;
      return `${String(h24).padStart(2, '0')}:${minuto}:00`;
    };

    const hora24 = convertirA24h(data.hora);
    const fechaHoraCompleta = `${data.fecha} ${hora24}`;
    
    console.log("--- 📅 Fecha preparada para SQL:", fechaHoraCompleta);

    const pool = await getConnection();
    
    console.log("--- 🚀 Iniciando INSERT en SQL...");

    const result = await pool.request()
      .input('NegocioId', sql.UniqueIdentifier, data.NegocioId)
      .input('ServicioId', sql.UniqueIdentifier, data.ServicioId)
      .input('ProfesionalId', sql.UniqueIdentifier, data.ProfesionalId)
      .input('NombreCliente', sql.NVarChar, data.NombreCliente)
      .input('EmailCliente', sql.NVarChar, data.EmailCliente)
      .input('TelefonoCliente', sql.NVarChar, data.TelefonoCliente)
      .input('FechaHora', sql.DateTimeOffset, fechaHoraCompleta + ":00-04:00")
      .query(`INSERT INTO Citas (NegocioId, ServicioId, ProfesionalId, NombreCliente, EmailCliente, TelefonoCliente, FechaHora, Estado) 
              VALUES (@NegocioId, @ServicioId, @ProfesionalId, @NombreCliente, @EmailCliente, @TelefonoCliente, @FechaHora, 'Pendiente')`);

    console.log("--- ✅ INSERT exitoso en SQL");

    const mensaje = `<b>🔔 Nueva Cita Confirmada</b>\n\n` +
                `👤 <b>Cliente:</b> ${data.NombreCliente}\n` +
                `📞 <b>Teléfono:</b> ${data.TelefonoCliente}\n` +
                `📧 <b>Email:</b> ${data.EmailCliente}\n` +
                `📅 <b>Fecha y Hora:</b> ${fechaHoraCompleta}`; 

    await enviarNotificacionTelegram(mensaje);
            
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("--- ❌ ERROR CRÍTICO EN LA API:", error);
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}