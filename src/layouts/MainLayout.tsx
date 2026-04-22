import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const authRoutes = ['/login', '/register'];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FCFAF6]">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}