'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginAdmin() {
  const [clave, setClave] = useState('');
  const router = useRouter();

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/validar-clave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave }),
    });

    if (res.ok) {
      const data = await res.json();
      // Guardamos el ID del negocio en localStorage
      localStorage.setItem('negocioId', data.negocioId);
      
      // REDIRECCIÓN CORREGIDA PARA TU ESTRUCTURA DE CARPETAS
      router.push('/admin/negocios/dashboard');
    } else {
      alert("Clave incorrecta");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-950">
      <form onSubmit={manejarLogin} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-sm">
        <h2 className="text-white text-xl font-bold mb-6">Acceso Administrador</h2>
        <input 
          type="password" 
          placeholder="Ingresa tu clave" 
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl text-white mb-4"
        />
        <button className="w-full bg-red-900 text-white p-4 rounded-xl font-bold">
          Entrar
        </button>
      </form>
    </div>
  );
}