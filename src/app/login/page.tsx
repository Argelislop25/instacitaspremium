"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes cambiar 'tu-password' por la contraseña que quieras
    if (password === "admin123") {
      localStorage.setItem("esAdmin", "true");
      router.push("/admin");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-80">
        <h1 className="text-xl font-bold mb-4">Acceso Administrativo</h1>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 mb-4 text-white"
        />
        <button type="submit" className="w-full bg-blue-600 p-2 rounded font-bold hover:bg-blue-500">
          Entrar
        </button>
      </form>
    </main>
  );
}