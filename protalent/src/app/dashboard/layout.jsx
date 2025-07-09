'use client';

import { Inter } from 'next/font/google';
import '../../app/globals.css';
import { AuthProvider } from '../../app/context/auth/AuthContext';
import ModernNavbar from '../../app/components/views/ModernNavbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({ children }) {
  return (
    <html lang="es">
      <body 
        className={`${inter.className} bg-gray-50 min-h-screen`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <ModernNavbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
