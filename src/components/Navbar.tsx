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
import { useCart } from '../contexts/CartContext';
import { CATALOG_CATEGORIES } from '../data/catalogCategories';

interface Category {
  id: string;
  title: string;
  icon: LucideIcon;
  subcategories: string[];
  image: string;
}

const ICON_BY_CATEGORY: Record<string, LucideIcon> = {
  finanzas: Briefcase,
  gestion: Settings,
  marketing: LineChart,
  tecnologia: Code,
  desarrollo: User,
  creatividad: Palette,
};

const IMAGE_BY_CATEGORY: Record<string, string> = {
  finanzas: '/src/assets/cat-finanzas.jfif',
  gestion: '/src/assets/cat-gestion.jpg',
  marketing: '/src/assets/cat-marketing.jfif',
  tecnologia: '/src/assets/cat-tecnologia.jpg',
  desarrollo: '/src/assets/cat-desarrollo.jfif',
  creatividad: '/src/assets/cat-creatividad.jfif',
};

const CATEGORIES_DATA: Category[] = CATALOG_CATEGORIES.map((category) => ({
  ...category,
  icon: ICON_BY_CATEGORY[category.id] || Briefcase,
  image: IMAGE_BY_CATEGORY[category.id] || '/src/assets/cat-finanzas.jfif',
}));

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES_DATA[0]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const profileWrapRef = useRef<HTMLDivElement>(null);
  const cartWrapRef = useRef<HTMLDivElement>(null);
  const { items, removeFromCart, getTotalItems, getTotalPrice } = useCart();

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

  useEffect(() => {
    if (!cartOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (cartWrapRef.current && !cartWrapRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [cartOpen]);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut(auth);
    navigate('/', { replace: true });
  };

  const iconBtnClass =
    'hidden sm:flex w-[42px] h-[36px] shrink-0 items-center justify-center rounded-[10px] border border-white/60 text-white hover:bg-white/10 transition-colors';

  return (
    <nav className="bg-black sticky top-0 z-50 border-b border-[#222222]">
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-16 gap-5">
          <div className="flex items-center gap-5 min-w-0 flex-1">
            {user ? (
              <Link to="/marketplace" className="flex items-center shrink-0 no-underline gap-2">
                <span className="text-[30px] leading-none font-bold text-white tracking-tight">
                  Lerny<span className="text-[#FFD147]">mart</span>
                </span>
              </Link>
            ) : (
              <button
                type="button"
                className="flex items-center shrink-0 no-underline gap-2 bg-transparent border-none p-0 cursor-default"
                aria-label="Lernymart"
              >
                <span className="text-[30px] leading-none font-bold text-white tracking-tight">
                  Lerny<span className="text-[#FFD147]">mart</span>
                </span>
              </button>
            )}

            <div className="relative hidden md:flex items-center h-16 shrink-0" onMouseLeave={() => setIsCategoryOpen(false)}>
              <button
                type="button"
                onMouseEnter={() => setIsCategoryOpen(true)}
                className="flex items-center gap-2 text-white text-[15px] font-medium hover:text-[#FFD147] transition-colors h-full"
              >
                Categorías
                <ChevronDown className={`w-[18px] h-[18px] transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-16 left-0 w-[800px] bg-[#111111] border border-gray-800 rounded-xl shadow-2xl flex z-50 overflow-hidden">
                  <div className="w-[40%] flex flex-col p-3 border-r border-gray-800 gap-1">
                    {CATEGORIES_DATA.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory.id === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onMouseEnter={() => setActiveCategory(cat)}
                          onClick={() => {
                            setIsCategoryOpen(false);
                            navigate(`/catalog/${cat.id}`);
                          }}
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
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setIsCategoryOpen(false);
                              navigate(`/catalog/${activeCategory.id}?sub=${encodeURIComponent(sub)}`);
                            }}
                            className="text-sm text-gray-300 hover:text-[#FFD147] transition-colors bg-transparent border-none p-0 text-left cursor-pointer"
                          >
                            {sub}
                          </button>
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

            <div className="hidden lg:block relative w-full max-w-[320px] z-[1001]">
              <div className="relative rounded-lg border-2 border-transparent bg-[#f3f4f6] bg-clip-padding">
                <div className="relative flex items-center h-9">
                  <div className="absolute left-4 text-black flex items-center pointer-events-none">
                    <Search className="w-[14px] h-[14px]" />
                  </div>
                  <input
                    type="text"
                    className="w-full h-full pl-12 pr-4 rounded-[24px] border-none outline-none text-[15px] bg-[#f3f4f6] text-[#111111] font-medium"
                    placeholder="¿Qué quieres aprender hoy?"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0 ml-auto">
            {user ? (
              <>
                <div className="flex items-center gap-[15px]">
                  <button type="button" className={iconBtnClass} aria-label="Notificaciones">
                    <Bell className="w-5 h-5" strokeWidth={1.9} />
                  </button>
                  <div className="relative" ref={cartWrapRef}>
                    <button type="button" onClick={() => setCartOpen((o) => !o)} className={iconBtnClass} aria-label="Carrito">
                      <ShoppingCart className="w-5 h-5" strokeWidth={1.9} />
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#FFC847] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </button>
                    {cartOpen && (
                      <div className="absolute right-0 top-12 w-80 md:w-96 bg-[#000000] border border-[#222222] rounded-xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#222222]">
                          <h3 className="font-bold text-sm text-white">Resumen de carrito ({items.length})</h3>
                          <button type="button" onClick={() => setCartOpen(false)}>
                            <i className="ri-close-line w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-2">
                          {items.length === 0 ? (
                            <p className="text-sm text-gray-400">Tu carrito está vacío.</p>
                          ) : (
                            items.map((item) => (
                              <div key={item.id} className="flex gap-3 bg-[#0A0A0A] p-2 rounded-lg relative group border border-transparent hover:border-[#FFC847]/30 transition-all">
                                <img
                                  className="w-16 h-12 object-cover rounded bg-gray-800 shrink-0"
                                  alt={item.title}
                                  src={item.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000'}
                                />
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-xs font-bold text-white truncate leading-tight">{item.title}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">{item.instructor || 'LernyMart'}</p>
                                  <p className="text-xs text-[#ffc847] font-bold mt-1">US$ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                >
                                  <i className="ri-close-line w-3 h-3 text-white" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="pt-2 border-t border-[#222222]">
                          <div className="flex justify-between items-center text-sm font-bold mb-4 text-white">
                            <span>Total:</span>
                            <span className="text-[#ffc847] text-lg">US$ {getTotalPrice().toFixed(2)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCartOpen(false);
                              navigate('/cart');
                            }}
                            className="w-full bg-[#ffc847] hover:bg-[#f0bb32] text-black font-bold h-10 rounded-md"
                          >
                            Ir a detalle de compra
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button type="button" className={iconBtnClass} aria-label="Lista de deseos">
                    <Heart className="w-5 h-5" strokeWidth={1.9} />
                  </button>
                </div>
                <div className="relative" ref={profileWrapRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2 cursor-pointer px-[10px] py-[5px] rounded-lg hover:bg-white/10 transition-colors"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <img
                      src={user.photoURL || DEFAULT_AVATAR}
                      alt=""
                      className="w-[34px] h-[34px] rounded-full object-cover border-[1.5px] border-[#FFC847] bg-[#333333]"
                      referrerPolicy="no-referrer"
                    />
                    <ChevronDown className={`w-[18px] h-[18px] text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#1a1a1a] border border-gray-800 shadow-2xl py-3 z-[60]">
                      <p className="px-4 pb-2 text-sm text-gray-300">
                        Hola, <span className="font-bold text-white">{displayName}</span>
                      </p>
                      {/* Aquí está el cambio a to="/profile" */}
                      <Link
                        to="/profile"
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
                  className="hidden sm:block px-4 py-2 border border-white text-white rounded-md text-sm font-semibold hover:bg-white hover:text-black transition-all no-underline"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#FFD147] text-black rounded-md text-sm font-bold hover:bg-yellow-400 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.25)] no-underline"
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