'use client';
import LoginForm from '../../components/auth/LoginForm';
import AuthNavbar from '../../components/views/Navbar';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';

const DotGrid = dynamic(
  () => import('../../components/ui/DotGrid'),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#062056] to-black">
      <AuthNavbar />
      <DotGrid
        dotSize={4}
        gap={16}
        baseColor="#062056"
        activeColor="#38bdf8"
        proximity={200}
        shockRadius={250}
        shockStrength={20}
        resistance={1200}
        returnDuration={2}
        className="fixed inset-0 z-0 opacity-30"
      />
      <main className="relative z-10 flex flex-col items-center justify-center w-full min-h-[calc(100vh-4rem)] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl mx-2" 
        >
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <div className="relative z-10 w-full max-w-md px-4">
              <LoginForm />
            </div>
          </GoogleOAuthProvider>
        </motion.div>
      </main>
    </div>
  );
}
