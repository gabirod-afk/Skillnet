import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Sidebar from '../../components/Sidebar';
import { Settings, Percent, Key, Save, CheckCircle2 } from 'lucide-react';

export default function ProducerServices() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Estados de configuración
  const [platformCommission, setPlatformCommission] = useState('10');
  const [paymentApiKey, setPaymentApiKey] = useState('');
  const [analyticsKey, setAnalyticsKey] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'platform');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.platformCommission) setPlatformCommission(data.platformCommission);
          if (data.paymentApiKey) setPaymentApiKey(data.paymentApiKey);
          if (data.analyticsKey) setAnalyticsKey(data.analyticsKey);
        }
      } catch (error) {
        console.error("Error al cargar configuraciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Usamos setDoc con merge: true para crear el documento si no existe, o actualizarlo si ya existe
      await setDoc(doc(db, 'settings', 'platform'), {
        platformCommission,
        paymentApiKey,
        analyticsKey,
        updatedAt: new Date()
      }, { merge: true });
      
      setToast({ show: true, message: 'Configuraciones guardadas exitosamente' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar las configuraciones.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex bg-[#F4F5F7] min-h-[calc(100vh-80px)] relative">
      <Sidebar />

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-[#FFC847] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-black tracking-tight uppercase">Servicios Infoproductor</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Configura las comisiones globales y permisos de la plataforma.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FFC847] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* BLOQUE COMISIONES */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <Percent className="w-6 h-6 text-[#FFC847]" />
                  <h2 className="text-xl font-black text-gray-800">Modelo de Negocio</h2>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                    Comisión de la plataforma por venta (%)
                  </label>
                  <p className="text-xs text-gray-500 mb-4">Este es el porcentaje que Lernymart retiene de cada venta realizada por los infoproductores.</p>
                  <input 
                    type="number" 
                    value={platformCommission}
                    onChange={(e) => setPlatformCommission(e.target.value)}
                    className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#FFC847]" 
                  />
                </div>
              </div>

              {/* BLOQUE CLAVES DE API */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <Key className="w-6 h-6 text-[#FFC847]" />
                  <h2 className="text-xl font-black text-gray-800">Claves y Permisos (Integraciones)</h2>
                </div>
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                      API Key Pasarela de Pagos (Ej: Stripe / MercadoPago)
                    </label>
                    <input 
                      type="password" 
                      value={paymentApiKey}
                      onChange={(e) => setPaymentApiKey(e.target.value)}
                      placeholder="sk_live_...................."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#FFC847]" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                      Clave de Analíticas (Google Analytics / Pixel)
                    </label>
                    <input 
                      type="text" 
                      value={analyticsKey}
                      onChange={(e) => setAnalyticsKey(e.target.value)}
                      placeholder="G-XXXXXXX o ID del Pixel"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#FFC847]" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#FFC847] hover:bg-yellow-400 text-black px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Guardando...' : 'Guardar Configuraciones'}
                </button>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}