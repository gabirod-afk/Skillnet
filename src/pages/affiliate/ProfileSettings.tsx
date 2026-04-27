import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Sidebar from '../../components/Sidebar';
import { 
  Search, ChevronDown, ChevronUp, User, Award, 
  Settings, LogOut, UploadCloud, CheckCircle2, 
  AlertCircle, Menu, Grid, BarChart2, Briefcase, 
  Shield, ShoppingBag, CreditCard, LifeBuoy
} from 'lucide-react';

// Importaciones de Firebase y Autenticación
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext'; 

export default function ProfileSettings() {
  const { user } = useAuth();
  
  // Estados de la interfaz
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'perfil': true,
    'productos': true // Lo dejo abierto por defecto para que lo veas rápido
  });

  // Estados del Formulario (Vacíos por defecto, se llenan con Firebase)
  const [whoAmI, setWhoAmI] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [bio, setBio] = useState('');

  const [country, setCountry] = useState('Perú');
  const [zipCode, setZipCode] = useState('');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState(false);

  const [phoneCode, setPhoneCode] = useState('+51');
  const [phone, setPhone] = useState('');

  // 1. CARGAR DATOS DE FIREBASE
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setDni(data.dni || '');
            setWhoAmI(data.whoAmI || '');
            
            setLinkedin(data.linkedin || '');
            setInstagram(data.instagram || '');
            setYoutube(data.youtube || '');
            setTiktok(data.tiktok || '');
            setBio(data.bio || '');

            setCountry(data.country || 'Perú');
            setZipCode(data.zipCode || '');
            setRegion(data.region || '');
            setAddress(data.address || '');

            setPhoneCode(data.phoneCode || '+51');
            setPhone(data.phone || '');
          }
        } catch (error) {
          console.error("Error al cargar el perfil:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // 2. GUARDAR CAMBIOS EN FIREBASE
  const handleSave = async () => {
    if (!address.trim()) {
      setAddressError(true);
      return;
    }
    setAddressError(false);

    if (!user) return;
    
    setSaving(true);
    setSaveSuccess(false);

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        firstName,
        lastName,
        dni,
        whoAmI,
        linkedin,
        instagram,
        youtube,
        tiktok,
        bio,
        country,
        zipCode,
        region,
        address,
        phoneCode,
        phone,
        updatedAt: new Date()
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF6]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FFC847] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F4F5F7] min-h-[calc(100vh-80px)]">
      <Sidebar />
      
      {/* ÁREA PRINCIPAL (Formulario de Perfil) */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Cabecera */}
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-black tracking-tight uppercase">Información Personal</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Gestiona tu identidad pública y privada en la plataforma.</p>
            </div>
            {saveSuccess && (
              <div className="hidden md:flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm animate-in fade-in">
                <CheckCircle2 className="w-5 h-5" /> Perfil actualizado
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            
            {/* BLOQUE 1: Información Personal */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" alt="Perfil" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <UploadCloud className="w-6 h-6 text-white mb-1" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-black uppercase tracking-wider block mb-1">Imagen de perfil</label>
                    <p className="text-xs text-gray-500 font-medium">Usa una foto clara de tu rostro.</p>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">¿Quién soy? <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={whoAmI}
                    onChange={(e) => setWhoAmI(e.target.value)}
                    placeholder="Ej. Plataforma educativa o Instructor Independiente" 
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#FFC847] focus:ring-1 focus:ring-[#FFC847]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Nombre <span className="text-red-500">*</span></label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Tus nombres" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#FFC847]" />
                </div>
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Apellido <span className="text-red-500">*</span></label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Tus apellidos" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#FFC847]" />
                </div>
                <div className="relative">
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Email <span className="text-gray-400 font-normal">(No se puede cambiar)</span></label>
                  <input type="email" value={user?.email || ''} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed" />
                  <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-[36px]" />
                </div>
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">DNI / Documento <span className="text-red-500">*</span></label>
                  <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="Tu número de documento" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#FFC847]" />
                </div>
              </div>
            </div>

            {/* BLOQUE 2: Perfil Público */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
              <h2 className="text-2xl font-black text-black tracking-tight uppercase mb-6">Perfil Público</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Linkedin URL</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm bg-gray-100 px-2 rounded">in</span>
                    <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/tuperfil" className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#FFC847]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Instagram URL</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">@</span>
                    <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="instagram.com/tuusuario" className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#FFC847]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Youtube URL</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><VideoIcon className="w-4 h-4"/></span>
                    <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="youtube.com/@tucanal" className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#FFC847]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Tiktok URL</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">♪</span>
                    <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="tiktok.com/@tuusuario" className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#FFC847]" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Descripción / Bio <span className="text-red-500">*</span></label>
                <textarea 
                  rows={4} 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos un poco sobre ti, tu experiencia y lo que ofreces..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#FFC847] resize-none mb-2 leading-relaxed"
                ></textarea>
                {bio.length > 50 && (
                  <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" /> ¡Biografía con buena extensión!
                  </div>
                )}
              </div>
            </div>

            {/* BLOQUE 3: Dirección */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
              <h2 className="text-2xl font-black text-black tracking-tight uppercase mb-6">Dirección</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">País de residencia <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black appearance-none focus:outline-none focus:border-[#FFC847]">
                      <option value="Perú">Perú</option>
                      <option value="México">México</option>
                      <option value="Colombia">Colombia</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Código Postal</label>
                  <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Ej. 15088" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#FFC847]" />
                </div>
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Estado/Región <span className="text-red-500">*</span></label>
                  <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Ej. Lima" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#FFC847]" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Dirección completa <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if(e.target.value) setAddressError(false);
                  }}
                  placeholder="Tu calle, avenida o manzana..." 
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none mb-2 ${addressError ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#FFC847]'}`} 
                />
                {addressError && (
                  <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold animate-in fade-in">
                    <AlertCircle className="w-4 h-4" /> El campo Dirección es obligatorio.
                  </div>
                )}
              </div>
            </div>

            {/* BLOQUE 4: Teléfono */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
              <h2 className="text-2xl font-black text-black tracking-tight uppercase mb-6">Teléfono</h2>
              
              <div className="flex gap-6">
                <div className="w-32">
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Código</label>
                  <input type="text" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#FFC847]" />
                </div>
                <div className="flex-1 max-w-md">
                  <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">Teléfono celular <span className="text-red-500">*</span></label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej. 986545899" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#FFC847]" />
                </div>
              </div>
            </div>

            {/* Botón Guardar */}
            <div className="mt-2 pb-8 flex items-center gap-4">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-[#FFC847] hover:bg-yellow-400 disabled:opacity-50 text-black px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_4px_14px_rgba(255,200,71,0.4)]"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              
              {saveSuccess && (
                <div className="md:hidden flex items-center gap-2 text-green-600 font-bold text-sm animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5" /> Listo
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}