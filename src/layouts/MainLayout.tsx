import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Navbar />
      {/* El contenido de las páginas crecerá para llenar el espacio */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}