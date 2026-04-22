import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Search,
  Menu,
  Briefcase,
  Settings,
  LineChart,
  Code,
  User,
  Palette,
  ChevronRight,
  Bell,
  ShoppingCart,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: string;
  title: string;
  icon: LucideIcon;
  subcategories: string[];
  image: string;
}

const CATEGORIES_DATA: Category[] = [
  {
    id: 'finanzas',
    title: 'Finanzas y Negocios',
    icon: Briefcase,
    subcategories: ['Contabilidad', 'Finanzas', 'Inversiones', 'Emprendimiento', 'Administración'],
    image: '/src/assets/cat-finanzas.jfif',
  },
  {
    id: 'gestion',
    title: 'Gestión y Operaciones',
    icon: Settings,
    subcategories: ['Gestión de proyectos', 'Productividad', 'Gestión de operaciones', 'Gestión de procesos', 'Gestión de calidad'],
    image: '/src/assets/cat-gestion.jpg',
  },
  {
    id: 'marketing',
    title: 'Marketing y Ventas',
    icon: LineChart,
    subcategories: ['Marketing', 'Marketing digital', 'Trade marketing', 'Branding', 'Ventas', 'E-commerce', 'Gestión comercial', 'Experiencia al cliente', 'Redes sociales'],
    image: '/src/assets/cat-marketing.jfif',
  },
  {
    id: 'tecnologia',
    title: 'Tecnología y Data',
    icon: Code,
    subcategories: ['Programación', 'Desarrollo de software', 'Desarrollo web', 'Data analytics', 'Machine learning', 'Informática', 'Inteligencia artificial', 'Automatización', 'Transformación digital'],
    image: '/src/assets/cat-tecnologia.jpg',
  },
  {
    id: 'desarrollo',
    title: 'Desarrollo Profesional',
    icon: User,
    subcategories: ['Liderazgo', 'Mindset', 'Habilidades blandas', 'People management'],
    image: '/src/assets/cat-desarrollo.jfif',
  },
  {
    id: 'creatividad',
    title: 'Creatividad y Diseño',
    icon: Palette,
    subcategories: ['Diseño gráfico', 'Creatividad aplicada', 'UX/UI', 'Producto digital', 'Fotografía y video'],
    image: '/src/assets/cat-creatividad.jfif',
  },
];

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES_DATA[0]);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileWrapRef = useRef<HTMLDivElement>(null);

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split('@')[0]?.toUpperCase() ||
    'Usuario';

  useEffect(() => {
    if (!profileOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (profileWrapRef.current && !profileWrapRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [profileOpen]);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut(auth);
    navigate('/', { replace: true });
  };

  const iconBtnClass =
    'hidden sm:flex w-10 h-10 shrink-0 items-center justify-center rounded-lg border border-gray-600 text-white hover:bg-white/10 transition-colors';

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          <div className="flex items-center gap-8 min-w-0">
            <Link to="/" className="flex items-center shrink-0 no-underline">
              <span className="text-2xl font-bold text-white tracking-tight">
                Lerny<span className="text-[#FFD147]">mart</span>
              </span>
            </Link>

            <div className="relative hidden md:block" onMouseLeave={() => setIsCategoryOpen(false)}>
              <button
                type="button"
                onMouseEnter={() => setIsCategoryOpen(true)}
                className="flex items-center gap-2 text-white font-medium hover:text-[#FFD147] transition-colors py-8"
              >
                Categorías
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-[72px] left-0 w-[800px] bg-[#111111] border border-gray-800 rounded-xl shadow-2xl flex z-50 overflow-hidden">
                  <div className="w-[40%] flex flex-col p-3 border-r border-gray-800 gap-1">
                    {CATEGORIES_DATA.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory.id === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onMouseEnter={() => setActiveCategory(cat)}
                          onClick={() => setIsCategoryOpen(false)}
                          className={`w-full flex justify-between items-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                            isActive ? 'bg-[#FFD147] text-black' : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span>{cat.title}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-500'}`} />
                        </button>
                      );
                    })}
                  </div>

                  <div className="w-[60%] p-6 flex flex-col justify-between bg-[#1A1A1A]">
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{activeCategory.title}</h3>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                        {activeCategory.subcategories.map((sub, idx) => (
                          <a key={idx} href="#" className="text-sm text-gray-300 hover:text-[#FFD147] transition-colors">
                            {sub}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-auto">
                      <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-800">
                        <img src={activeCategory.image} alt={activeCategory.title} className="w-full h-full object-cover opacity-80" />
                      </div>
                      <button
                        type="button"
                        className="w-full bg-[#FFD147] text-black font-bold py-2.5 rounded-lg text-sm hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Ver Todos
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-xl mx-8 min-w-0">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-full pl-10 pr-3 py-2.5 border border-transparent bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD147] sm:text-sm font-medium"
                placeholder="¿Qué quieres aprender hoy?"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <>
                <button type="button" className={iconBtnClass} aria-label="Notificaciones">
                  <Bell className="w-5 h-5" strokeWidth={1.75} />
                </button>
                <button type="button" className={iconBtnClass} aria-label="Carrito">
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
                </button>
                <button type="button" className={iconBtnClass} aria-label="Lista de deseos">
                  <Heart className="w-5 h-5" strokeWidth={1.75} />
                </button>
                <div className="relative pl-1" ref={profileWrapRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-1.5 rounded-lg p-1 pr-2 hover:bg-white/10 transition-colors"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <img
                      src={user.photoURL || DEFAULT_AVATAR}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-gray-600"
                      referrerPolicy="no-referrer"
                    />
                    <ChevronDown className={`w-4 h-4 text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#1a1a1a] border border-gray-800 shadow-2xl py-3 z-[60]">
                      <p className="px-4 pb-2 text-sm text-gray-300">
                        Hola, <span className="font-bold text-white">{displayName}</span>
                      </p>
                      <Link
                        to="/"
                        className="block px-4 py-2 text-sm text-white hover:bg-white/5 no-underline"
                        onClick={() => setProfileOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        to="/"
                        className="block px-4 py-2 text-sm text-white hover:bg-white/5 no-underline"
                        onClick={() => setProfileOpen(false)}
                      >
                        Mis Cursos
                      </Link>
                      <div className="my-2 border-t border-gray-800" />
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-white/5"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block px-5 py-2 border border-white text-white rounded-lg text-sm font-bold hover:bg-white hover:text-black transition-all no-underline"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-[#FFD147] text-black rounded-lg text-sm font-bold hover:bg-yellow-400 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] no-underline"
                >
                  Regístrate
                </Link>
              </>
            )}
            <button type="button" className="md:hidden text-white ml-1" aria-label="Menú">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
