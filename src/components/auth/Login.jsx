import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Layers, Zap, Target, Sparkles } from 'lucide-react';

const CRM_QUOTES = [
  { text: "Un taller mecánico sin sitio web es un cliente esperando por Nexus Garage.", author: "Estrategia de Prospección" },
  { text: "El CRM no es para vigilar al vendedor, es para sistematizar y liberar su tiempo.", author: "Metodología Lean" },
  { text: "En la venta de SaaS B2B, el seguimiento oportuno cierra más tratos que un gran discurso.", author: "Nexus Garage Sales" },
  { text: "Nexus Hunter automatiza la búsqueda para que tú te enfocores en la conversión.", author: "SmartLean Tech" }
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Rotar frases cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % CRM_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      const res = await login(email, password);
      if (res && res.error) {
        setError(res.error.message);
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error en la conexión con el servidor. Intenta de nuevo.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col lg:flex-row font-sans selection:bg-cyan-500/30 overflow-y-auto">
      
      {/* Panel Izquierdo (Héroe Corporativo Smartlean) */}
      <div className="flex w-full lg:w-1/2 relative flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-[#050b14] via-[#0a1628] to-[#050b14] overflow-hidden min-h-[50vh] lg:min-h-screen border-r border-white/[0.03]">
        {/* Orbes de neón en segundo plano */}
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
          <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/15 rounded-full mix-blend-screen filter blur-[120px]"></div>
          <div className="absolute top-[10%] -left-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px]"></div>
        </div>

        {/* Logo Header Smartlean */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-[0_4px_14px_rgba(6,182,212,0.35)]">
              <Layers size={20} className="font-black" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                NEXUS <span className="text-[#00d2ff]">CRM</span>
              </span>
              <span className="text-[9.5px] text-[#00d2ff] font-black tracking-[0.16em] block uppercase -mt-0.5 drop-shadow-[0_0_10px_rgba(0,210,255,0.4)]">
                BY SMARTLEAN
              </span>
            </div>
          </div>
        </div>

        {/* Contenido Central (Con padding garantizado para evitar colapso vertical) */}
        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col justify-center my-auto py-12 gap-7">
          
          {/* Tag Corporativo Superior */}
          <div className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[#22d3ee] text-[11px] font-extrabold tracking-wider uppercase backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse"></span>
            TECNOLOGÍA CRM 4.0 ACTIVA
          </div>

          {/* Título Principal de Alto Impacto */}
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-[1.15] tracking-tight">
            Pipeline, Hunter e IA: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-cyan-400 to-blue-500">
              impulsando el crecimiento de tu negocio.
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
            Plataforma centralizada e inteligente para el Propietario de Nexus. Controla el embudo comercial Kanban, prospecta automáticamente con Nexus Hunter en Google Maps y califica prospectos en tiempo real con IA.
          </p>

          {/* 3 Ventajas Corporativas con Iconos Cian */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <Zap size={16} className="text-[#00d2ff] shrink-0" />
              <span className="text-xs font-semibold text-slate-300">Gestión Ágil</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <Target size={16} className="text-[#00d2ff] shrink-0" />
              <span className="text-xs font-semibold text-slate-300">Hunter Maps</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <Sparkles size={16} className="text-[#00d2ff] shrink-0" />
              <span className="text-xs font-semibold text-slate-300">Calificación IA</span>
            </div>
          </div>

          {/* Frases Rotativas Estilo Smartlean */}
          <div className="relative h-20 w-full overflow-hidden mt-2 border-l-2 border-[#00d2ff]/60 bg-white/[0.015] rounded-r-xl">
            {CRM_QUOTES.map((quote, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col justify-center pl-5 pr-4 transition-all duration-1000 transform ${
                  index === currentQuoteIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <p className="text-slate-300 italic text-xs leading-relaxed font-medium">"{quote.text}"</p>
                <p className="text-[#00d2ff] text-[11px] font-extrabold mt-1 tracking-wider uppercase">— {quote.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Izquierdo Corporativo */}
        <div className="relative z-10 text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
          © {new Date().getFullYear()} SMARTLEAN • PRODUCTO OFICIAL
        </div>
      </div>

      {/* Panel Derecho (Formulario de Acceso) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#050b14] min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-[390px] relative z-10 py-8">
          
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white mb-2 leading-tight tracking-tight">
              Ingreso de Propietario
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
              Acceso seguro exclusivo para administradores con credenciales de <strong className="text-cyan-400 font-bold">NexusOwner</strong>.
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-6 text-xs font-bold flex items-start gap-2.5">
              <span className="shrink-0 text-base">⚠️</span>
              <p className="leading-normal">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#00d2ff]">
                  <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-[#00d2ff]" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  className="w-full bg-[#081020] border border-slate-800 text-white rounded-xl py-3.5 pl-11 pr-4 placeholder-slate-600 focus:outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] transition-all text-xs font-semibold"
                  placeholder="propietario@nexusgarage.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#00d2ff]">
                  <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-[#00d2ff]" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  className="w-full bg-[#081020] border border-slate-800 text-white rounded-xl py-3.5 pl-11 pr-4 placeholder-slate-600 focus:outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] transition-all text-xs font-semibold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Botón Primario Degradado Smartlean */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-[#00d2ff] to-[#2563eb] text-white font-extrabold rounded-xl shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer border-none"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validando Credenciales...</span>
                </>
              ) : (
                <>
                  <span>INGRESAR AL CRM</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Nota de credenciales locales */}
            <p className="text-[11px] text-slate-500 text-center font-medium pt-4 leading-relaxed">
              * Para demostración local usa el correo de administrador:<br />
              <span className="text-[#00d2ff] font-bold select-all">contacto@smartlean.cl</span> con clave <span className="text-[#00d2ff] font-bold select-all">nexus123</span>.
            </p>
          </form>

        </div>
      </div>

    </div>
  );
}
