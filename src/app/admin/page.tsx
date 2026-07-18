"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CheckCircle, Clock } from "lucide-react";

const NOMBRES_SERVICIOS: Record<string, string> = {
  '3A91DDD9-25B1-42D0-BF7F-B85572A5A7B1': 'Plan Launchpad',
  '0B244100-F6F9-41D6-9321-B2C54D0856B0': 'Programa Digitalización',
  '287C1383-BE37-43B5-8989-8D54C88144D5': 'Escalamiento Élite',
};

export default function AdminDashboard() {
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const esAdmin = localStorage.getItem("esAdmin");
    if (!esAdmin) {
      router.push("/login");
    }
  }, [router]);

  const manejarAccion = async (id: string, accion: string) => {
    if (accion === 'cancelar') {
      if (confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
        try {
          const response = await fetch('/api/citas/eliminar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });

          if (response.ok) {
            // Ajustado a 'id' minúscula
            setCitas(citas.filter(c => c.id !== id));
          } else {
            alert("Error al eliminar");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  };

  useEffect(() => {
    fetch('/api/citas')
      .then(res => res.json())
      .then(data => {
        setCitas(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="p-8 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
          <Calendar className="text-blue-500 w-8 h-8" />
          <div>
            <p className="text-zinc-500 text-sm">Total Citas</p>
            <p className="text-2xl font-bold">{citas.length}</p>
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
          <Clock className="text-yellow-500 w-8 h-8" />
          <div>
            <p className="text-zinc-500 text-sm">Pendientes</p>
            <p className="text-2xl font-bold">{citas.length}</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
          <CheckCircle className="text-green-500 w-8 h-8" />
          <div>
            <p className="text-zinc-500 text-sm">Estado</p>
            <p className="text-2xl font-bold">Activo</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        {loading ? (
          <p>Cargando citas...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-800">
                <th className="pb-4">Cliente</th>
                <th className="pb-4">Servicio</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Teléfono</th>
                <th className="pb-4">Fecha y Hora</th>
                <th className="pb-4">Acción</th>
              </tr>
            </thead>
           <tbody>
              {citas.map((cita) => {
                // 1. Depuración para el servicio (Verás en la consola del navegador qué está pasando)
                console.log("ID de servicio recibido:", cita.servicioid);
                
                // Normalizamos el ID (quitamos espacios y pasamos a mayúsculas)
                const idLimpio = cita.servicioid ? cita.servicioid.trim().toUpperCase() : "";
                const nombreServicio = NOMBRES_SERVICIOS[idLimpio] || `ID no mapeado: ${cita.servicioid}`;

                // 2. Solución definitiva para la hora:
                // En lugar de new Date(), vamos a quitar la 'Z' de UTC y mostrarla tal cual viene de la BD
                const fechaCruda = cita.fechahora; 
                const fechaVisual = fechaCruda ? fechaCruda.replace('T', ' ').substring(0, 16) : "N/A";

                return (
                  <tr key={cita.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="py-4">{cita.nombrecliente}</td>
                    <td className="py-4 text-sm">{nombreServicio}</td>
                    <td className="py-4">{cita.emailcliente}</td>
                    <td className="py-4">{cita.telefonocliente}</td>
                    <td className="py-4 font-mono">{fechaVisual}</td>
                    <td className="py-4">
                      <button 
                        onClick={() => manejarAccion(cita.id, 'cancelar')}
                        className="text-red-500 hover:text-red-300 font-bold"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}