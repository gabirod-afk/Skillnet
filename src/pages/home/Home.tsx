import { useState } from 'react';
import { Star, Users, ShoppingCart, Clock, CheckCircle, Infinity as InfinityIcon, Rocket, ChevronLeft, ChevronRight } from 'lucide-react';

// Lista de testimonios 
const TESTIMONIOS_DATA = [
  {
    id: 1,
    name: "Carlos López",
    role: "Frontend Developer",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    text: '"El curso de IA Generativa cambió por completo mi flujo de trabajo. Las lecciones son muy prácticas y directas al grano. 100% recomendado."'
  },
  {
    id: 2,
    name: "Ana Martínez",
    role: "Data Scientist",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    text: '"Logré mi primera certificación en Machine Learning gracias a la claridad de los instructores. La plataforma es increíblemente intuitiva."'
  },
  {
    id: 3,
    name: "David Silva",
    role: "Product Manager",
    img: "https://randomuser.me/api/portraits/men/86.jpg",
    text: '"Poder estudiar a mi propio ritmo desde el celular mientras viajo al trabajo no tiene precio. Excelente calidad de contenido y profesores."'
  },
  {
    id: 4,
    name: "Laura Gómez",
    role: "UX/UI Designer",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    text: '"El nivel de detalle en los cursos de diseño y prompting para IA es de otro nivel. Mis diseños ahora son mucho más eficientes."'
  },
  {
    id: 5,
    name: "Jorge Ruiz",
    role: "Backend Developer",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    text: '"Nunca había visto una plataforma con expertos de industria tan dispuestos a resolver dudas en la comunidad. Vale cada centavo invertido."'
  }
];

export default function Home() {
  // Estado para controlar la posición del carrusel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para avanzar
  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= TESTIMONIOS_DATA.length - 3 ? 0 : prev + 1));
  };

  // Función para retroceder
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIOS_DATA.length - 3 : prev - 1));
  };

  return (
    <div className="w-full">
      {/* --- HERO SECTION --- */}
      <section className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Plataforma #1 en IA de Latinoamérica
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mt-6 leading-tight">
              SkillNet: Aprende <br/>las habilidades del <br/>futuro
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-lg">
              Aprende IA, tecnología y habilidades digitales con cursos prácticos y certificación de nivel mundial.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="bg-[#0056FF] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                Explorar cursos
              </button>
              <button className="bg-white text-slate-900 border border-gray-200 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                Ver certificaciones
              </button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Estudiante en laptop" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* --- CURSOS DESTACADOS --- */}
      <section className="bg-slate-50 py-20">
        <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Cursos Destacados en IA</h2>
          <p className="text-slate-500 mt-2">Domina las herramientas que están cambiando el mundo.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {/* Tarjeta de Curso 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="IA Course" className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" /> 4.8
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-900">IA Generativa Avanzada</h3>
                <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                  <Users className="w-4 h-4" /> 1200 estudiantes
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-xl font-extrabold text-slate-900">$29.90</span>
                  <button className="bg-blue-50 p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta de Curso 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-slate-200">
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm z-10">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" /> 4.9
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-900">Machine Learning para Negocios</h3>
                <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                  <Users className="w-4 h-4" /> 850 estudiantes
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-xl font-extrabold text-slate-900">$29.90</span>
                  <button className="bg-blue-50 p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta de Curso 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-slate-200">
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm z-10">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" /> 5.0
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-900">Mastering ChatGPT & Prompting</h3>
                <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                  <Users className="w-4 h-4" /> 2100 estudiantes
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-xl font-extrabold text-slate-900">$29.90</span>
                  <button className="bg-blue-50 p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- POR QUE UNIRSE (BENEFICIOS) --- */}
      <section className="py-20 bg-white">
        <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">¿Por qué unirse a SkillNet?</h2>
          <p className="text-slate-500 mt-2 mb-12">Diseñado para profesionales que buscan dominar las herramientas digitales de forma eficiente.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50/50 text-left">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6"><Clock className="w-6 h-6" /></div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">A tu propio ritmo</h4>
              <p className="text-slate-500 text-sm">Estudia desde cualquier lugar y en cualquier dispositivo móvil.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50/50 text-left">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6"><CheckCircle className="w-6 h-6" /></div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Certificación verificable</h4>
              <p className="text-slate-500 text-sm">Credenciales oficiales para potenciar tu CV y LinkedIn.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50/50 text-left">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6"><Users className="w-6 h-6" /></div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Expertos de industria</h4>
              <p className="text-slate-500 text-sm">Aprende de líderes con experiencia real en empresas top.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50/50 text-left">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6"><InfinityIcon className="w-6 h-6" /></div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Acceso de por vida</h4>
              <p className="text-slate-500 text-sm">Acceso ilimitado a todos tus cursos y actualizaciones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCION CERTIFICADO --- */}
      <section className="bg-[#0B152A] py-24 w-full">
        <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform -rotate-2">
            <div className="border-2 border-gray-100 rounded-xl p-8 text-center relative">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2 text-[#0056FF] font-bold"><Rocket className="w-5 h-5" /> SkillNet</div>
                <div className="text-gray-300 text-xs">ID: SN-2026-XYZ</div>
              </div>
              <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">Certificado de completitud</p>
              <h3 className="text-3xl font-serif text-slate-900 mb-4">Rodrigo Cenas</h3>
              <p className="text-slate-500 text-sm mb-4">Ha completado exitosamente la especialización en</p>
              <h4 className="text-xl font-bold text-slate-900 italic mb-10">Inteligencia Artificial Aplicada</h4>
              <div className="flex justify-between items-end border-t border-gray-200 pt-4">
                <span className="text-[10px] text-gray-400 uppercase">Director Académico</span>
                <div className="w-10 h-10 border-4 border-slate-900 rounded-md"></div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Obtén un <span className="text-[#0056FF]">certificado digital</span> verificable.
            </h2>
            <p className="text-slate-400 mt-6 text-lg">
              Impulsa tu carrera profesional mostrando tus nuevas habilidades con credenciales digitales validadas por expertos en la industria.
            </p>
            <button className="mt-8 bg-[#0056FF] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
              Ver ejemplo <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section className="py-24 bg-white">
        <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Lo que dicen nuestros estudiantes</h2>
            <div className="flex gap-4">
              <button 
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button 
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-8"
              style={{ transform: `translateX(calc(-${currentIndex * 100}% / 3 - ${currentIndex * 2}rem))` }}
            >
              {TESTIMONIOS_DATA.map((testimonio) => (
                <div key={testimonio.id} className="w-full md:w-[calc(33.333%-1.5rem)] flex-shrink-0 bg-gray-50/50 border border-gray-100 p-8 rounded-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={testimonio.img} alt={testimonio.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{testimonio.name}</h4>
                      <p className="text-slate-500 text-xs">{testimonio.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-slate-600 text-sm italic leading-relaxed">
                    {testimonio.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}