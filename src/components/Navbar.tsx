import { useState } from 'react';
import { ChevronDown, BookOpen, Briefcase, ShieldAlert, Rocket } from 'lucide-react';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Aquí aplicamos el contenedor amplio que acordamos */}
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-[#0056FF] p-2 rounded-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SkillNet</span>
          </div>

          {/* Enlaces centrales */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#" className="hover:text-[#0056FF] transition-colors">Cursos</a>
            <a href="#" className="hover:text-[#0056FF] transition-colors">Certificaciones</a>
            <a href="#" className="hover:text-[#0056FF] transition-colors">Para Creadores</a>
          </div>

          {/* Botones derechos */}
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-[#0056FF] hover:bg-gray-50 transition-colors"
            >
              Entrar
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-12 right-32 w-64 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                <button className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600"><BookOpen className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Ver mis productos</p>
                    <p className="text-xs text-slate-500">Accede a tus cursos</p>
                  </div>
                </button>
                <button className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                  <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Briefcase className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Gestionar negocio</p>
                    <p className="text-xs text-slate-500">Ventas y productos</p>
                  </div>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                  <div className="bg-red-100 p-2 rounded-full text-red-600"><ShieldAlert className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Gestión Admin</p>
                    <p className="text-xs text-slate-500">Acceso restringido</p>
                  </div>
                </button>
              </div>
            )}

            <button className="px-6 py-2 bg-[#0056FF] text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
              Registrarse
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}