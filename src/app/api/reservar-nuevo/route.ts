import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { enviarNotificacionTelegram } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("--- 🕵️ Datos recibidos para insertar:", data);

    // Lógica para convertir "02:00 PM" a formato ISO compatible con Supabase (YYYY-MM-DDTHH:mm:ssZ)
    const convertirAISO = (fecha: string, hora12: string) => {
      let [hora, minuto] = hora12.replace(' AM', '').replace(' PM', '').split(':');
      let h24 = parseInt(hora);
      if (hora12.includes('PM') && h24 !== 12) h24 += 12;
      if (hora12.includes('AM') && h24 === 12) h24 = 0;
      
      // Formato ISO esperado por Supabase: "2026-07-18T14:00:00"
      return `${fecha}T${String(h24).padStart(2, '0')}:${minuto}:00`;
    };

    const fechaHoraISO = convertirAISO(data.fecha, data.hora);
    console.log("--- 📅 Fecha preparada para Supabase:", fechaHoraISO);

    // Inserción en Supabase
    const { error } = await supabase
      .from('Citas')
      .insert([
        {
          NegocioId: data.NegocioId,
          ServicioId: data.ServicioId,
          ProfesionalId: data.ProfesionalId,
          NombreCliente: data.NombreCliente,
          EmailCliente: data.EmailCliente,
          TelefonoCliente: data.TelefonoCliente,
          FechaHora: fechaHoraISO,
          Estado: 'Pendiente'
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