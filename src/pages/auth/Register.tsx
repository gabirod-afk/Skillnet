import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState<'comprador' | 'afiliado' | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError('Por favor selecciona si deseas comprar o vender.');
      return;
    }
    if (!termsAccepted) {
      setError('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    try {
      // 1. Crea el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Guarda el perfil del usuario en la base de datos (Firestore) con los nuevos campos
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role, 
        createdAt: new Date()
      });

      // 3. Redirige al inicio tras un registro exitoso
      navigate('/');
    } catch (err) {
      setError('Hubo un error al crear la cuenta. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white">
      
      {/* Mitad Izquierda - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col gap-10">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Crear Cuenta</h2>
            <p className="text-sm text-gray-500 font-medium">
              Continúa tu aprendizaje y alcanza tus objetivos profesionales
            </p>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            
            {/* Selección de Rol (Siempre visible arriba) */}
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-sm font-bold text-black uppercase tracking-wider">
                ¿Qué buscas en Lernymart?
              </h3>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setRole('comprador')}
                  className={`flex-1 py-4 px-6 border-2 rounded-xl font-bold text-sm tracking-wider transition-all ${
                    role === 'comprador' 
                    ? 'border-[#FFD147] bg-[#FFD147] text-black' 
                    : 'border-black hover:bg-gray-50 text-black'
                  }`}
                >
                  COMPRAR
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('afiliado')}
                  className={`flex-1 py-4 px-6 border-2 rounded-xl font-bold text-sm tracking-wider transition-all ${
                    role === 'afiliado' 
                    ? 'border-[#FFD147] bg-[#FFD147] text-black' 
                    : 'border-black hover:bg-gray-50 text-black'
                  }`}
                >
                  VENDER
                </button>
              </div>
            </div>

            {/* Inputs de Registro (Se expanden de forma animada si se ha seleccionado un rol) */}
            {role && (
              <div className="flex flex-col gap-5 mt-2 animate-in fade-in slide-in-from-bottom-5">
                
                {/* Título dinámico según el rol */}
                <h3 className="text-center text-lg font-bold text-black">
                  {role === 'comprador' ? 'Regístrate para Comprar' : 'Regístrate para Vender'}
                </h3>

                {/* Campo: Nombre(s) */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold flex items-center gap-2 text-black">
                    <User className="w-4 h-4 text-[#FFD147]" /> Nombre(s)
                  </label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                    placeholder="Ej. Juan"
                    className="w-full px-4 py-3 bg-[#EEF2F6] border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#FFD147] outline-none" 
                  />
                </div>

                {/* Campo: Apellidos */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold flex items-center gap-2 text-black">
                    <User className="w-4 h-4 text-[#FFD147]" /> Apellidos
                  </label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                    placeholder="Ej. Pérez Quispe"
                    className="w-full px-4 py-3 bg-[#EEF2F6] border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#FFD147] outline-none" 
                  />
                </div>

                {/* Campo: Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold flex items-center gap-2 text-black">
                    <Mail className="w-4 h-4 text-[#FFD147]" /> Email
                  </label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="minombresun@lernymart.com"
                    className="w-full px-4 py-3 bg-[#EEF2F6] border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#FFD147] outline-none" 
                  />
                </div>

                {/* Campo: Contraseña */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold flex items-center gap-2 text-black">
                    <Lock className="w-4 h-4 text-[#FFD147]" /> Contraseña
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-[#EEF2F6] border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#FFD147] outline-none pr-10" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Checkbox: Términos y Condiciones */}
                <div className="flex items-center gap-3 mt-1">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-5 h-5 accent-black border-2 border-black rounded"
                  />
                  <label htmlFor="terms" className="text-sm font-medium text-black">
                    Acepto los <a href="#" className="text-blue-600 font-bold hover:underline">Términos y Condiciones</a>
                  </label>
                </div>

                {/* Botón Principal de Registro */}
                <button 
                  type="submit" 
                  className="w-full bg-black text-white font-bold py-3.5 rounded-lg text-sm hover:bg-gray-800 transition-colors mt-3"
                >
                  Crear Cuenta
                </button>
              </div>
            )}
          </form>

          {/* Footer del Formulario */}
          <div className="text-center text-sm font-medium text-gray-600">
            ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 font-bold hover:underline">Inicia sesión</Link>
          </div>

        </div>
      </div>

      {/* Mitad Derecha - Imagen (Placeholder para tu register-bg.avif) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center font-black text-4xl text-gray-400 bg-gray-100">
          IMAGEN DE FONDO
          <p className="absolute bottom-4 text-sm text-gray-500">register-bg.avif</p>
        </div>
        <img 
          src="/src/assets/register-bg.avif" 
          alt="Hombre trabajando" 
          className="w-full h-full object-cover"
        /> 
      </div>

    </div>
  );
}