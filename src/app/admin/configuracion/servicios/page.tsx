"use client";
import { useState, useEffect } from "react";

export default function GestionServicios() {
  const [servicios, setServicios] = useState<any[]>([]);
  // ID temporal para pruebas. En el futuro lo sacaremos de la sesión de usuario.
  const NEGOCIO_ID = "1A48F94D-6A2F-4589-A615-1DA1432D0A81"; 

  // Cargar servicios al abrir la página
  useEffect(() => {
    fetch(`/api/servicios?negocioId=${NEGOCIO_ID}`)
      .then(res => res.json())
      .then(data => setServicios(data));
  }, []);

  const agregarServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const nuevoServicio = {
      NegocioId: NEGOCIO_ID,
      Nombre: formData.get("nombre"),
      Precio: parseFloat(formData.get("precio") as string),
      DuracionMinutos: parseInt(formData.get("duracion") as string),
      Descripcion: formData.get("descripcion")
    };

    const res = await fetch('/api/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoServicio),
    });

    if (res.ok) {
      const data = await res.json();
      setServicios([data, ...servicios]); // Actualiza la lista al instante
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <main className="p-8 bg-zinc-950 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tus Servicios</h1>
      
      {/* Formulario */}
      <form onSubmit={agregarServicio} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 max-w-md mb-8">
        <input name="nombre" placeholder="Nombre del servicio" required className="w-full p-2 bg-zinc-800 rounded mb-4" />
        <input name="precio" type="number" placeholder="Precio" required className="w-full p-2 bg-zinc-800 rounded mb-4" />
        <input name="duracion" type="number" placeholder="Duración (minutos)" className="w-full p-2 bg-zinc-800 rounded mb-4" />
        <textarea name="descripcion" placeholder="Descripción" className="w-full p-2 bg-zinc-800 rounded mb-4" />
        <button className="bg-emerald-600 w-full py-2 rounded-lg font-bold">Agregar Servicio</button>
      </form>

      {/* Lista de Servicios */}
      <div className="grid gap-4">
        {servicios.map((s: any) => (
          <div key={s.Id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between">
            <div>
              <h3 className="font-bold">{s.Nombre}</h3>
              <p className="text-zinc-400 text-sm">{s.Descripcion}</p>
            </div>
            <div className="text-right font-bold text-emerald-500">${s.Precio}</div>
          </div>
        ))}
      </div>
    </main>
  );
}