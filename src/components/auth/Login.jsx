import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, TrendingUp } from 'lucide-react';

const CRM_QUOTES = [
  { text: "Un taller mecánico sin sitio web es un cliente esperando por Nexus Garage.", author: "Estrategia de Prospección" },
  { text: "El CRM no es para vigilar al vendedor, es para sistematizar y liberar su tiempo.", author: "Metodología Lean" },
  { text: "En la venta de SaaS B2B, el seguimiento oportuno cierra más tratos que un gran discurso.", author: "Nexus Garage Sales" },
  { text: "Nexus Hunter automatiza la búsqueda para que tú te enfoques en la conversión.", author: "SmartLean Tech" }
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
    <div className="min-h-screen bg-[#050B14] flex flex-col lg:flex-row font-sans selection:bg-cyan-500/30 overflow-y-auto">
      
      {/* Panel Izquierdo - Hero del CRM */}
      <div className="flex w-full lg:w-1/2 relative flex-col justify-between p-8 sm:p-12 bg-gradient-to-br from-[#050B14] via-[#0b1329] to-[#050B14] overflow-hidden min-h-[50vh] lg:min-h-screen">
        {/* Efectos de Orbe en el Fondo */}
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
          <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-40"></div>
        </div>

        {/* Logo/Marca */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-40 rounded-full"></div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white relative shadow-lg">
                <TrendingUp size={20} className="animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">NEXUS <span className="text-cyan-400">CRM</span></span>
              <span className="text-[10px] text-cyan-400 font-semibold tracking-widest block uppercase -mt-1">by SmartLean</span>
            </div>
          </div>
        </div>

        {/* Mensaje Central */}
        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col justify-center my-auto py-8">
          <div className="self-start inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Sales & Scrapers • Nexus Garage
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Pipeline, Hunter e IA:</span> <br />
            Gestionando las ventas <br />
            de Nexus Garage.
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-medium">
            Plataforma centralizada de ventas para el Propietario de Nexus. Controla el embudo comercial Kanban, prospecta locales con Nexus Hunter en Google Maps y califica automáticamente con Gemini AI.
          </p>

          {/* Frases Rotativas */}
          <div className="relative h-20 w-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500/50"></div>
            {CRM_QUOTES.map((quote, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col justify-center pl-6 transition-all duration-1000 transform ${index === currentQuoteIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
              >
                <p className="text-slate-300 italic text-sm leading-relaxed">"{quote.text}"</p>
                <p className="text-cyan-500 text-xs font-bold mt-1">— {quote.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Izquierdo */}
        <div className="relative z-10 text-[10px] text-slate-500 font-medium">
          © {new Date().getFullYear()} NEXUS CRM. Una solución de SmartLean.
        </div>
      </div>

      {/* Panel Derecho - Formulario de Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#050B14] min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-[380px] relative z-10 py-8">
          
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
              Ingreso Propietario
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Acceso exclusivo para administradores con privilegios de **NexusOwner**.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-xs font-semibold flex items-start gap-2">
              <span className="shrink-0">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Correo Electrónico</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-600" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  className="w-full bg-[#081020] border border-slate-800 text-white rounded-xl py-3.5 pl-11 pr-4 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-xs font-semibold"
                  placeholder="propietario@nexusgarage.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-600" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  className="w-full bg-[#081020] border border-slate-800 text-white rounded-xl py-3.5 pl-11 pr-4 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-xs"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-cyan-500/10 transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-xs uppercase tracking-wider cursor-pointer mt-6"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Validando Rol...</span>
                  </>
                ) : (
                  <>
                    <span>Acceder al Panel CRM</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              
              {/* Shiny overlay effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 transition-all duration-1000 group-hover:left-[125%] pointer-events-none" style={{ left: '-125%' }} />
            </button>

            {/* Nota de credenciales locales */}
            <p className="text-[10px] text-slate-650 text-center font-medium pt-4 leading-relaxed">
              * Para demostración local usa el correo de administrador:<br />
              <span className="text-cyan-600 font-bold select-all">contacto@smartlean.cl</span> con clave <span className="text-cyan-600 font-bold select-all">nexus123</span>.
            </p>
          </form>

        </div>
      </div>

    </div>
  );
}
