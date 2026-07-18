"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Definimos el mapeo de IDs para que sea dinámico
const MAPA_IDS_BASE_DATOS: Record<string, string> = {
  'servicio-1': '3A91DDD9-25B1-42D0-BF7F-B85572A5A7B1',
  'servicio-2': '0B244100-F6F9-41D6-9321-B2C54D0856B0',
  'servicio-3': '287C1383-BE37-43B5-8989-8D54C88144D5',
};

const SERVICIOS_CONFIGURABLES = [
  { id: 'servicio-1', name: 'Plan Launchpad', duration: '30 min', price: '$20' },
  { id: 'servicio-2', name: 'Programa de Digitalización', duration: '60 min', price: '$150 - 300' },
  { id: 'servicio-3', name: 'Sistema de Escalamiento Élite', duration: '90 min', price: '$500+' },
];

const HORAS_DISPONIBLES = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

function ContenidoReserva() {
  const searchParams = useSearchParams();
  const servicioId = searchParams.get("servicio");

  const servicioSeleccionado = SERVICIOS_CONFIGURABLES.find(s => s.id === servicioId);

  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [fecha, setFecha] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!servicioSeleccionado || !fecha || !horaSeleccionada) return;

    const idRealParaBaseDeDatos = MAPA_IDS_BASE_DATOS[servicioSeleccionado.id];

    try {
      const response = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        negocioid: '5B188BB1-99EC-44E1-B8B0-39BEA5887C1D',
        servicioid: idRealParaBaseDeDatos,
        // Usando el ID real que acabas de crear en Supabase
        profesionalid: 'eff73c98-a808-414e-bb6d-2fd226114703', 
        nombrecliente: nombre,
        emailcliente: email,
        telefonocliente: telefono,
        fechahora: `${fecha}T${horaSeleccionada.replace(" AM", ":00").replace(" PM", ":00")}`
      }),
      });

      if (response.ok) {
        alert("¡Cita confirmada con éxito!");
      } else {
        alert("Hubo un error al registrar la cita.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-8 bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6 backdrop-blur-sm">
        {servicioSeleccionado && (
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/60 flex justify-between items-center text-sm">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Servicio Seleccionado</p>
              <p className="font-semibold text-white">{servicioSeleccionado.name}</p>
            </div>
            <div className="text-right font-mono text-xs">
              <p className="text-white font-semibold">{servicioSeleccionado.price}</p>
              <p className="text-zinc-500">{servicioSeleccionado.duration}</p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="fecha-input" className="block text-sm font-medium text-zinc-300 mb-3">1. Selecciona la Fecha</label>
          <input 
            id="fecha-input"
            type="date" 
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full max-w-xs px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors text-sm [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">2. Horarios Disponibles</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HORAS_DISPONIBLES.map((hora) => (
              <button
                key={hora}
                type="button"
                onClick={() => setHoraSeleccionada(hora)}
                className={`py-3 px-4 rounded-xl text-xs font-mono border transition-all duration-200 ${
                  horaSeleccionada === hora
                    ? "bg-white text-zinc-950 border-white font-semibold shadow-lg shadow-white/5"
                    : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {hora}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900/20 border border-zinc-900 p-8 rounded-2xl space-y-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white border-b border-zinc-900 pb-4">Detalles del Cliente</h3>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">Nombre Completo</label>
          <input type="text" required placeholder="Ej. Argelis Lopez" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">Correo Electrónico</label>
          <input type="email" required placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">Teléfono</label>
          <input type="tel" required placeholder="Ej. 514-000-0000" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors" />
        </div>

        {/* Resumen que faltaba */}
        <div className="pt-4 border-t border-zinc-900 space-y-2 text-xs font-mono text-zinc-500">
          <div className="flex justify-between"><span>Servicio:</span> <span className="text-white">{servicioSeleccionado?.name || 'No elegido'}</span></div>
          <div className="flex justify-between"><span>Fecha:</span> <span className="text-white">{fecha || 'No seleccionada'}</span></div>
          <div className="flex justify-between"><span>Hora:</span> <span className="text-white">{horaSeleccionada || 'No seleccionada'}</span></div>
        </div>

        <button type="submit" disabled={!fecha || !horaSeleccionada} className="w-full py-3.5 bg-white text-zinc-950 font-medium rounded-xl hover:bg-zinc-200 transition-all duration-200 text-sm font-semibold disabled:opacity-20 disabled:hover:bg-white disabled:cursor-not-allowed text-center">
          Confirmar Cita
        </button>
      </form>
    </div>
  );
}

export default function ReservarPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 pt-32 px-4 selection:bg-zinc-800">
      <div className="max-w-5xl mx-auto pb-24">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-3">Confirmación de Espacio</p>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Agenda tu Cita</h1>
        </div>
        <Suspense fallback={<div className="text-zinc-500 text-sm font-mono">Cargando parámetros...</div>}>
          <ContenidoReserva />
        </Suspense>
      </div>
    </main>
  );
}