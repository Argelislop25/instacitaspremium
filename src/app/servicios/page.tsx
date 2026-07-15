import Link from 'next/link';

// Estructura de datos universal (Listo para conectarse a tu Base de Datos en el futuro)
const SERVICIOS_CONFIGURABLES = [
  {
    id: 'servicio-1',
    name: 'Plan Launchpad',
    duration: '30 min',
    price: '$20',
    description: 'Tu sistema de citas automatizado, listo para recibir clientes y organizar tu agenda sin esfuerzo.',
  },
  {
    id: 'servicio-2',
    name: 'Programa de Digitalización',
    duration: '60 min',
    price: '$150 - 300',
    description: 'Landing page profesional con tu plataforma de citas integrada para convertir visitantes en ventas reales.',
  },
  {
    id: 'servicio-3',
    name: 'Sistema de Escalamiento Élite',
    duration: '90 min',
    price: '$500+',
    description: 'Arquitectura digital completa con automatización inteligente y chatbots para que tu negocio venda en piloto automático.',
  },
];

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 pt-32 px-4 selection:bg-zinc-800">
      <div className="max-w-5xl mx-auto pb-24">
        
        {/* Cabecera Genérica y Elegante */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-3">Catálogo de Experiencias</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Diseñado para optimizar tu jornada
          </h1>
          <p className="text-zinc-400 font-light leading-relaxed">
            Selecciona la opción que mejor se adapte a tu agenda. Cada sesión está estructurada para ofrecer resultados de alto nivel respetando rigurosamente tu tiempo.
          </p>
        </div>

        {/* Rejilla Dinámica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICIOS_CONFIGURABLES.map((servicio) => (
            <div 
              key={servicio.id}
              className="relative p-8 rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Métricas del servicio */}
                <div className="flex items-center justify-between font-mono text-xs text-zinc-500 mb-6">
                  <span>{servicio.duration}</span>
                  <span className="text-white font-semibold bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                    {servicio.price}
                  </span>
                </div>

                {/* Título Dinámico */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-zinc-200 transition-colors">
                  {servicio.name}
                </h3>

                {/* Descripción Genérica */}
                <p className="text-sm text-zinc-400 leading-relaxed font-light mb-8">
                  {servicio.description}
                </p>
              </div>

              {/* Botón de Enlace que pasa el ID por la URL */}
              <Link 
                href={`/reservar?servicio=${servicio.id}`}
                className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl text-center text-sm transition-all duration-200 block"
              >
                Seleccionar espacio
              </Link>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}