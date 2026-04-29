import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Sidebar from '../../components/Sidebar';
import { Search, Shield, User, Award, Edit3, CheckCircle2 } from 'lucide-react';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: any;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el feedback de guardado
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      
      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado de búsqueda
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(u => 
      u.firstName?.toLowerCase().includes(term) || 
      u.lastName?.toLowerCase().includes(term) || 
      u.email?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // FUNCIÓN PARA CAMBIAR EL ROL
  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      
      // Actualizamos el estado local para reflejar el cambio en la UI
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      
      setSuccessId(userId);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      alert("Error al actualizar el rol.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex bg-[#F4F5F7] min-h-[calc(100vh-80px)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-black tracking-tight uppercase">Gestión de Usuarios</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Administra los accesos y roles de toda la plataforma.</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o correo..." 
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
                      <th className="px-6 py-4 font-black">Usuario</th>
                      <th className="px-6 py-4 font-black">Email</th>
                      <th className="px-6 py-4 font-black">Rol Actual</th>
                      <th className="px-6 py-4 font-black text-center">Acciones / Cambiar Rol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No se encontraron usuarios.</td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
                                <User className="w-5 h-5" />
                              </div>
                              <div className="font-bold text-gray-800 text-sm">
                                {u.firstName} {u.lastName}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {u.email}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                              ${u.role === 'admin' ? 'bg-black text-[#FFC847] border-black' : 
                                u.role === 'infoproductor' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                u.role === 'afiliado' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                                'bg-gray-100 text-gray-600 border-gray-200'}`}
                            >
                              {u.role === 'admin' && <Shield className="w-3 h-3" />}
                              {u.role === 'infoproductor' && <Award className="w-3 h-3" />}
                              {u.role || 'comprador'}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex items-center justify-center gap-3">
                            <select 
                              value={u.role || 'comprador'}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={updatingId === u.id}
                              className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-[#FFC847] cursor-pointer disabled:opacity-50"
                            >
                              <option value="comprador">Comprador</option>
                              <option value="afiliado">Afiliado</option>
                              <option value="infoproductor">Infoproductor</option>
                              <option value="admin">Administrador</option>
                            </select>
                            
                            {/* Feedback visual de guardado */}
                            <div className="w-5 h-5 flex items-center justify-center">
                              {updatingId === u.id && <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>}
                              {successId === u.id && <CheckCircle2 className="w-4 h-4 text-green-500 animate-in zoom-in" />}
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