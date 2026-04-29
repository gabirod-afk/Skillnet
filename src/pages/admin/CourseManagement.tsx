import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Sidebar from '../../components/Sidebar';
import { Search, BookOpen, Eye, UserPlus, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface CourseData {
  id: string;
  title: string;
  category: string;
  status: string;
  professor_id: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function CourseManagement() {
  // Estados para Cursos
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Estados para el Modal de Asignar Estudiante
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [toast, setToast] = useState<{show: boolean, message: string}>({ show: false, message: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseData[];
      
      setCourses(coursesList);
      setFilteredCourses(coursesList);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado de cursos
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = courses.filter(c => 
      c.title?.toLowerCase().includes(term) || 
      c.category?.toLowerCase().includes(term)
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  // Cambiar estado del curso (Publicado, Borrador, Deshabilitado)
  const handleStatusChange = async (courseId: string, newStatus: string) => {
    setUpdatingId(courseId);
    try {
      await updateDoc(doc(db, 'courses', courseId), { status: newStatus });
      setCourses(courses.map(c => c.id === courseId ? { ...c, status: newStatus } : c));
      showToast("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Abrir Modal y cargar usuarios
  const openAssignModal = async (course: CourseData) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
    if (users.length === 0) {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersList = usersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as UserData[];
        setUsers(usersList);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    }
  };

  // Asignar estudiante a un curso
  const handleAssignStudent = async (userId: string) => {
    if (!selectedCourse) return;
    setAssigningId(userId);
    try {
      // Agregamos el ID del curso a un arreglo 'enrolledCourses' en el documento del usuario
      await updateDoc(doc(db, 'users', userId), {
        enrolledCourses: arrayUnion(selectedCourse.id)
      });
      showToast("Estudiante matriculado con éxito");
    } catch (error) {
      console.error("Error al asignar:", error);
      showToast("Error al asignar estudiante");
    } finally {
      setAssigningId(null);
    }
  };

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#F4F5F7] min-h-[calc(100vh-80px)] relative">
      <Sidebar />

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-[#FFC847] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* MODAL DE ASIGNACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-black text-lg text-black">Asignar Estudiante</h3>
                <p className="text-xs text-gray-500 font-medium">Curso: {selectedCourse?.title}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o correo..." 
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-[#FFC847]" 
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-8">No se encontraron usuarios.</p>
              ) : (
                filteredUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                    <button 
                      onClick={() => handleAssignStudent(u.id)}
                      disabled={assigningId === u.id}
                      className="text-xs font-bold bg-[#FFC847] hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {assigningId === u.id ? 'Asignando...' : 'Matricular'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-black tracking-tight uppercase">Gestión de Cursos</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Supervisa, habilita y asigna cursos de la plataforma.</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por título..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FFC847] shadow-sm" 
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FFC847] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-black">Curso</th>
                      <th className="px-6 py-4 font-black">Categoría</th>
                      <th className="px-6 py-4 font-black text-center">Estado</th>
                      <th className="px-6 py-4 font-black text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No se encontraron cursos.</td>
                      </tr>
                    ) : (
                      filteredCourses.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div className="font-bold text-gray-800 text-sm max-w-xs truncate">
                                {c.title || 'Sin Título'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {c.category || 'N/A'}
                          </td>
                          <td className="px-6 py-4 flex justify-center">
                            <select 
                              value={c.status || 'draft'}
                              onChange={(e) => handleStatusChange(c.id, e.target.value)}
                              disabled={updatingId === c.id}
                              className={`border rounded-lg px-3 py-1.5 text-xs font-bold outline-none cursor-pointer disabled:opacity-50
                                ${c.status === 'published' ? 'border-green-300 text-green-700 bg-green-50' : 
                                  c.status === 'disabled' ? 'border-red-300 text-red-700 bg-red-50' : 
                                  'border-yellow-300 text-yellow-700 bg-yellow-50'}`}
                            >
                              <option value="published">Publicado</option>
                              <option value="draft">Borrador</option>
                              <option value="disabled">Deshabilitado</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link 
                                to={`/marketplace/course/${c.id}`}
                                title="Ver detalles"
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button 
                                onClick={() => openAssignModal(c)}
                                title="Asignar Estudiante"
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}