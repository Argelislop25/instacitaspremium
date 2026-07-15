'use client'

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function FormularioReserva({ negocioId }: { negocioId: string }) {
  const [fecha, setFecha] = useState<Date | any>(new Date());
  const [horario, setHorario] = useState('');
  const [servicio, setServicio] = useState('');
  const [barbero, setBarbero] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);

  const ID_NEGOCIO_CORRECTO = '1A48F94D-6A2F-4589-A615-1DA1432D0A81';

  // Lógica para bloquear horas ocupadas
  useEffect(() => {
    const verificarDisponibilidad = async () => {
      if (barbero && fecha) {
        // Formateamos solo la fecha local (YYYY-MM-DD)
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        const fechaFormateada = `${yyyy}-${mm}-${dd}`;
        
        try {
          const res = await fetch(`/api/citas-ocupadas?profesionalId=${barbero}&fecha=${fechaFormateada}`);
          const data = await res.json();
          // Aseguramos que los datos recibidos sean un array de strings comparables
          setHorasOcupadas(data);
        } catch (e) { console.error("Error al cargar disponibilidad"); }
      }
    };
    verificarDisponibilidad();
  }, [barbero, fecha]);

  const servicios = [
    { id: "0F7584C8-C91F-4905-B0DA-261846BC33B9", nombre: "Corte Regular" },
    { id: "9557AEE0-9F7E-4AB9-A1AB-2FEC1A991298", nombre: "Recorte Pemium" },
    { id: "C3B9CB5A-2F0A-4458-9485-DD29CC378BF5", nombre: "Corte Clasico Con Facial" },
  ];

  const artistas = [
    { id: "59AAA46D-A0E1-467C-8353-B3876B0D3581", nombre: "Mosi Duran" },
    { id: "33140948-5AAB-48FB-AF8E-4033E2D0BDEA", nombre: "Barbero Disponible" }
  ];

  const horarios = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"];

  const manejarReserva = async () => {
  if (!fecha || !horario || !nombre || !telefono || !servicio || !barbero) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Preparamos los datos de forma plana
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  
  // Enviamos fecha y hora como campos independientes para que el backend los reciba tal cual
  const reservaData = {
    NegocioId: ID_NEGOCIO_CORRECTO,
    ServicioId: servicio,
    ProfesionalId: barbero,
    NombreCliente: nombre,
    EmailCliente: correo,
    TelefonoCliente: telefono,
    fecha: `${yyyy}-${mm}-${dd}`, // <--- Nuevo campo plano
    hora: horario // <--- Enviamos "02:00 PM" tal cual el usuario lo ve
  };

  try {
    const response = await fetch('/api/reservar-nuevo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservaData),
    });

    if (response.ok) {
      alert("¡Cita confirmada exitosamente!");
      setHorario(''); 
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Hubo un error al guardar la cita.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión al servidor.");
  }
};

  return (
    <div className="flex justify-center items-center py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        
        {/* Columna Izquierda: Calendario y Horarios */}
        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800">
          <div className="mb-8">
            <label className="text-red-900 font-bold text-xs mb-3 block uppercase tracking-widest">1. Selecciona la Fecha</label>
            <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
              <Calendar onChange={setFecha} value={fecha} locale="es-ES" className="!bg-transparent !border-none !text-white w-full" />
            </div>
          </div>

          <div>
            <label className="text-red-900 font-bold text-xs mb-3 block uppercase tracking-widest">2. Horarios Disponibles</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {horarios.map((h) => {
                const estaOcupado = horasOcupadas.includes(h);
                return (
                  <button 
                    key={h} type="button" disabled={estaOcupado} onClick={() => setHorario(h)}
                    className={`p-3 rounded-lg text-xs transition border ${estaOcupado ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-zinc-900' : horario === h ? 'bg-red-900 border-red-900 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-red-900'}`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tus Inputs intactos */}
        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-6 border-b border-zinc-800 pb-4">Detalles del Cliente</h3>
          <div className="space-y-6">
            <input type="text" placeholder="Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-red-900" />
            <select value={servicio} onChange={(e) => setServicio(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-red-900">
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
            <select value={barbero} onChange={(e) => setBarbero(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-red-900">
              <option value="">Selecciona un barbero</option>
              {artistas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            <input type="email" placeholder="Correo Electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-red-900" />
            <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-red-900" />
            <button onClick={manejarReserva} className="w-full bg-red-900 text-white font-bold p-4 rounded-xl mt-2 hover:bg-red-800 transition shadow-[0_0_15px_rgba(127,29,29,0.3)]">
              Confirmar Cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}