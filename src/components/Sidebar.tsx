import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, ChevronDown, ChevronUp, User, 
  LogOut, Menu, Briefcase, Shield, ShoppingBag, Settings 
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext'; 

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const { userData } = useAuth(); 

  // Verificamos roles
  const isCreator = userData?.role === 'afiliado' || userData?.role === 'infoproductor';
  const isAdmin = userData?.role === 'admin';

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'productos': false,
    'perfil': false,
    'sistema': false, 
  });

  useEffect(() => {
    if (path.includes('/mis-productos') || path.includes('/crear-producto')) {
      setOpenMenus(prev => ({ ...prev, productos: true }));
    }
    if (path.includes('/profile')) {
      setOpenMenus(prev => ({ ...prev, perfil: true }));
    }
    if (path.includes('/admin')) {
      setOpenMenus(prev => ({ ...prev, sistema: true }));
    }
  }, [path]);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const isActive = (route: string) => path === route;
  const isGroupActive = (group: string) => {
    if (group === 'productos') return path.includes('/mis-productos') || path.includes('/crear-producto');
    if (group === 'perfil') return path.includes('/profile');
    if (group === 'sistema') return path.includes('/admin');
    return false;
  };

  return (
    <aside className="w-[280px] bg-[#0A0A0A] text-white flex-shrink-0 hidden lg:flex flex-col border-r border-gray-800">
      
      {/* Cabecera */}
      <div className="p-6 flex items-center justify-between">
        <span className="text-xs font-black tracking-widest text-gray-400">NAVEGACIÓN</span>
        <Menu className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
      </div>

      {/* Buscador */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#FFC847] transition-colors" 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-2">

        {/* ====================================
            Menú: Sistema (SOLO PARA ADMINS)
        ==================================== */}
        {isAdmin && (
          <div>
            <button 
              onClick={() => toggleMenu('sistema')} 
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#1A1A1A] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Settings className={`w-5 h-5 ${isGroupActive('sistema') ? 'text-[#FFC847]' : 'text-gray-400 group-hover:text-[#FFC847]'}`} />
                <span className={`font-semibold text-sm ${isGroupActive('sistema') ? 'text-[#FFC847]' : 'text-white'}`}>
                  Sistema
                </span>
              </div>
              {openMenus['sistema'] ? 
                <ChevronUp className={`w-4 h-4 ${isGroupActive('sistema') ? 'text-[#FFC847]' : 'text-gray-500'}`} /> : 
                <ChevronDown className={`w-4 h-4 ${isGroupActive('sistema') ? 'text-[#FFC847]' : 'text-gray-500'}`} />
              }
            </button>
            
            {openMenus['sistema'] && (
              <div className="flex flex-col gap-1 pl-11 pr-3 py-2 relative">
                {/* Barra indicadora amarilla (se mueve según la ruta activa) */}
                <div className="absolute left-6 top-3 bottom-2 w-0.5 bg-gray-800">
                  {isActive('/admin/dashboard') && <div className="absolute top-0 left-0 w-full h-6 bg-[#FFC847] rounded-full"></div>}
                  {isActive('/admin/usuarios') && <div className="absolute top-[32px] left-0 w-full h-6 bg-[#FFC847] rounded-full"></div>}
                  {isActive('/admin/cursos') && <div className="absolute top-[64px] left-0 w-full h-6 bg-[#FFC847] rounded-full"></div>}
                  {isActive('/admin/servicios') && <div className="absolute top-[96px] left-0 w-full h-6 bg-[#FFC847] rounded-full"></div>}
                  {/* Comisiones sería el top-[128px], pero lo saltamos en el Link de abajo */}
                  {isActive('/admin/verificacion') && <div className="absolute top-[160px] left-0 w-full h-6 bg-[#FFC847] rounded-full"></div>}
                </div>
                
                <Link 
                  to="/admin/dashboard" 
                  className={`text-sm py-1.5 block transition-colors ${isActive('/admin/dashboard') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Dashboard Admin
                </Link>
                <Link 
                  to="/admin/usuarios" 
                  className={`text-sm py-1.5 block transition-colors ${isActive('/admin/usuarios') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Gestión de Usuarios
                </Link>
                <Link 
                  to="/admin/cursos" 
                  className={`text-sm py-1.5 block transition-colors ${isActive('/admin/cursos') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Gestión de Cursos
                </Link>
                <Link 
                  to="/admin/servicios" 
                  className={`text-sm py-1.5 block transition-colors ${isActive('/admin/servicios') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Servicios Infoproductor
                </Link>
                <a href="#" className="text-sm py-1.5 block transition-colors text-gray-400 hover:text-white">
                  Comisiones
                </a>
                <Link 
                  to="/admin/verificacion" 
                  className={`text-sm py-1.5 block transition-colors ${isActive('/admin/verificacion') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Verificación de Tutores
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* ====================================
            Menú: Mis Infoproductos (SOLO PARA CREADORES)
        ==================================== */}
        {isCreator && (
          <div>
            <button 
              onClick={() => toggleMenu('productos')} 
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#1A1A1A] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`w-5 h-5 ${isGroupActive('productos') ? 'text-[#FFC847]' : 'text-gray-400 group-hover:text-[#FFC847]'}`} />
                <span className={`font-semibold text-sm ${isGroupActive('productos') ? 'text-[#FFC847]' : 'text-white'}`}>
                  Mis Infoproductos
                </span>
              </div>
              {openMenus['productos'] ? 
                <ChevronUp className={`w-4 h-4 ${isGroupActive('productos') ? 'text-[#FFC847]' : 'text-gray-500'}`} /> : 
                <ChevronDown className={`w-4 h-4 ${isGroupActive('productos') ? 'text-[#FFC847]' : 'text-gray-500'}`} />
              }
            </button>
            
            {openMenus['productos'] && (
              <div className="flex flex-col gap-1 pl-11 pr-3 py-2 relative">
                <div className="absolute left-6 top-3 bottom-2 w-0.5 bg-gray-800">
                  {isActive('/crear-producto') && <div className="absolute top-0 left-0 w-full h-6 bg-[#FFC847] rounded-full"></div>}
                  {isActive('/mis-productos') && <div className="absolute top-[32px] left-0 w-full h-6 bg-[#FFC847] rounded-full"></div>}
                </div>
                
                <Link 
                  to="/crear-producto" 
                  className={`text-sm py-1.5 block transition-colors ${isActive('/crear-producto') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Crear un nuevo Infoproducto
                </Link>
                <Link 
                  to="/mis-productos" 
                  className={`text-sm py-1.5 block transition-colors ${isActive('/mis-productos') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  Ver todos mis Infoproductos
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ====================================
            Menú: Mi perfil (VISIBLE PARA TODOS)
        ==================================== */}
        <div>
          <button 
            onClick={() => toggleMenu('perfil')} 
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#1A1A1A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <User className={`w-5 h-5 ${isGroupActive('perfil') ? 'text-[#FFC847]' : 'text-gray-400 group-hover:text-[#FFC847]'}`} />
              <span className={`font-semibold text-sm ${isGroupActive('perfil') ? 'text-[#FFC847]' : 'text-white'}`}>
                Mi perfil
              </span>
            </div>
            {openMenus['perfil'] ? 
              <ChevronUp className={`w-4 h-4 ${isGroupActive('perfil') ? 'text-[#FFC847]' : 'text-gray-500'}`} /> : 
              <ChevronDown className={`w-4 h-4 ${isGroupActive('perfil') ? 'text-[#FFC847]' : 'text-gray-500'}`} />
            }
          </button>
          
          {openMenus['perfil'] && (
            <div className="flex flex-col gap-1 pl-11 pr-3 py-2 relative">
              <div className="absolute left-6 top-3 bottom-2 w-0.5 bg-gray-800">
                {isActive('/profile') && <div className="absolute top-0 left-0 w-full h-6 bg-[#FFC847] rounded-full"></div>}
              </div>
              
              <Link 
                to="/profile" 
                className={`text-sm py-1.5 block transition-colors ${isActive('/profile') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Detalles de la cuenta
              </Link>
              <a href="#" className="text-sm text-gray-400 hover:text-white py-1.5 flex items-center gap-2 transition-colors"><Shield className="w-4 h-4"/> Seguridad y Privacidad</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white py-1.5 flex items-center gap-2 transition-colors"><ShoppingBag className="w-4 h-4"/> Mis compras</a>
            </div>
          )}
        </div>

      </div>

      {/* Footer del Sidebar */}
      <div className="p-6 border-t border-gray-800">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </button>
      </div>

    </aside>
  );
}