'use client'

import { useEffect, useState } from 'react';
import { Check, X, User, Calendar, Clock, BarChart3, TrendingUp } from 'lucide-react';

export default function DashboardNegocio() {
  const [citas, setCitas] = useState<any[]>([]);

  const totalCitas = citas.length;
  const citasPendientes = citas.filter(c => c.Estado === 'Pendiente').length;
  const citasAprobadas = citas.filter(c => c.Estado === 'Aprobada').length;

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    await fetch('/api/citas/estado', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nuevoEstado })
    });
    window.location.reload(); 
  };

useEffect(() => {
    const negocioId = localStorage.getItem('negocioId');
    console.log("--- 🕵️ ID detectado en localStorage:", negocioId);

    if (!negocioId) {
      console.warn("--- ⚠️ Error: No hay negocioId guardado en el navegador.");
      return;
    }

    fetch(`/api/citas-negocio?negocioId=${negocioId}`)
      .then(res => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        return res.json();
      })
      .then(data => {
        console.log("--- ✅ Citas recibidas del servidor:", data);
        setCitas(data);
      })
      .catch(err => console.error("--- ❌ Error al obtener citas:", err));
  }, []);

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Calendar className="text-red-500" /> Panel de Gestión
        </h1>
        
        {/* Panel de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-all">
            <div>
              <p className="text-zinc-500 text-sm font-medium">Total Citas</p>
              <h3 className="text-3xl font-bold mt-1">{totalCitas}</h3>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500">
              <BarChart3 size={28} />
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-all">
            <div>
              <p className="text-zinc-500 text-sm font-medium">Pendientes</p>
              <h3 className="text-3xl font-bold mt-1">{citasPendientes}</h3>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-xl text-yellow-500">
              <Clock size={28} />
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-all">
            <div>
              <p className="text-zinc-500 text-sm font-medium">Aprobadas</p>
              <h3 className="text-3xl font-bold mt-1">{citasAprobadas}</h3>
            </div>
            <div className="p-4 bg-green-500/10 rounded-xl text-green-500">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>

        {/* Tabla de Citas */}
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl overflow-hidden">
          <h2 className="text-xl font-semibold mb-6">Citas Recientes</h2>
          
          {citas.length === 0 ? (
            <p className="text-zinc-500 text-center py-10">No tienes citas registradas aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-400 text-sm border-b border-zinc-800">
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Servicio</th>
                    <th className="p-4">Profesional</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {citas.map((cita) => (
                    <tr key={cita.Id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium">{cita.NombreCliente}</div>
                        <div className="text-xs text-zinc-500">{cita.TelefonoCliente}</div>
                      </td>
                      <td className="p-4 text-zinc-300">{cita.NombreServicio}</td>
                      <td className="p-4 flex items-center gap-2 text-zinc-300">
                        <User size={16} className="text-zinc-500" /> {cita.NombreProfesional}
                      </td>
                      <td className="p-4 text-zinc-400 text-sm">
                        {new Date(cita.FechaHora).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                          cita.Estado === 'Pendiente' ? 'bg-yellow-900/20 text-yellow-500' :
                          cita.Estado === 'Aprobada' ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'
                        }`}>
                          {cita.Estado}
                        </span>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button 
                          onClick={() => actualizarEstado(cita.Id, 'Aprobada')}
                          className="p-2 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white rounded-lg transition-all"
                          title="Aprobar"
                        >
                          <Check size={18}/>
                        </button>
                        <button 
                          onClick={() => actualizarEstado(cita.Id, 'Cancelada')}
                          className="p-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-all"
                          title="Cancelar"
                        >
                          <X size={18}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}