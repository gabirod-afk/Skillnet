import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  Search, ChevronDown, ChevronUp, User, 
  LogOut, Menu, Grid, BarChart2, Briefcase, 
  Shield, ShoppingBag, Plus, Edit3, Trash2, Clock,
  CheckCircle2
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

interface CourseData {
  id: string;
  title: string;
  productType: string;
  status: string;
  price: number;
  created_at: any;
}

export default function MyProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'productos': true,
  });

  // CARGAR LOS CURSOS DEL USUARIO DESDE FIREBASE
  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) return;
      try {
        // Consultamos la colección "courses" filtrando por el ID del profesor
        const q = query(collection(db, "courses"), where("professor_id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const myCoursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CourseData[];
        
        // Ordenamos los más recientes primero (opcional, dependiendo de cómo guardaste la fecha)
        myCoursesData.sort((a, b) => b.created_at?.seconds - a.created_at?.seconds);
        
        setCourses(myCoursesData);
      } catch (error) {
        console.error("Error al cargar mis productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [user]);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="flex bg-[#F4F5F7] min-h-[calc(100vh-80px)]">
      <Sidebar />

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-black text-black tracking-tight uppercase">Mis Infoproductos</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Gestiona, edita y publica tus cursos y e-books.</p>
            </div>
            <Link to="/crear-producto" className="bg-[#FFC847] hover:bg-yellow-400 text-black px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-md transition-transform active:scale-95">
              <Plus className="w-5 h-5" /> Crear Producto
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
               <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FFC847] rounded-full animate-spin"></div>
            </div>
          ) : courses.length === 0 ? (
            // ESTADO VACÍO
            <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-black text-black mb-2">Aún no tienes infoproductos</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-md">Empieza a compartir tu conocimiento con el mundo creando tu primer curso o e-book en la plataforma.</p>
              <Link to="/crear-producto" className="bg-black text-[#FFC847] px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                Empezar a crear
              </Link>
            </div>
          ) : (
            // LISTADO DE CURSOS
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  {/* Imagen Placeholder del Curso */}
                  <div className="h-40 bg-gray-100 relative">
                    <img 
                      src={course.productType === 'ebook' ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop" : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop"} 
                      alt={course.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                        {course.productType === 'ebook' ? 'E-Book' : 'Curso'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      {course.status === 'published' ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Publicado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                          <Clock className="w-3 h-3" /> Borrador
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-black text-lg leading-tight mb-2 line-clamp-2">
                      {course.title || 'Curso sin título'}
                    </h3>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                       <button 
                            onClick={() => navigate(`/crear-producto?id=${course.id}`)}
                            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                            <Edit3 className="w-4 h-4" /> Editar
                        </button>
                       {/* Opcional: Botón de eliminar */}
                       <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}