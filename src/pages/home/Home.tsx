
const Home = () => {
  return (
    <div className="min-h-screen bg-[#FCFAF6] font-sans text-black">
      
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-6 pt-32 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            <span className="bg-[#FFD147] px-2">¿Quiénes somos?</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
            Somos un marketplace especializado en infoproductos empresariales, creado para conectar a compañías, instituciones educativas, expertos y profesionales con contenido de formación de alto nivel que genera impacto real.
          </p>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          {/* Contenedor tipo arco (arch) */}
          <div className="w-80 h-[450px] border-8 border-black rounded-t-[10rem] rounded-b-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src="/src/assets/hero.jpg" // Asegúrate de tener tu imagen aquí
              alt="Equipo trabajando" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32 text-center">
          <div>
            <h2 className="text-5xl font-bold mb-2">+500</h2>
            <p className="text-xs tracking-[0.2em] text-gray-400 font-semibold uppercase">Profesionales</p>
          </div>
          <div>
            <h2 className="text-5xl font-bold mb-2">+30k</h2>
            <p className="text-xs tracking-[0.2em] text-gray-400 font-semibold uppercase">Infoproductos</p>
          </div>
          <div>
            <h2 className="text-5xl font-bold mb-2">+30k</h2>
            <p className="text-xs tracking-[0.2em] text-gray-400 font-semibold uppercase">Infoproductos</p>
          </div>
        </div>
      </section>

      {/* 3. POR QUÉ ESCOGERNOS */}
      <section className="py-24 bg-[#FCFAF6]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block bg-[#FFD147] font-bold px-6 py-2 rounded-md mb-12 text-lg">
            ¿Por qué escogernos?
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="border-4 border-black rounded-xl overflow-hidden flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white h-full">
              <div className="bg-black text-white py-4 font-bold tracking-widest text-sm uppercase">Certificaciones</div>
              <div className="p-8 flex-grow flex items-center justify-center text-center font-medium text-gray-800">
                que suman valor profesional, respaldadas por INTERCERT LATAM.
              </div>
            </div>
            {/* Card 2 */}
            <div className="border-4 border-black rounded-xl overflow-hidden flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white h-full">
              <div className="bg-black text-white py-4 font-bold tracking-widest text-sm uppercase">Aprendizaje</div>
              <div className="p-8 flex-grow flex items-center justify-center text-center font-medium text-gray-800">
                práctico y fluido, diseñado para crear, aplicar y crecer.
              </div>
            </div>
            {/* Card 3 */}
            <div className="border-4 border-black rounded-xl overflow-hidden flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white h-full">
              <div className="bg-black text-white py-4 font-bold tracking-widest text-sm uppercase">Contenido</div>
              <div className="p-8 flex-grow flex items-center justify-center text-center font-medium text-gray-800">
                especializado y confiable para los desafíos reales del mundo empresarial.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EN QUÉ CREEMOS (Misión, Visión, Valores) */}
      <section className="bg-[#FFD147] py-24 pb-48">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-black italic mb-12 flex items-center gap-2">
            <span>➤</span> ¿EN QUÉ CREEMOS?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Misión */}
            <div className="border-2 border-black rounded-2xl p-8 bg-[#FFD147] flex flex-col items-center text-center h-full">
              <span className="bg-black text-white px-6 py-1 rounded-full font-bold text-xs mb-6 uppercase">Misión</span>
              <p className="font-medium text-sm leading-relaxed">
                Impulsar el desarrollo profesional y corporativo mediante un marketplace que conecta a personas con formación empresarial de calidad, confiable y certificable.
              </p>
            </div>
            {/* Visión */}
            <div className="border-2 border-black rounded-2xl p-8 bg-[#FFD147] flex flex-col items-center text-center h-full">
              <span className="bg-black text-white px-6 py-1 rounded-full font-bold text-xs mb-6 uppercase">Visión</span>
              <p className="font-medium text-sm leading-relaxed">
                Ser la plataforma líder en infoproductos empresariales, reconocida por su calidad, innovación y capacidad de generar resultados reales en personas y empresas.
              </p>
            </div>
            {/* Valores (Card Superior) */}
            <div className="border-2 border-black rounded-2xl p-8 bg-[#FFD147] flex flex-col items-center text-center h-full">
              <span className="bg-black text-white px-6 py-1 rounded-full font-bold text-xs mb-6 uppercase">Valores</span>
              <p className="font-medium text-sm leading-relaxed">
                Ser la plataforma líder en infoproductos empresariales, reconocida por su calidad, innovación y capacidad de generar resultados reales en personas y empresas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LISTA DE VALORES (Montado sobre la sección amarilla) */}
      <section className="bg-[#FCFAF6] relative z-10">
        <div className="container mx-auto px-6 -mt-32 pb-24">
          <div className="max-w-2xl mx-auto border-4 border-black rounded-2xl bg-[#FCFAF6] shadow-[8px_8px_0px_0px_#FFDF73] overflow-hidden">
            <div className="bg-black text-white py-6 px-8">
              <h3 className="text-3xl font-black italic">VALORES</h3>
            </div>
            <div className="p-10">
              <ul className="space-y-6">
                {[
                  'Aprendizaje con propósito',
                  'Oportunidades para todos',
                  'Monetización justa y transparente',
                  'Especialización en educación empresarial',
                  'Calidad en cada formación',
                  'Confianza y seguridad en la plataforma'
                ].map((valor, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-lg font-bold">
                    <span className="w-4 h-4 rounded-full border-4 border-[#FFD147] bg-white flex-shrink-0"></span>
                    {valor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;