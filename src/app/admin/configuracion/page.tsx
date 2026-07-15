"use client";
import { useState } from "react";

export default function ConfiguracionNegocio() {
  // 1. Declaramos los estados para que el código reconozca las variables
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [telefono, setTelefono] = useState("");

  const guardarConfiguracion = async () => {
    // 2. Aquí creamos el objeto con los datos y el ID automático
    const nuevoNegocio = {
      id: crypto.randomUUID(),
      nombre: nombre,
      slug: slug,
      telefono: telefono
    };

    // 3. Enviamos a tu nueva API
    const response = await fetch('/api/negocio/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoNegocio),
    });
    
    if (response.ok) {
        alert("¡Negocio registrado con éxito!");
    } else {
        alert("Hubo un error al guardar.");
    }
  };

  return (
    <main className="p-8 bg-zinc-950 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Configura tu Negocio</h1>
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 max-w-lg">
        <input placeholder="Nombre del negocio" className="w-full p-2 bg-zinc-800 rounded mb-4" onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="Slug (ej: barberia-ejemplo)" className="w-full p-2 bg-zinc-800 rounded mb-4" onChange={(e) => setSlug(e.target.value)} />
        <input placeholder="Teléfono" className="w-full p-2 bg-zinc-800 rounded mb-4" onChange={(e) => setTelefono(e.target.value)} />
        
        <button onClick={guardarConfiguracion} className="bg-blue-600 px-6 py-2 rounded-lg font-bold">
          Guardar Configuración
        </button>
      </div>
    </main>
  );
}