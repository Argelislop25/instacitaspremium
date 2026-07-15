import sql from 'mssql';
import FormularioReserva from '@/components/FormularioReserva';

// Función para obtener los datos del negocio desde tu SQL
async function obtenerNegocio(slug: string) {
  const pool = await sql.connect({
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    server: process.env.DB_SERVER!,
    database: process.env.DB_DATABASE!,
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  });

  const result = await pool.request()
    .input('slug', sql.VarChar, slug)
    .query('SELECT * FROM Negocios WHERE Slug = @slug');
    
  return result.recordset[0];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Ahora esperamos a que params se resuelva
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
    {/* Contenedor principal centrado */}
    <div className="max-w-4xl mx-auto text-center">
      
      {/* Nombre del Negocio - Tamaño equilibrado */}
      <h1 className="text-3xl font-bold text-white mb-2">{negocio.Nombre}</h1>
      <p className="text-zinc-500 mb-10">Agenda tu cita profesional fácilmente.</p>
      
      {/* Sección Agenda tu Cita - También centrada */}
      <div className="text-left">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Agenda tu Cita</h2>
        <FormularioReserva negocioId={negocio.Id} />
      </div>

    </div>
  </main>
);
}
