import { AuthProvider } from './context/auth/AuthContext';
import { ChatProvider } from './context/chat/ChatContext';
import ChatNotification from './components/ChatNotification';
import './globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <ChatProvider>
            <main>{children}</main>
            <ChatNotification />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}