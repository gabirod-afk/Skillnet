import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/marketplace');
    } catch (err) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white">
      
      {/* Mitad Izquierda - Imagen */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-200">
        <img 
          src="/src/assets/login-bg.jpg" 
          alt="Equipo trabajando" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mitad Derecha - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md flex flex-col gap-6">
          
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold mb-2">Inicia Sesión</h2>
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold flex items-center gap-2 text-black">
                <Mail className="w-4 h-4 text-[#FFD147]" /> Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@lernymart.com"
                className="w-full px-4 py-3 bg-[#EEF2F6] border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#FFD147] outline-none"
              />
            </div>

            {/* Input Contraseña */}
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
              <div className="text-right mt-1">
                <a href="#" className="text-xs text-blue-600 font-semibold hover:underline">
                  He olvidado mi contraseña
                </a>
              </div>
            </div>

            {/* Botón Principal */}
            <button 
              type="submit"
              className="w-full bg-[#FFD147] text-black font-bold py-3 rounded-lg text-sm hover:bg-yellow-400 transition-colors mt-2"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-bold text-black uppercase">o</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Login Social */}
          <button className="w-full border border-gray-200 text-black font-bold py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Inicia Sesión con Google
          </button>

          {/* Footer del Formulario */}
          <div className="text-center text-sm font-medium text-gray-600 mt-2">
            ¿Eres nuevo en LernyMart? <Link to="/register" className="text-blue-600 font-bold hover:underline">Crea tu cuenta hoy.</Link>
          </div>

        </div>
      </div>
    </div>
  );
}