import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  ChevronDown, Search, Menu, Briefcase, Settings, LineChart, 
  Code, User, Palette, ChevronRight, type LucideIcon 
} from 'lucide-react';

// 1. Definimos la interfaz estricta para la estructura de categorías
interface Category {
  id: string;
  title: string;
  icon: LucideIcon; // Tipado específico para los componentes de lucide-react
  subcategories: string[];
  image: string;
}

// 2. Aplicamos la interfaz al arreglo de datos
const CATEGORIES_DATA: Category[] = [
  {
    id: 'finanzas',
    title: 'Finanzas y Negocios',
    icon: Briefcase,
    subcategories: ['Contabilidad', 'Finanzas', 'Inversiones', 'Emprendimiento', 'Administración'],
    image: '/src/assets/cat-finanzas.jfif'
  },
  {
    id: 'gestion',
    title: 'Gestión y Operaciones',
    icon: Settings,
    subcategories: ['Gestión de proyectos', 'Productividad', 'Gestión de operaciones', 'Gestión de procesos', 'Gestión de calidad'],
    image: '/src/assets/cat-gestion.jpg'
  },
  {
    id: 'marketing',
    title: 'Marketing y Ventas',
    icon: LineChart,
    subcategories: ['Marketing', 'Marketing digital', 'Trade marketing', 'Branding', 'Ventas', 'E-commerce', 'Gestión comercial', 'Experiencia al cliente', 'Redes sociales'],
    image: '/src/assets/cat-marketing.jfif'
  },
  {
    id: 'tecnologia',
    title: 'Tecnología y Data',
    icon: Code,
    subcategories: ['Programación', 'Desarrollo de software', 'Desarrollo web', 'Data analytics', 'Machine learning', 'Informática', 'Inteligencia artificial', 'Automatización', 'Transformación digital'],
    image: '/src/assets/cat-tecnologia.jpg'
  },
  {
    id: 'desarrollo',
    title: 'Desarrollo Profesional',
    icon: User,
    subcategories: ['Liderazgo', 'Mindset', 'Habilidades blandas', 'People management'],
    image: '/src/assets/cat-desarrollo.jfif'
  },
  {
    id: 'creatividad',
    title: 'Creatividad y Diseño',
    icon: Palette,
    subcategories: ['Diseño gráfico', 'Creatividad aplicada', 'UX/UI', 'Producto digital', 'Fotografía y video'],
    image: '/src/assets/cat-creatividad.jfif'
  }
];

export default function Navbar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  // Tipamos el estado inicial basado en nuestra interfaz
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES_DATA[0]);

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* Logo y Categorías */}
          <div className="flex items-center gap-8">
            <div className="flex items-center cursor-pointer">
              <span className="text-2xl font-bold text-white tracking-tight">
                Lerny<span className="text-[#FFD147]">mart</span>
              </span>
            </div>

            {/* Menú Categorías */}
            <div className="relative hidden md:block" onMouseLeave={() => setIsCategoryOpen(false)}>
              <button 
                onMouseEnter={() => setIsCategoryOpen(true)}
                className="flex items-center gap-2 text-white font-medium hover:text-[#FFD147] transition-colors py-8"
              >
                Categorías
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown de Categorías */}
              {isCategoryOpen && (
                <div className="absolute top-[72px] left-0 w-[800px] bg-[#111111] border border-gray-800 rounded-xl shadow-2xl flex z-50 overflow-hidden">
                  
                  {/* Lista Izquierda */}
                  <div className="w-[40%] flex flex-col p-3 border-r border-gray-800 gap-1">
                    {CATEGORIES_DATA.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory.id === cat.id;
                      
                      return (
                        <button
                          key={cat.id}
                          onMouseEnter={() => setActiveCategory(cat)}
                          onClick={() => {
                            console.log(`Redirigiendo a marketplace con filtro: ${cat.id}`);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full flex justify-between items-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                            isActive 
                              ? 'bg-[#FFD147] text-black' 
                              : 'text-gray-300 hover:bg-[#222222] hover:text-white'
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

                  {/* Panel Derecho */}
                  <div className="w-[60%] p-6 flex flex-col justify-between bg-[#1A1A1A]">
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                        {activeCategory.title}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                        {activeCategory.subcategories.map((sub, idx) => (
                          <a 
                            key={idx} 
                            href="#" 
                            className="text-sm text-gray-300 hover:text-[#FFD147] transition-colors"
                          >
                            {sub}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                      <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-800">
                        <img 
                          src={activeCategory.image} 
                          alt={activeCategory.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                      <button className="w-full bg-[#FFD147] text-black font-bold py-2.5 rounded-lg text-sm hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Ver Todos
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* Buscador y Botones (Sin cambios) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD147] sm:text-sm font-medium" 
                placeholder="¿Qué quieres aprender hoy?" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            <Link 
              to="/login"
              className="hidden sm:block px-5 py-2 border border-white text-white rounded-lg text-sm font-bold hover:bg-white hover:text-black transition-all"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register"
              className="px-5 py-2 bg-[#FFD147] text-black rounded-lg text-sm font-bold hover:bg-yellow-400 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
            >
              Regístrate
            </Link>
            
            <button className="md:hidden text-white ml-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}