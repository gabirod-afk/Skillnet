import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronDown, 
  Edit2, 
  Search, 
  UploadCloud, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  HelpCircle, 
  X, 
  AlertCircle, 
  Plus
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIES = [
  { id: 'finanzas', title: 'Finanzas y Negocios', subcategories: ['Contabilidad', 'Finanzas', 'Inversiones', 'Emprendimiento', 'Administración'] },
  { id: 'gestion', title: 'Gestión y Operaciones', subcategories: ['Gestión de proyectos', 'Productividad', 'Gestión de operaciones'] },
  { id: 'marketing', title: 'Marketing y Ventas', subcategories: ['Marketing', 'Marketing digital', 'Trade marketing', 'Branding', 'Ventas'] },
];

interface ContentBlock { id: string; type: string; content: string; }
interface Lesson { id: string; title: string; duration: string; blocks: ContentBlock[]; }
interface Module { id: string; title: string; lessons: Lesson[]; }
interface Coupon { id: string; code: string; discount: string; validity: string; }

export default function CreateProductFlow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchParams] = useSearchParams();
  const editCourseId = searchParams.get('id');

  // ESTADOS GENERALES
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editCourseId);
  const [courseId, setCourseId] = useState<string | null>(editCourseId);
  const [activeTab, setActiveTab] = useState('audiencia');

  // ESTADO DEL TOAST (Pop-up)
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // ESTADOS DE DATOS DEL CURSO
  const [productType, setProductType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const [goals, setGoals] = useState<string[]>(['']); 
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [targetAudience, setTargetAudience] = useState<string[]>(['']);

  const [modules, setModules] = useState<Module[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const [landingData, setLandingData] = useState({
    description: '', level: 'Básico', language: 'Español', format: 'Básico', originalPrice: '', discountPrice: '', affiliateCommission: ''
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [termsAccepted, setTermsAccepted] = useState(false);

  // EFECTO: CARGAR DATOS SI ESTAMOS EDITANDO
  useEffect(() => {
    const fetchCourseForEdit = async () => {
      if (editCourseId) {
        try {
          const docRef = doc(db, "courses", editCourseId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            setTitle(data.title || '');
            setProductType(data.productType || 'curso');
            setSelectedCategory(data.category || '');
            setSelectedSubcategory(data.subcategory || '');
            
            if (data.audience) {
              setGoals(data.audience.goals?.length ? data.audience.goals : ['']);
              setRequirements(data.audience.requirements?.length ? data.audience.requirements : ['']);
              setTargetAudience(data.audience.target?.length ? data.audience.target : ['']);
            }
            
            if (data.landingPage) setLandingData(data.landingPage);
            if (data.modules) setModules(data.modules);
            if (data.coupons) setCoupons(data.coupons);
            if (data.status === 'published') setTermsAccepted(true);
            
            // Saltamos directamente a la Workstation
            setStep(3);
          }
        } catch (error) {
          console.error("Error al cargar el curso para editar:", error);
          showToast("Error al cargar el curso", "error");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCourseForEdit();
  }, [editCourseId]);

  // NAVEGACIÓN WIZARD
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // MANEJO DE ARREGLOS (Audiencia)
  const handleArrayChange = (setter: any, index: number, value: string, array: string[]) => {
    const newArray = [...array]; 
    newArray[index] = value; 
    setter(newArray);
  };
  const addArrayItem = (setter: any, array: string[]) => setter([...array, '']);
  const removeArrayItem = (setter: any, index: number, array: string[]) => setter(array.filter((_, i) => i !== index));

  // MANEJO DE TEMARIO
  const handleAddModule = () => {
    const newModule: Module = { 
      id: `mod_${Date.now()}`, 
      title: `Módulo ${modules.length + 1}`, 
      lessons: [] 
    };
    setModules([...modules, newModule]);
  };

  const handleAddLesson = (moduleId: string) => {
    const newModules = modules.map(mod => {
      if (mod.id === moduleId) {
        return { 
          ...mod, 
          lessons: [...mod.lessons, { id: `les_${Date.now()}`, title: 'Nueva Lección', duration: '10', blocks: [] }] 
        };
      }
      return mod;
    });
    setModules(newModules);
  };

  const handleUpdateActiveLesson = (updates: Partial<Lesson>) => {
    setModules(modules.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(les => les.id === activeLessonId ? { ...les, ...updates } : les)
    })));
  };

  const handleAddTextBlock = () => {
    if (!activeLessonId) return showToast("Selecciona una lección primero", "error");
    setModules(modules.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(les => {
        if (les.id === activeLessonId) {
          return { 
            ...les, 
            blocks: [...les.blocks, { id: `blk_${Date.now()}`, type: 'text', content: '' }] 
          };
        }
        return les;
      })
    })));
  };

  const handleUpdateBlockContent = (blockId: string, content: string) => {
    setModules(modules.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(les => les.id === activeLessonId ? {
        ...les, 
        blocks: les.blocks.map(blk => blk.id === blockId ? { ...blk, content } : blk)
      } : les)
    })));
  };

  const activeLesson = modules.flatMap(m => m.lessons).find(l => l.id === activeLessonId);

  // MANEJO DE CUPONES
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon?.id) {
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? editingCoupon : c));
    } else {
      setCoupons([...coupons, { ...editingCoupon!, id: `cup_${Date.now()}` }]);
    }
    setShowCouponModal(false);
    setEditingCoupon(null);
    showToast("Cupón guardado correctamente");
  };

  // GUARDAR EN FIREBASE
  const saveDraft = async () => {
    if (!user) return showToast("Debes iniciar sesión", "error");
    setIsSaving(true);
    
    const coursePayload = {
      title, 
      productType, 
      category: selectedCategory, 
      subcategory: selectedSubcategory,
      audience: { 
        goals: goals.filter(g => g.trim() !== ''), 
        requirements: requirements.filter(r => r.trim() !== ''), 
        target: targetAudience.filter(a => a.trim() !== '') 
      },
      landingPage: landingData,
      modules, 
      coupons,
      professor_id: user.uid,
      status: termsAccepted ? 'published' : 'draft', 
      updated_at: new Date()
    };

    try {
      if (courseId) {
        await updateDoc(doc(db, "courses", courseId), coursePayload);
      } else {
        const docRef = await addDoc(collection(db, "courses"), { 
          ...coursePayload, 
          created_at: new Date() 
        });
        setCourseId(docRef.id);
      }
      showToast(termsAccepted ? "¡Curso Publicado exitosamente!" : "Progreso guardado correctamente");
      if (termsAccepted) setTimeout(() => navigate('/mis-productos'), 2000);
    } catch (error) {
      console.error(error);
      showToast("Hubo un error al guardar en Firebase", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // PANTALLA DE CARGA (Para edición)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FFC847] rounded-full animate-spin"></div>
      </div>
    );
  }

  // WIZARD: PASO 0 (SELECCIÓN DE PRODUCTO)
  if (step === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col pt-10">
        <div className="max-w-4xl mx-auto w-full px-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#FFC847] flex items-center justify-center text-black font-black text-xl">
              +
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">Crea un producto</h1>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-6">¿Qué deseas vender?</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-2xl">
            <div 
              onClick={() => setProductType('curso')} 
              className={`relative h-40 rounded-3xl overflow-hidden cursor-pointer border-4 transition-all ${productType === 'curso' ? 'border-[#FFC847] scale-105 shadow-lg' : 'border-transparent hover:scale-105'}`}
            >
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop" alt="Curso" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-bold tracking-wide">Curso</span>
              </div>
            </div>
            
            <div 
              onClick={() => setProductType('ebook')} 
              className={`relative h-40 rounded-3xl overflow-hidden cursor-pointer border-4 transition-all ${productType === 'ebook' ? 'border-[#FFC847] scale-105 shadow-lg' : 'border-transparent hover:scale-105'}`}
            >
              <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop" alt="E-book" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold tracking-wide">E-book</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-auto pb-12">
            <button 
              onClick={() => navigate('/mis-productos')} 
              className="px-8 py-2.5 rounded-xl border text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              ← Volver
            </button>
            <button 
              onClick={nextStep} 
              disabled={!productType} 
              className="px-8 py-2.5 rounded-xl bg-[#FFC847] text-black text-sm font-bold transition-colors disabled:opacity-50 disabled:bg-gray-300"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // WIZARD: PASO 1 (TÍTULO)
  if (step === 1) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col relative animate-in fade-in slide-in-from-right-8 duration-300">
        <div className="max-w-3xl mx-auto w-full px-6 flex-1 flex flex-col items-center justify-center pb-32">
          <h2 className="text-3xl font-black text-black mb-4 tracking-tight text-center">Ingresa un título temporal</h2>
          <p className="text-sm font-medium text-gray-500 mb-8 text-center">No te preocupes si no te convence, podrás cambiarlo más adelante.</p>
          
          <div className="w-full max-w-xl relative">
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              maxLength={60} 
              className="w-full border border-gray-300 rounded-lg px-4 py-4 text-sm focus:border-[#FFC847] outline-none transition-colors" 
              placeholder="Ej: Master en Finanzas para Emprendedores" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
              {60 - title.length}
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full border-t border-gray-200 bg-white p-4 px-8 flex justify-between">
          <button 
            onClick={prevStep} 
            className="px-10 py-3 bg-[#FFC847] font-bold rounded-lg text-sm hover:bg-yellow-400 transition-colors"
          >
            Atrás
          </button>
          <button 
            onClick={nextStep} 
            disabled={!title.trim()} 
            className="px-10 py-3 bg-[#FFC847] font-bold rounded-lg text-sm hover:bg-yellow-400 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // WIZARD: PASO 2 (CATEGORÍA)
  if (step === 2) {
    const currentCategoryData = CATEGORIES.find(c => c.title === selectedCategory);
    return (
      <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col relative animate-in fade-in slide-in-from-right-8 duration-300">
        <div className="max-w-3xl mx-auto w-full px-6 flex-1 flex flex-col items-center pt-24 pb-32">
          <h2 className="text-3xl font-black text-black mb-4 text-center tracking-tight">Selecciona la categoría de tu curso.</h2>
          <p className="text-sm font-medium text-gray-500 mb-10 text-center">Te guiaremos en cada paso, cambiar la categoría es un paso sencillo.</p>
          
          <div className="w-full max-w-xl flex flex-col gap-6">
            <div className="relative">
              <select 
                value={selectedCategory} 
                onChange={(e) => { 
                  setSelectedCategory(e.target.value); 
                  setSelectedSubcategory(''); 
                }} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3.5 text-sm font-medium outline-none appearance-none focus:border-[#FFC847] transition-colors"
              >
                <option value="" disabled>Elige una categoría</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.title}>{cat.title}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none bg-black rounded p-0.5">
                <ChevronDown className="w-3 h-3 text-white" />
              </div>
            </div>

            {selectedCategory && (
              <div className="animate-in fade-in slide-in-from-top-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Elige una sub-categoría</label>
                <div className="relative">
                  <select 
                    value={selectedSubcategory} 
                    onChange={(e) => setSelectedSubcategory(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3.5 text-sm font-medium outline-none appearance-none focus:border-[#FFC847] transition-colors"
                  >
                    <option value="" disabled>Elige sub-categoría</option>
                    {currentCategoryData?.subcategories.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none bg-black rounded p-0.5">
                    <ChevronDown className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full border-t border-gray-200 bg-white p-4 px-8 flex justify-between">
          <button 
            onClick={prevStep} 
            className="px-10 py-3 bg-[#FFC847] font-bold rounded-lg text-sm hover:bg-yellow-400 transition-colors"
          >
            Atrás
          </button>
          <button 
            onClick={nextStep} 
            disabled={!selectedCategory || !selectedSubcategory} 
            className="px-10 py-3 bg-[#FFC847] font-bold rounded-lg text-sm hover:bg-yellow-400 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // WIZARD: PASO 3 (WORKSTATION - EDITOR PRINCIPAL)
  if (step === 3) {
    return (
      <div className="h-[calc(100vh-80px)] bg-white flex animate-in fade-in duration-500 overflow-hidden relative">
        
        {/* TOAST FLOTANTE */}
        {toast.show && (
          <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-black text-[#FFC847]'}`}>
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="font-bold text-sm tracking-wide">{toast.message}</span>
          </div>
        )}

        {/* MODAL DE CUPONES */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-black text-lg">{editingCoupon?.id ? 'Editar Cupón' : 'Nuevo Cupón'}</h3>
                <button 
                  onClick={() => setShowCouponModal(false)} 
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <form onSubmit={handleSaveCoupon} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold uppercase block mb-1 text-gray-700">Código del Cupón</label>
                  <input 
                    type="text" 
                    required 
                    value={editingCoupon?.code || ''} 
                    onChange={(e) => setEditingCoupon({...editingCoupon!, code: e.target.value.toUpperCase()})} 
                    placeholder="Ej: VERANO20" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FFC847]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1 text-gray-700">Descuento (%)</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    max="100" 
                    value={editingCoupon?.discount || ''} 
                    onChange={(e) => setEditingCoupon({...editingCoupon!, discount: e.target.value})} 
                    placeholder="Ej: 20" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FFC847]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1 text-gray-700">Vigencia</label>
                  <input 
                    type="text" 
                    required 
                    value={editingCoupon?.validity || ''} 
                    onChange={(e) => setEditingCoupon({...editingCoupon!, validity: e.target.value})} 
                    placeholder="Ej: Permanente o 31/12/2026" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FFC847]" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="mt-4 w-full bg-[#FFC847] text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Guardar Cupón
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SIDEBAR IZQUIERDO DEL EDITOR */}
        <aside className="w-[280px] bg-[#FCFAF6] border-r border-gray-200 flex flex-col flex-shrink-0 z-10">
          <div className="p-4 border-b border-gray-200">
            <button 
              onClick={() => navigate('/mis-productos')} 
              className="w-full bg-[#FFC847] hover:bg-yellow-400 text-black font-bold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center"
            >
              ← Volver a Cursos
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            
            <div className="mb-6">
              <h3 className="px-6 text-[12px] font-black uppercase text-gray-800 mb-2 tracking-wider">Planifica tu curso</h3>
              <button 
                onClick={() => setActiveTab('audiencia')} 
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium border-l-2 transition-colors ${activeTab === 'audiencia' ? 'border-black bg-gray-100 text-black' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                <div className={`w-3 h-3 rounded-full border ${activeTab === 'audiencia' ? 'bg-black border-black' : 'bg-white border-gray-300'}`}></div> 
                Define a tu audiencia
              </button>
            </div>

            <div className="mb-6">
              <h3 className="px-6 text-[12px] font-black uppercase text-gray-800 mb-2 tracking-wider">Crea tu contenido</h3>
              <button 
                onClick={() => setActiveTab('temario')} 
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium border-l-2 transition-colors ${activeTab === 'temario' ? 'border-black bg-gray-100 text-black' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                <div className={`w-3 h-3 rounded-full border ${activeTab === 'temario' ? 'bg-black border-black' : 'bg-white border-gray-300'}`}></div> 
                Diseña tu temario
              </button>
            </div>

            <div className="mb-6">
              <h3 className="px-6 text-[12px] font-black uppercase text-gray-800 mb-2 tracking-wider">Publica tu curso</h3>
              <div className="flex flex-col gap-0.5">
                <button 
                  onClick={() => setActiveTab('inicio')} 
                  className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium border-l-2 transition-colors ${activeTab === 'inicio' ? 'border-black bg-gray-100 text-black' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                >
                  <div className={`w-3 h-3 rounded-full border ${activeTab === 'inicio' ? 'bg-black border-black' : 'bg-white border-gray-300'}`}></div> 
                  Página de inicio
                </button>
                <button 
                  onClick={() => setActiveTab('cupones')} 
                  className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium border-l-2 transition-colors ${activeTab === 'cupones' ? 'border-black bg-gray-100 text-black' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                >
                  <div className={`w-3 h-3 rounded-full border ${activeTab === 'cupones' ? 'bg-black border-black' : 'bg-white border-gray-300'}`}></div> 
                  Cupones
                </button>
                <button 
                  onClick={() => setActiveTab('terminos')} 
                  className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium border-l-2 transition-colors ${activeTab === 'terminos' ? 'border-black bg-gray-100 text-black' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                >
                  <div className={`w-3 h-3 rounded-full border ${activeTab === 'terminos' ? 'bg-black border-black' : 'bg-white border-gray-300'}`}></div> 
                  Términos y Condiciones
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
            <button 
              onClick={saveDraft} 
              disabled={isSaving} 
              className="w-full bg-black text-white font-bold text-sm py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : (termsAccepted ? 'Publicar Curso' : 'Guardar Borrador')}
            </button>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL (CONTENIDO DE TABS) */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          
          {/* TOPBAR DEL ÁREA PRINCIPAL */}
          <div className="h-[72px] border-b border-gray-200 flex items-center justify-between px-8 bg-white flex-shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-black leading-tight">Curso: {title || 'Sin título'}</h2>
                <p className="text-[11px] text-gray-500 font-medium">Estado: {courseId ? 'Borrador Guardado' : 'Sin guardar'}</p>
              </div>
            </div>
            <button 
              onClick={saveDraft} 
              className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-lg"
            >
              Guardar Progreso
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 relative">
            
            {/* --- TAB 1: AUDIENCIA --- */}
            {activeTab === 'audiencia' && (
              <div className="max-w-4xl mx-auto animate-in fade-in">
                <div className="border-b border-gray-200 mb-8 pb-4">
                  <h1 className="text-2xl font-black text-black">Define a tu audiencia</h1>
                </div>
                <div className="flex flex-col gap-10 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                  
                  <div>
                    <h3 className="text-sm font-bold text-black mb-1">¿Qué lograrán tus alumnos?</h3>
                    <p className="text-xs text-gray-500 mb-4">Define metas claras o habilidades que dominarán al terminar tu curso.</p>
                    <div className="flex flex-col gap-3">
                      {goals.map((val, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={val} 
                            onChange={(e) => handleArrayChange(setGoals, idx, e.target.value, goals)} 
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#FFC847] outline-none" 
                            placeholder="Ej: Diseñar interfaces desde cero." 
                          />
                          <button 
                            onClick={() => removeArrayItem(setGoals, idx, goals)} 
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addArrayItem(setGoals, goals)} 
                        className="text-blue-600 font-bold text-sm text-left hover:underline w-fit mt-1"
                      >
                        + Añadir meta
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-black mb-1">¿Qué necesitan para empezar?</h3>
                    <p className="text-xs text-gray-500 mb-4">Conocimientos previos o herramientas necesarias.</p>
                    <div className="flex flex-col gap-3">
                      {requirements.map((val, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={val} 
                            onChange={(e) => handleArrayChange(setRequirements, idx, e.target.value, requirements)} 
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#FFC847] outline-none" 
                            placeholder="Ej: No requiere experiencia previa." 
                          />
                          <button 
                            onClick={() => removeArrayItem(setRequirements, idx, requirements)} 
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addArrayItem(setRequirements, requirements)} 
                        className="text-blue-600 font-bold text-sm text-left hover:underline w-fit mt-1"
                      >
                        + Añadir requisito
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-black mb-1">Tu estudiante ideal</h3>
                    <p className="text-xs text-gray-500 mb-4">Un curso con un público bien definido conecta mucho mejor.</p>
                    <div className="flex flex-col gap-3">
                      {targetAudience.map((val, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={val} 
                            onChange={(e) => handleArrayChange(setTargetAudience, idx, e.target.value, targetAudience)} 
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#FFC847] outline-none" 
                            placeholder="Ej: Desarrolladores junior." 
                          />
                          <button 
                            onClick={() => removeArrayItem(setTargetAudience, idx, targetAudience)} 
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addArrayItem(setTargetAudience, targetAudience)} 
                        className="text-blue-600 font-bold text-sm text-left hover:underline w-fit mt-1"
                      >
                        + Añadir perfil
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* --- TAB 2: TEMARIO --- */}
            {activeTab === 'temario' && (
              <div className="h-full flex flex-col animate-in fade-in">
                <div className="border-b border-gray-200 mb-6 pb-4">
                  <h1 className="text-2xl font-black text-black">Diseña tu temario</h1>
                  <p className="text-sm text-gray-500 mt-1">Estructura el viaje de aprendizaje. Crea módulos y añade contenido.</p>
                </div>
                
                <div className="flex-1 flex gap-6 overflow-hidden min-h-[500px]">
                  
                  {/* Columna 1: Módulos */}
                  <div className="w-1/3 flex flex-col border border-gray-200 rounded-xl bg-gray-50 overflow-hidden shadow-sm">
                    <div className="p-4 flex-1 overflow-y-auto">
                      {modules.map((mod) => (
                        <div key={mod.id} className="mb-4">
                          <div className="bg-white border border-gray-200 p-3 rounded-lg flex justify-between items-center text-sm font-bold text-gray-800 mb-2 shadow-sm">
                            {mod.title}
                          </div>
                          <div className="pl-3 flex flex-col gap-2 border-l-2 border-gray-200 ml-3">
                            {mod.lessons.map(les => (
                              <button 
                                key={les.id} 
                                onClick={() => setActiveLessonId(les.id)}
                                className={`text-left text-sm px-3 py-2 rounded-md transition-colors ${activeLessonId === les.id ? 'bg-[#FFC847] text-black font-bold shadow-sm' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-100'}`}
                              >
                                {les.title}
                              </button>
                            ))}
                            <button 
                              onClick={() => handleAddLesson(mod.id)} 
                              className="text-xs text-blue-600 font-bold py-1 hover:underline text-left mt-1"
                            >
                              + Añadir lección
                            </button>
                          </div>
                        </div>
                      ))}
                      {modules.length === 0 && (
                        <div className="text-center text-gray-400 text-sm mt-10">
                          Empieza creando tu primer módulo.
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <button 
                        onClick={handleAddModule} 
                        className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        + Añadir Módulo
                      </button>
                    </div>
                  </div>

                  {/* Columna 2: Editor de Contenido */}
                  <div className="w-1/3 flex flex-col border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-200 bg-gray-50">
                      <button className="py-3 px-6 text-sm font-bold border-b-2 border-black text-black bg-white">Contenido</button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50">
                      {!activeLesson ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                          <FileText className="w-12 h-12 mb-3 text-gray-300" />
                          <p className="text-sm font-medium">Selecciona una lección para editar</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {activeLesson.blocks.map(blk => (
                            <div key={blk.id} className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
                              <div className="flex justify-between mb-3 text-xs font-bold text-blue-600 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Bloque de Texto</span>
                              </div>
                              <textarea 
                                value={blk.content} 
                                onChange={(e) => handleUpdateBlockContent(blk.id, e.target.value)}
                                rows={5} 
                                className="w-full text-sm border border-gray-100 outline-none resize-none bg-gray-50 p-3 rounded-lg focus:border-blue-300" 
                                placeholder="Escribe el contenido teórico de esta lección..."
                              ></textarea>
                            </div>
                          ))}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleAddTextBlock}>
                             <span className="text-sm font-bold text-gray-600 flex items-center justify-center gap-2">
                               <Plus className="w-4 h-4"/> Añadir Bloque de Texto
                             </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna 3: Configuración */}
                  <div className="w-1/3 flex flex-col border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                     <div className="p-4 bg-black text-[#FFC847] text-center text-sm font-black uppercase tracking-wider">
                       Ajustes de Lección
                     </div>
                     <div className="p-6">
                        {!activeLesson ? (
                           <p className="text-sm text-gray-400 text-center italic">Esperando selección...</p>
                        ) : (
                          <div className="animate-in fade-in">
                            <label className="text-xs font-bold text-gray-700 block mb-2 uppercase">Título de la Lección</label>
                            <input 
                              type="text" 
                              value={activeLesson.title} 
                              onChange={(e) => handleUpdateActiveLesson({title: e.target.value})} 
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 outline-none focus:border-[#FFC847]" 
                            />
                            
                            <label className="text-xs font-bold text-gray-700 block mb-2 uppercase">Duración (Minutos)</label>
                            <input 
                              type="number" 
                              value={activeLesson.duration} 
                              onChange={(e) => handleUpdateActiveLesson({duration: e.target.value})} 
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#FFC847]" 
                            />
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 3: PÁGINA DE INICIO --- */}
            {activeTab === 'inicio' && (
              <div className="max-w-4xl mx-auto animate-in fade-in pb-10">
                <div className="border-b border-gray-200 mb-8 pb-4">
                  <h1 className="text-2xl font-black text-black">Página de inicio del curso</h1>
                  <p className="text-sm text-gray-500 mt-1">Información que verán tus clientes al comprar.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex-1 flex flex-col gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Nombre del producto</label>
                      <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#FFC847]" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Descripción General</label>
                      <textarea 
                        value={landingData.description} 
                        onChange={(e) => setLandingData({...landingData, description: e.target.value})} 
                        rows={4} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#FFC847]"
                        placeholder="Vende tu curso con una buena descripción..."
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2 uppercase">Nivel del Curso</label>
                        <select 
                          value={landingData.level} 
                          onChange={(e) => setLandingData({...landingData, level: e.target.value})} 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 outline-none"
                        >
                          <option>Básico</option>
                          <option>Intermedio</option>
                          <option>Avanzado</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2 uppercase">Idioma</label>
                        <select 
                          value={landingData.language} 
                          onChange={(e) => setLandingData({...landingData, language: e.target.value})} 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 outline-none"
                        >
                          <option>Español</option>
                          <option>Inglés</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2 uppercase">Precio (S/)</label>
                        <input 
                          type="number" 
                          value={landingData.originalPrice} 
                          onChange={(e) => setLandingData({...landingData, originalPrice: e.target.value})} 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FFC847]" 
                          placeholder="0.00" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2 uppercase">Comisión Afiliados (%)</label>
                        <input 
                          type="number" 
                          value={landingData.affiliateCommission} 
                          onChange={(e) => setLandingData({...landingData, affiliateCommission: e.target.value})} 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FFC847]" 
                          placeholder="Ej: 40" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-64">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Imagen de Portada</label>
                    <div className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-[11px] text-gray-500 font-bold">Subida deshabilitada (Requiere Storage activo)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 4: CUPONES --- */}
            {activeTab === 'cupones' && (
              <div className="max-w-4xl mx-auto animate-in fade-in">
                <div className="border-b border-gray-200 mb-8 pb-4">
                  <h1 className="text-2xl font-black text-black">Cupones y Promociones</h1>
                </div>
                
                <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="font-black text-black text-sm mb-2 uppercase tracking-wider">Tu Enlace de Creador</h3>
                  <p className="text-xs text-gray-600 mb-4">Las ventas generadas por este enlace te otorgan la comisión máxima, sin descuentos de afiliados.</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`https://lernymart.com/curso/${courseId || 'borrador_temporal'}`} 
                      className="flex-1 border border-gray-300 bg-white rounded-lg px-4 py-2.5 text-sm text-blue-600 font-medium outline-none" 
                    />
                  </div>
                </div>

                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="font-black text-black text-sm mb-1 uppercase tracking-wider">Tus Cupones</h3>
                    <p className="text-xs text-gray-500">Impulsa tus ventas ofreciendo descuentos a tu comunidad.</p>
                  </div>
                  <button 
                    onClick={() => { setEditingCoupon({ id: '', code: '', discount: '', validity: '' }); setShowCouponModal(true); }} 
                    className="px-6 py-2.5 bg-[#FFC847] font-bold text-sm text-black rounded-lg hover:bg-yellow-400 shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4"/> Crear cupón
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
                  <div className="grid grid-cols-4 bg-black p-3 text-center text-xs font-black uppercase text-[#FFC847]">
                    <div>Código</div>
                    <div>Descuento</div>
                    <div>Vigencia</div>
                    <div>Acciones</div>
                  </div>
                  {coupons.length === 0 ? (
                    <div className="p-12 text-center text-sm font-medium text-gray-500 bg-gray-50/50">
                      No has creado promociones para este curso aún.
                    </div>
                  ) : (
                    coupons.map((c) => (
                      <div key={c.id} className="grid grid-cols-4 p-4 text-center text-sm border-t border-gray-100 items-center hover:bg-gray-50 transition-colors">
                        <div className="font-black text-gray-800">{c.code}</div>
                        <div className="text-green-600 font-bold">{c.discount}%</div>
                        <div className="text-gray-600 font-medium">{c.validity}</div>
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => { setEditingCoupon(c); setShowCouponModal(true); }} 
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4"/>
                          </button>
                          <button 
                            onClick={() => setCoupons(coupons.filter(cup => cup.id !== c.id))} 
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* --- TAB 5: TÉRMINOS --- */}
            {activeTab === 'terminos' && (
              <div className="max-w-4xl mx-auto animate-in fade-in pb-20">
                <div className="border-b border-gray-200 mb-8 pb-4">
                  <h1 className="text-2xl font-black text-black">Términos y Condiciones</h1>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 h-[350px] overflow-y-auto mb-6 text-sm text-gray-700 leading-relaxed text-justify shadow-inner">
                  <h3 className="font-black text-lg text-black mb-4 text-center underline">Declaración del Infoproductor</h3>
                  <p className="mb-4">Al hacer clic en "Publicar Curso", declaras bajo juramento ser el autor intelectual original de todo el contenido subido en este formulario (textos, videos, imágenes y recursos), o en su defecto, poseer las licencias comerciales escritas y explícitas para su distribución y monetización en la plataforma Lernymart.</p>
                  <p className="mb-4">Comprendes que Lernymart actúa únicamente como un intermediario tecnológico (Marketplace) y no se hace responsable por reclamos de derechos de autor de terceros. En caso de disputa de Copyright (DMCA), tu curso será suspendido inmediatamente y los fondos retenidos hasta la resolución del conflicto.</p>
                  <p>Aceptas las comisiones establecidas por la plataforma y la pasarela de pagos, así como el periodo de garantía de 7 días que se otorga por ley a los estudiantes en compras de bienes digitales.</p>
                </div>

                <div className="flex items-start gap-4 bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={termsAccepted} 
                    onChange={(e) => setTermsAccepted(e.target.checked)} 
                    className="w-6 h-6 mt-0.5 accent-blue-600 cursor-pointer" 
                  />
                  <label htmlFor="terms" className="text-sm font-medium text-gray-800 cursor-pointer leading-relaxed">
                    He leído y acepto los <span className="text-blue-600 font-bold">Términos de Uso</span>, las <span className="text-blue-600 font-bold">Políticas de Privacidad</span> y asumo la responsabilidad legal por los derechos de autor del contenido subido. Entiendo que marcar esta casilla habilitará el botón de publicación final.
                  </label>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    );
  }

  return null;
}