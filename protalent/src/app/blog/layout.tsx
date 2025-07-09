'use client';

import { Inter } from 'next/font/google';
import Sidebar from './components/sidebar';
import './blog-styles.css';

const inter = Inter({ subsets: ['latin'] });

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-100`}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <main className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
