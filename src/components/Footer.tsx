import { Rocket, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B152A] text-white pt-16 pb-8">
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-700 pb-12">
          
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">SkillNet</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transformando el futuro profesional a través de la educación digital accesible y de alta calidad.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Plataforma</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cursos de IA</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Certificaciones</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Precios</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Soporte</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Ayuda</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Afiliados</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contáctanos</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +51 999 999 999</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contacto@skillnet.com</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Lima, Perú</li>
            </ul>
          </div>

        </div>
        <div className="text-center text-sm text-slate-500">
          © 2026 SkillNet. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}