'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard/ofertas', label: 'Ver Ofertas', icon: '👀' },
  { href: '/dashboard/ofertas/crear', label: 'Crear Oferta', icon: '➕' },
];

export default function OfertasNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-4 mb-8">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-full 
            font-semibold transition-all duration-300 
            transform hover:scale-105 shadow-lg
            ${pathname === item.href
              ? 'bg-[#38bdf8] text-[#062056] hover:bg-[#0ea5e9]'
              : 'bg-white/10 text-white/80 backdrop-blur-lg border border-white/20 hover:bg-white/20'
            }
          `}
        >
          <span className="text-xl">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
} 