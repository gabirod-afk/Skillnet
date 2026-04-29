import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Sidebar from '../../components/Sidebar';
import { Users, GraduationCap, Award, UserPlus, BookOpen, CheckCircle, Edit3, Clock, FileText, HelpCircle, LayoutGrid } from 'lucide-react';

export default function DashboardAdmin() {
  const [loading, setLoading] = useState(true);
  
  // Estados de métricas
  const [stats, setStats] = useState({
    totalUsers: 0, students: 0, creators: 0, newRegistrations: 0,
    totalCourses: 0, publishedCourses: 0, draftCourses: 0, pendingCourses: 0,
    totalLessons: 0, totalQuizzes: 0, totalSections: 0
  });

  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingCourseList, setPendingCourseList] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. OBTENER USUARIOS
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const studentsCount = usersList.filter((u: any) => u.role === 'comprador' || u.role === 'student').length;
      const creatorsCount = usersList.filter((u: any) => u.role === 'infoproductor' || u.role === 'afiliado').length;
      
      // Ordenamos para agarrar a los más recientes (asumiendo que tienen createdAt)
      const sortedUsers = [...usersList].sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      // 2. OBTENER CURSOS
      const coursesSnap = await getDocs(collection(db, 'courses'));
      const coursesList = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const publishedCount = coursesList.filter((c: any) => c.status === 'published').length;
      const draftCount = coursesList.filter((c: any) => c.status === 'draft').length;
      const pendingCount = coursesList.filter((c: any) => c.status === 'pending').length;

      // Calcular lecciones, quizzes y secciones analizando los módulos de cada curso
      let lessons = 0;
      let sections = 0;
      coursesList.forEach((c: any) => {
        if (c.modules && Array.isArray(c.modules)) {
          sections += c.modules.length;
          c.modules.forEach((mod: any) => {
            if (mod.lessons && Array.isArray(mod.lessons)) {
              lessons += mod.lessons.length;
            }
          });
        }
      });

      setStats({
        totalUsers: usersList.length,
        students: studentsCount,
        creators: creatorsCount,
        newRegistrations: usersList.length, // Placeholder
        totalCourses: coursesList.length,
        publishedCourses: publishedCount,
        draftCourses: draftCount,
        pendingCourses: pendingCount,
        totalLessons: lessons,
        totalQuizzes: 0, // Ajustar si agregamos quizzes a la DB
        totalSections: sections
      });

      setRecentUsers(sortedUsers.slice(0, 4));
      setPendingCourseList(coursesList.filter((c: any) => c.status === 'pending' || c.status === 'draft').slice(0, 4));

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex bg-[#F4F5F7] min-h-[calc(100vh-80px)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* TOP HEADER */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-black text-black tracking-tight">Dashboard Ejecutivo</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Métricas en tiempo real del sistema</p>
            </div>
            <button onClick={fetchDashboardData} className="border border-[#FFC847] bg-[#FFF9E6] hover:bg-[#FFC847] text-black font-bold px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm">
              Actualizar datos
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FFC847] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* GRID DE MÉTRICAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard title="Usuarios totales" value={stats.totalUsers} icon={<Users className="w-5 h-5 text-[#FFC847]" />} />
                <MetricCard title="Estudiantes" value={stats.students} icon={<GraduationCap className="w-5 h-5 text-[#FFC847]" />} />
                <MetricCard title="Infoproductores" value={stats.creators} icon={<Award className="w-5 h-5 text-[#FFC847]" />} />
                <MetricCard title="Inscripciones" value={stats.newRegistrations} icon={<UserPlus className="w-5 h-5 text-[#FFC847]" />} />
                
                <MetricCard title="Cursos totales" value={stats.totalCourses} icon={<BookOpen className="w-5 h-5 text-[#FFC847]" />} />
                <MetricCard title="Cursos publicados" value={stats.publishedCourses} icon={<CheckCircle className="w-5 h-5 text-[#FFC847]" />} />
                <MetricCard title="Borradores" value={stats.draftCourses} icon={<Edit3 className="w-5 h-5 text-[#FFC847]" />} />
                <MetricCard title="Pendientes aprobación" value={stats.pendingCourses} icon={<Clock className="w-5 h-5 text-[#FFC847]" />} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <MetricCard title="Lecciones" value={stats.totalLessons} icon={<FileText className="w-5 h-5 text-[#FFC847]" />} large />
                <MetricCard title="Quizzes" value={stats.totalQuizzes} icon={<HelpCircle className="w-5 h-5 text-[#FFC847]" />} large />
                <MetricCard title="Secciones" value={stats.totalSections} icon={<LayoutGrid className="w-5 h-5 text-[#FFC847]" />} large />
              </div>

              {/* TABLAS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Usuarios Recientes */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black text-gray-800">Usuarios recientes</h2>
                    <button className="text-sm font-bold text-[#FFC847] hover:underline">Ver todos</button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {recentUsers.map((u, i) => (
                      <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                        <div>
                          <p className="font-bold text-sm text-gray-800">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${u.role === 'admin' ? 'bg-black text-white' : 'bg-[#FFF9E6] text-yellow-700 border border-yellow-200'}`}>
                          {u.role || 'student'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cursos Pendientes */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black text-gray-800">Cursos pendientes de aprobación</h2>
                    <button className="text-sm font-bold text-[#FFC847] hover:underline">Gestionar</button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {pendingCourseList.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">No hay cursos pendientes.</p>
                    ) : (
                      pendingCourseList.map((c, i) => (
                        <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                          <div>
                            <p className="font-bold text-sm text-gray-800">{c.title || 'Sin Título'}</p>
                            <p className="text-xs text-gray-500">Categoría: {c.category || 'N/A'}</p>
                          </div>
                          <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                            {c.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

// Sub-componente para las tarjetas de métricas
function MetricCard({ title, value, icon, large = false }: { title: string, value: number, icon: React.ReactNode, large?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center shadow-sm">
      <div>
        <p className="text-xs font-bold text-gray-500 mb-1">{title}</p>
        <h3 className={`font-black text-black ${large ? 'text-4xl' : 'text-2xl'}`}>{value}</h3>
      </div>
      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}