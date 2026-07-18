import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { enviarNotificacionTelegram } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("--- 🕵️ Datos recibidos para insertar:", data);

    // Lógica para convertir "02:00 PM" a formato ISO
    const convertirAISO = (fecha: string, hora12: string) => {
      let [hora, minuto] = hora12.replace(' AM', '').replace(' PM', '').split(':');
      let h24 = parseInt(hora);
      if (hora12.includes('PM') && h24 !== 12) h24 += 12;
      if (hora12.includes('AM') && h24 === 12) h24 = 0;
      return `${fecha}T${String(h24).padStart(2, '0')}:${minuto}:00`;
    };

    const fechaHoraISO = convertirAISO(data.fecha, data.hora);
    
    // --- NUEVA VALIDACIÓN: Verificar disponibilidad ---
    const { data: citaExistente, error: errorBusqueda } = await supabase
      .from('citas')
      .select('id')
      .eq('profesionalid', data.ProfesionalId)
      .eq('fechahora', fechaHoraISO)
      .maybeSingle();

    if (errorBusqueda) throw errorBusqueda;

    if (citaExistente) {
      console.log("--- ⚠️ Intento de cita en horario ocupado:", fechaHoraISO);
      return NextResponse.json(
        { error: 'Este barbero ya tiene una cita reservada en este horario.' }, 
        { status: 409 } // Conflict
      );
    }
    // ----------------------------------------------------

    // Inserción en Supabase
    const { error } = await supabase
      .from('citas')
      .insert([
        {
          negocioid: data.NegocioId,
          servicioid: data.ServicioId,
          profesionalid: data.ProfesionalId,
          nombrecliente: data.NombreCliente,
          emailcliente: data.EmailCliente,
          telefonocliente: data.TelefonoCliente,
          fechahora: fechaHoraISO,
          estado: 'Pendiente'
        }
      ]);

    if (error) throw error;

    console.log("--- ✅ INSERT exitoso en Supabase");

    // Notificación a Telegram
    const mensaje = `<b>🔔 Nueva Cita Confirmada</b>\n\n` +
                `👤 <b>Cliente:</b> ${data.NombreCliente}\n` +
                `📞 <b>Teléfono:</b> ${data.TelefonoCliente}\n` +
                `📧 <b>Email:</b> ${data.EmailCliente}\n` +
                `📅 <b>Fecha y Hora:</b> ${data.fecha} ${data.hora}`; 

    await enviarNotificacionTelegram(mensaje);
            
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("--- ❌ ERROR CRÍTICO EN LA API:", error);
    return NextResponse.json({ error: 'Error al guardar la cita' }, { status: 500 });
  }
}