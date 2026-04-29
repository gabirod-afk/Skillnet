import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Sidebar from '../../components/Sidebar';
import { Search, ShieldCheck, XCircle, UserCheck, AlertTriangle } from 'lucide-react';

interface TutorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified?: boolean;
}

export default function TutorVerification() {
  const [tutors, setTutors] = useState<TutorData[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<TutorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      // Solo traemos a los usuarios que son infoproductores
      const q = query(collection(db, 'users'), where("role", "==", "infoproductor"));
      const querySnapshot = await getDocs(q);
      
      const tutorsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TutorData[];
      
      setTutors(tutorsList);
      setFilteredTutors(tutorsList);
    } catch (error) {
      console.error("Error al obtener tutores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = tutors.filter(t => 
      t.firstName?.toLowerCase().includes(term) || 
      t.lastName?.toLowerCase().includes(term) || 
      t.email?.toLowerCase().includes(term)
    );
    setFilteredTutors(filtered);
  }, [searchTerm, tutors]);

  const handleVerificationChange = async (tutorId: string, verifiedStatus: boolean) => {
    setUpdatingId(tutorId);
    try {
      await updateDoc(doc(db, 'users', tutorId), { isVerified: verifiedStatus });
      setTutors(tutors.map(t => t.id === tutorId ? { ...t, isVerified: verifiedStatus } : t));
    } catch (error) {
      console.error("Error al actualizar verificación:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex bg-[#F4F5F7] min-h-[calc(100vh-80px)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-black tracking-tight uppercase">Verificación de Tutores</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Aprueba o anula cuentas de infoproductores en la plataforma.</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar infoproductor..." 
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
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-black">Infoproductor</th>
                    <th className="px-6 py-4 font-black">Email</th>
                    <th className="px-6 py-4 font-black text-center">Estado Verificación</th>
                    <th className="px-6 py-4 font-black text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTutors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No hay infoproductores registrados.</td>
                    </tr>
                  ) : (
                    filteredTutors.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FFF9E6] border border-yellow-200 flex items-center justify-center text-yellow-600">
                              <UserCheck className="w-5 h-5" />
                            </div>
                            <div className="font-bold text-gray-800 text-sm">
                              {t.firstName} {t.lastName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{t.email}</td>
                        <td className="px-6 py-4 flex justify-center">
                          {t.isVerified ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                              <ShieldCheck className="w-4 h-4" /> Verificado
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold">
                              <AlertTriangle className="w-4 h-4" /> No Verificado / Anulado
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleVerificationChange(t.id, !t.isVerified)}
                            disabled={updatingId === t.id}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50
                              ${t.isVerified ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-black hover:bg-gray-800 text-[#FFC847]'}`}
                          >
                            {updatingId === t.id ? 'Cambiando...' : (t.isVerified ? 'Anular Verificación' : 'Aprobar Tutor')}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}