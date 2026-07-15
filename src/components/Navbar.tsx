import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md fixed top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-wider">
          InstaCitas<span className="text-zinc-500">Premium</span>
        </Link>
        <div className="space-x-6 text-sm text-zinc-300">
          <Link href="/servicios" className="hover:text-white transition-colors">Planes</Link>
          <Link href="/login" className="px-4 py-2 bg-white text-black rounded-lg">
              Entrar
            </Link>
        </div>
      </div>
    </nav>
  );
}