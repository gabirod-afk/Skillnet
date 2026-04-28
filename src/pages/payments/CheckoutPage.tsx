import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface CheckoutCourse {
  id: string;
  title: string;
  category?: string;
  price?: number | string;
  image_file_url?: string;
  image_url?: string;
  thumbnail_url?: string;
  professor?: {
    first_name?: string;
    last_name?: string;
    username?: string;
    full_name?: string;
  };
  author?: {
    name?: string;
  };
}

type PaymentMethod = 'card' | 'yape';

function formatAmount(value: number) {
  return `S/ ${value.toFixed(2)}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData } = useAuth();
  const directCourse = location.state?.directCourse as CheckoutCourse | undefined;

  const [docType, setDocType] = useState('DNI');
  const [dni, setDni] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [couponCode, setCouponCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const price = Number(directCourse?.price) || 0;
  const isDniValid = useMemo(() => /^\d{8}$/.test(dni.trim()), [dni]);

  useEffect(() => {
    const fullNameFromDb = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim();
    const fullNameFromAuth = user?.displayName || '';
    setName(fullNameFromDb || fullNameFromAuth || '');
    setEmail(userData?.email || user?.email || '');
  }, [userData, user]);

  const instructorName =
    directCourse?.professor?.full_name ||
    `${directCourse?.professor?.first_name || ''} ${directCourse?.professor?.last_name || ''}`.trim() ||
    directCourse?.professor?.username ||
    directCourse?.author?.name ||
    'Intercert';

  const imageUrl =
    directCourse?.image_file_url ||
    directCourse?.thumbnail_url ||
    directCourse?.image_url ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop';

  return (
    <div className="bg-white min-h-screen p-4 md:p-5 font-sans">
      <div className="max-w-[1300px] mx-auto rounded-[20px] border border-[#E2E8F0] overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.02)] bg-white">
        <div className="bg-black text-white px-6 py-3.5 flex justify-between items-center">
          <h1 className="text-[15px] font-semibold m-0">Formulario de pago</h1>
          <div className="text-[12px] font-medium flex items-center gap-1.5">
            <span className="opacity-80">PE Cambiar país</span>
            <i className="ri-arrow-down-s-line" />
          </div>
        </div>

        <div className="p-6">
          {!directCourse ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-600 mb-4">No se encontró un curso para pagar.</p>
              <button
                type="button"
                className="bg-black text-white px-5 py-2.5 rounded-lg"
                onClick={() => navigate('/marketplace')}
              >
                Volver al marketplace
              </button>
            </div>
          ) : (
            <>
              <div className="border border-[#E2E8F0] rounded-[18px] flex overflow-hidden mb-5">
                <div className="w-[200px] h-[120px] flex-shrink-0">
                  <img src={imageUrl} alt={directCourse.title} className="w-full h-full object-cover" />
                </div>
                <div className="px-6 py-4 flex-1 flex flex-col justify-center">
                  <h2 className="text-[20px] font-bold m-0 mb-1.5 text-black">{directCourse.title}</h2>
                  <div className="flex flex-col gap-1 text-[#64748B] text-[13px]">
                    <span>Infoproductor: {instructorName}</span>
                    <span>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
                    <span>Categorías: {directCourse.category || 'Programa de Certificación Profesional'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] mb-5 items-start">
                <div className="flex flex-col gap-5">
                  <div className="border border-[#E2E8F0] rounded-[18px] p-5 bg-white">
                    <h3 className="text-[16px] font-bold mb-4 text-black">Información Personal</h3>
                    <div className="flex flex-col gap-3.5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-black">
                          Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={name}
                          readOnly
                          className="px-3.5 py-2.5 rounded-[10px] border border-[#94A3B8] text-[13px] bg-[#F8FAFC] text-[#1E293B] outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-black">
                          Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={email}
                          readOnly
                          className="px-3.5 py-2.5 rounded-[10px] border border-[#94A3B8] text-[13px] bg-[#F8FAFC] text-[#1E293B] outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-black">
                          Doc. de Identidad <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="px-2.5 py-2.5 rounded-[10px] border border-[#94A3B8] bg-white text-[13px] text-black outline-none"
                          >
                            <option value="DNI">DNI</option>
                            <option value="CE">CE</option>
                            <option value="Pasaporte">Pasaporte</option>
                          </select>
                          <input
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            placeholder="Número de documento"
                            className="flex-1 px-3.5 py-2.5 rounded-[10px] border border-[#94A3B8] text-[13px] bg-white text-[#1E293B] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[#E2E8F0] rounded-[18px] p-5 bg-white">
                    <h3 className="text-[16px] font-bold mb-4 text-black">Resumen del Pedido</h3>
                    <div className="flex flex-col gap-3.5">
                      <div className="flex justify-between text-[14px] font-semibold">
                        <span className="text-black">Precio del Curso</span>
                        <span className="text-black">{formatAmount(price)}</span>
                      </div>
                      <div className="flex justify-between text-[16px] font-bold border-t border-[#F1F5F9] pt-3 mt-1">
                        <span className="text-black">Total a Pagar</span>
                        <span className="text-black">{formatAmount(price)}</span>
                      </div>

                      <div>
                        <label className="text-[12px] font-semibold text-black block mb-1.5">¿Tienes un código de descuento?</label>
                        <div className="flex gap-2">
                          <input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Introduce tu código"
                            className="flex-1 px-3 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[12px] bg-[#F8FAFC] outline-none"
                          />
                          <button type="button" className="text-[#FFC847] bg-transparent border-none font-bold text-[12px] cursor-pointer">
                            Validar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="border border-[#E2E8F0] rounded-[18px] p-5 bg-white">
                    {!isDniValid && (
                      <div className="bg-[#FEF9C3] border border-[#FEF08A] rounded-xl px-4 py-3 mb-4 flex items-center gap-2.5">
                        <i className="ri-information-fill text-[#A16207] text-[18px]" />
                        <span className="text-[13px] text-[#854D0E] font-semibold">
                          Ingresa un DNI válido (8 dígitos) para habilitar los métodos de pago.
                        </span>
                      </div>
                    )}

                    <h3 className="text-[16px] font-bold mb-4 text-black text-center">Escoge tu método de pago</h3>

                    <div className={`transition-opacity ${isDniValid ? 'opacity-100' : 'opacity-45 pointer-events-none'}`}>
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`rounded-xl border px-4 py-3 text-left min-w-[130px] ${
                            paymentMethod === 'card' ? 'border-[#FFC847] bg-[#FFF8E1]' : 'border-[#E2E8F0] bg-white'
                          }`}
                        >
                          <p className="text-[12px] font-semibold text-black m-0">Tarjeta débito / crédito</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('yape')}
                          className={`rounded-xl border px-4 py-3 text-left min-w-[90px] ${
                            paymentMethod === 'yape' ? 'border-[#FFC847] bg-[#FFF8E1]' : 'border-[#E2E8F0] bg-white'
                          }`}
                        >
                          <p className="text-[12px] font-semibold text-black m-0">Yape</p>
                        </button>
                      </div>

                      {paymentMethod === 'card' ? (
                        <div className="flex flex-col gap-3">
                          <input placeholder="#### #### #### ####" className="px-3.5 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[13px] outline-none" />
                          <div className="grid grid-cols-2 gap-3">
                            <input placeholder="MM/AA" className="px-3.5 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[13px] outline-none" />
                            <input placeholder="CVV" className="px-3.5 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[13px] outline-none" />
                          </div>
                          <input value={email} readOnly className="px-3.5 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[13px] bg-[#F8FAFC] outline-none" />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <input placeholder="Número de celular Yape" className="px-3.5 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[13px] outline-none" />
                          <input placeholder="Código de confirmación" className="px-3.5 py-2.5 rounded-[10px] border border-[#E2E8F0] text-[13px] outline-none" />
                        </div>
                      )}

                      <button type="button" className="w-full mt-5 bg-[#E5E7EB] text-gray-500 py-3 rounded-[10px] text-[14px] font-semibold cursor-not-allowed">
                        Pagar {formatAmount(price)}
                      </button>

                      <p className="text-[11px] text-[#64748B] mt-3 text-center">Compra segura con cifrado de datos.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="bg-[#F8FAFC] rounded-xl px-4 py-3 flex items-center gap-2.5 text-[12px] text-[#475569] border border-[#E2E8F0]">
                  <i className="ri-shield-check-line text-[18px] text-[#10B981]" />
                  <span>Tu pago es procesado de forma segura. Lernymart no almacena tus datos bancarios.</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
