'use client';
import AuthForm from '../../components/auth/AuthForm';
import AuthNavbar from '../../components/views/Navbar';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

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
          className="backdrop-blur-xl bg-white/10 border border-[#38bdf8]/20 shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-xl mx-2"
        >
          <AuthForm type="login" />
        </motion.div>
      </main>
    </div>
  );
}
