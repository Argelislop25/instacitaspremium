"use client";
import { useState } from "react";

export default function ConsultarCitas() {
  const [email, setEmail] = useState("");
  const [citas, setCitas] = useState<any[]>([]);
  const [buscado, setBuscado] = useState(false);

  const buscarCitas = async (e: React.FormEvent) => {
    e.preventDefault();
    // Llamamos a un endpoint que filtra por email
    const res = await fetch(`/api/citas/buscar?email=${email}`);
    const data = await res.json();
    setCitas(data);
    setBuscado(true);
  };

  return (
    <main className="p-8 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Consultar mis citas</h1>
      
      <form onSubmit={buscarCitas} className="mb-8 flex gap-4">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo"
          className="p-2 bg-zinc-900 border border-zinc-700 rounded w-full max-w-sm"
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded font-bold">Buscar</button>
      </form>

      {buscado && citas.length === 0 && <p>No encontramos citas para este correo.</p>}

      {citas.length > 0 && (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-xl mb-4 font-bold">Tus Citas Encontradas:</h2>
          {citas.map((cita) => (
            <div key={cita.Id} className="border-b border-zinc-800 py-4">
              <p>Fecha: {new Date(cita.FechaHora).toLocaleString()}</p>
              <p className="text-zinc-500">Estado: {cita.Estado || 'Pendiente'}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}