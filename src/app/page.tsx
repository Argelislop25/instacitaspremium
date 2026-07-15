import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 overflow-x-hidden selection:bg-zinc-800">
      
      {/* Hero Section Container */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-24 text-center max-w-4xl mx-auto">
        
      {/* Reemplazo para el badge superior */}
        <div className="relative inline-flex mb-6 group">
          <div className="absolute transition-all duration-1000 opacity-30 -inset-px bg-gradient-to-r from-zinc-700 via-white to-zinc-700 rounded-xl blur-sm group-hover:opacity-50" />
          <div className="relative inline-flex items-center px-4 py-1.5 text-xs text-zinc-300 bg-zinc-950 border border-zinc-800/50 rounded-xl font-light tracking-wide">
            Experience Layer <span className="text-zinc-600 mx-2">|</span> 2026 Edition
          </div>
        </div>

        {/* Título Principal de Alto Impacto */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
          Gestiona tus citas de forma eficaz 
        </h1>

        {/* Subtítulo / Descripción */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Diseñado para profesionales que valoran su tiempo y el de sus clientes. Automatiza tu agenda, reduce ausencias y ofrece una experiencia premium desde el primer clic.
        </p>

        {/* Botones de Acción (Call to Action) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/reservar?servicio=servicio-1"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-zinc-950 font-medium rounded-xl hover:bg-zinc-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5 text-center"
          >
            Inicia tu plan hoy por solo $20
          </Link>
          <Link 
            href="/servicios" 
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 text-zinc-300 border border-zinc-800 font-medium rounded-xl hover:bg-zinc-800 hover:text-white transition-all duration-200 hover:border-zinc-700 text-center"
          >
            Ver Mas Planes
          </Link>
        </div>

        {/* Decoración de fondo sutil (Efecto de resplandor premium) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      </section>

      {/* --- NUEVA SECCIÓN: FEATURES GRID --- */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta 1 */}
          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-6 group-hover:border-zinc-700 transition-colors">
              ⚡
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Reserva en Segundos</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Interfaz optimizada para que tus clientes agenden su espacio en menos de tres clics, sin fricciones ni retrasos.
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-6 group-hover:border-zinc-700 transition-colors">
              ✨
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Diseño Simple</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Una estética limpia y oscura que eleva la percepción de tu marca y se adapta perfectamente a cualquier dispositivo.
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-6 group-hover:border-zinc-700 transition-colors">
              🔒
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Control Absoluto</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Gestiona tus horarios disponibles, bloquea fechas y visualiza tu agenda de manera centralizada y segura.
            </p>
          </div>

        </div>
      </section>


    </main>
  );
}