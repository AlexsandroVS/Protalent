import { AuthProvider } from './context/auth/AuthContext';
import './globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}