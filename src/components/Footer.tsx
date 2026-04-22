import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-900 relative overflow-hidden">
      
      {/* Elementos decorativos (simulando las líneas geométricas de tu diseño) */}
      <div className="absolute top-0 left-0 w-64 h-full opacity-20 pointer-events-none border-r border-dashed border-gray-600 -skew-x-12 -translate-x-32"></div>
      <div className="absolute top-0 right-0 w-64 h-full opacity-20 pointer-events-none border-l border-dashed border-gray-600 skew-x-12 translate-x-32"></div>

      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
          
          {/* Columna 1: Logo y Redes */}
          <div className="col-span-1 border-r border-gray-800 pr-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-white tracking-tight">
                Lerny<span className="text-[#FFD147]">mart</span>
              </span>
            </div>
            <p className="text-sm text-gray-300 font-medium mb-6">
              Conoce sobre nosotros aquí.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-[#FFD147] flex items-center justify-center text-black hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#FFD147] flex items-center justify-center text-black hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#FFD147] flex items-center justify-center text-black hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Sobre */}
          <div className="border-r border-gray-800 pl-4">
            <h4 className="font-bold text-lg mb-6">Sobre</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Categorías</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nosotros</a></li>
            </ul>
          </div>

          {/* Columna 3: Ayuda */}
          <div className="border-r border-gray-800 pl-4">
            <h4 className="font-bold text-lg mb-6">Ayuda</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos de la plataforma</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Libro de Reclamaciones</a></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="pl-4">
            <h4 className="font-bold text-lg mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#FFD147] mt-0.5" /> 
                <span>+51 986 123 418</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#FFD147] mt-0.5" /> 
                <span>info@lernymart.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FFD147] mt-0.5 flex-shrink-0" /> 
                <span>Centro Empresarial<br/>PLEXUS, San Miguel, Lima</span>
              </li>
            </ul>
          </div>

        </div>
        <div className="text-center text-xs font-medium text-gray-500">
          © 2026 LernyMart. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}