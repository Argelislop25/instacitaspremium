import { createClient } from '@supabase/supabase-js';
import FormularioReserva from '@/components/FormularioReserva';

// Inicializamos el cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Función refactorizada para obtener datos desde Supabase
async function obtenerNegocio(slug: string) {
  const { data, error } = await supabase
    .from('negocios_id')
    .select('*')
    .eq('slug', slug)
    .maybeSingle(); // Cambiado a maybeSingle para evitar error si no hay registros

  if (error) {
    console.error("Error al buscar negocio en Supabase:", error);
    return null;
  }
  
  return data;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const negocio = await obtenerNegocio(slug);

  if (!negocio) {
    return (
      <main className="min-h-screen bg-zinc-950 text-red-500 p-10 flex items-center justify-center">
        <h1 className="text-2xl">Negocio no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 pt-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Cambiado a minúsculas para coincidir con tu esquema */}
        <h1 className="text-3xl font-bold text-white mb-2">{negocio.nombre}</h1>
        <p className="text-zinc-500 mb-10">Agenda tu cita profesional fácilmente.</p>
        
        <div className="text-left">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Agenda tu Cita</h2>
          {/* Cambiado a minúsculas */}
          <FormularioReserva negocioId={negocio.id} />
        </div>
      </div>
    </main>
  );
}