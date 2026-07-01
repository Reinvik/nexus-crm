import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  HelpCircle, 
  Calculator, 
  BookOpen, 
  ChevronRight, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  Copy,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldAlert,
  Coins,
  MapPin,
  TrendingDown
} from 'lucide-react';

const MOCK_PITCHES = [
  {
    target: "Marcelo (Taller Integral)",
    hook: "Dolor: Fugas de repuestos y control de stock.",
    script: "Hola Marcelo, vi tu taller en Maps. Te escribo de SmartLean Chile porque queremos hacerte una propuesta comercial concreta. Ayudamos a talleres medianos a tapar fugas de dinero silenciosas, como repuestos que se instalan y se olvida cobrar, o mecánicos que pierden tiempo esperando instrucciones. ¿Te tinca si conversamos 5 minutos por teléfono para ver si tu taller pasa por lo mismo?"
  },
  {
    target: "Sebastián (Tecno-Heredero)",
    hook: "Dolor: Digitalización y resistencia al cambio del equipo.",
    script: "Hola Sebastián. Felicitaciones por el taller. Te contacto porque tenemos una propuesta comercial para modernizar la operación. Ayudamos a sistematizar el flujo para que cotices en 5 minutos y los mecánicos usen el celular sin resistencia para reportar. ¿Te tinca si nos tomamos 5 minutos para ver si el desorden de papel hoy te frena las ventas?"
  },
  {
    target: "Don Hugo (Taller de Barrio)",
    hook: "Dolor: Olvido de cobros de mano de obra y agilidad.",
    script: "Hola Don Hugo. Su taller tiene una reputación de barrio espectacular. Le escribo porque queremos presentarle una propuesta comercial simple. Ayudamos a dueños a ordenar sus cobros de mano de obra para que no regalen su trabajo y a enviar cotizaciones formales por WhatsApp en segundos. ¿Le acomoda si conversamos 5 minutos para contarle?"
  },
  {
    target: "Consorcio (Socios Multi-Taller)",
    hook: "Dolor: Desconfianza, mermas e inconsistencia inter-sucursal.",
    script: "Estimados. Administrar múltiples sucursales a distancia abre la puerta a inconsistencias y mermas en bodega. Les escribo para presentarles una propuesta de auditoría. Automatizamos el cruce de inventario para que cada repuesto se asocie obligatoriamente a una patente. ¿Tendrán 5 minutos esta semana para ver si sus mermas vienen de ahí?"
  }
];

const TROUBLESHOOTING_MATRIX = [
  {
    problem: "Pérdida de repuestos en bodega (el pañol)",
    impact: "El taller pierde entre $150.000 y $500.000 mensuales en repuestos que se instalan pero no se cobran.",
    solution: "Cruce obligatorio de stock. En Nexus, ningún repuesto sale de bodega sin estar asociado a una Orden de Trabajo activa y pre-aprobada.",
    feature: "Módulo de Inventarios & Pañol Digital"
  },
  {
    problem: "Presupuestos lentos y rechazados por desconfianza",
    impact: "Los clientes no aprueban el presupuesto porque creen que el mecánico inventa fallas. Tasa de rechazo > 50%.",
    solution: "Evidencia Digital. Envío de presupuestos formales interactivos por WhatsApp con fotos y videos de la falla real del auto.",
    feature: "Cotizador Interactivo & WhatsApp Linker"
  },
  {
    problem: "Disputas por daños estéticos (rayones/choques)",
    impact: "El cliente reclama que el auto salió rayado del taller. Tienes que asumir reparaciones gratis de daños no imputables.",
    solution: "Ficha de Recepción Digital. Checklist fotográfico obligatorio de 4 costados firmado digitalmente por el cliente al ingresar.",
    feature: "Checklist de Ingreso Fotográfico"
  },
  {
    problem: "Baja productividad de los mecánicos",
    impact: "Los maestros pierden 1.5 horas al día caminando a la oficina para preguntar qué auto sigue o pedir piezas.",
    solution: "Flujo Gemba en tiempo real. Cada mecánico ve su cola de tareas y patentes asignadas directamente en su celular con 3 clics.",
    feature: "Panel Móvil del Mecánico"
  },
  {
    problem: "Cero retención y retorno de clientes",
    impact: "Menos del 20% de los clientes regresan. Pierdes la oportunidad de vender mantenciones preventivas a los 10.000 km.",
    solution: "Fidelización Predictiva. El sistema envía recordatorios automáticos de mantenimiento a los 6 meses directo al WhatsApp del cliente.",
    feature: "CRM & Recordatorios Post-Servicio"
  }
];

export default function MentorshipPlaybook() {
  const [activeTab, setActiveTab] = useState('how-to-offer');
  
  // --- Estados de la Calculadora de Fugas en Caliente ---
  const [autosMes, setAutosMes] = useState(60);
  const [ticketPromedio, setTicketPromedio] = useState(120000);
  const [fugaStockMes, setFugaStockMes] = useState(180000); // Repuestos que se pierden
  const [tasaRechazo, setTasaRechazo] = useState(40); // % de cotizaciones rechazadas
  const [costoReclamos, setCostoReclamos] = useState(120000); // Disputas estéticas/garantías al mes
  const [tieneWeb, setTieneWeb] = useState('no'); // 'si' o 'no'

  // --- Estados de la calculadora de Punto de Equilibrio (Diagnóstico Cobrado) ---
  const [costosFijosTaller, setCostosFijosTaller] = useState(2800000);
  const [cantMecanicos, setCantMecanicos] = useState(3);
  const [sueldoMecanico, setSueldoMecanico] = useState(650000);
  const [margenRepuestosPct, setMargenRepuestosPct] = useState(35);
  
  // --- Cálculos de Fuga ---
  const consultasTotales = autosMes / (1 - tasaRechazo / 100);
  const perdidasRechazo = Math.round((consultasTotales - autosMes) * 0.3 * ticketPromedio); // Estimando que recuperamos 30% de rechazos
  const perdidaWeb = tieneWeb === 'no' ? Math.round(consultasTotales * 0.3 * ticketPromedio) : 0; // 30% de pérdida por visibilidad
  const perdidaTotalMensual = fugaStockMes + perdidasRechazo + costoReclamos + perdidaWeb;
  const costoLicenciaNexus = 45000;
  const retornoInversion = Math.round(perdidaTotalMensual / costoLicenciaNexus);

  // --- Cálculos del Diagnóstico Financiero (RPM) ---
  const costoNominaMecanicos = cantMecanicos * sueldoMecanico;
  const costoOperativoTotal = costosFijosTaller + costoNominaMecanicos;
  
  // Asumiendo un margen ponderado promedio del taller de un 45% (mano de obra + repuestos)
  const margenPonderado = 0.45; 
  const ventaMensualEquilibrio = Math.round(costoOperativoTotal / margenPonderado);
  const ventaDiariaEquilibrio = Math.round(ventaMensualEquilibrio / 22); // 22 días hábiles
  const costoHoraFijaTaller = Math.round(costoOperativoTotal / (cantMecanicos * 8 * 22)); // 8 hrs, 22 días

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Selector de Pestañas */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTab('how-to-offer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap
            ${activeTab === 'how-to-offer' 
              ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/15' 
              : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'}`}
        >
          <BookOpen size={14} />
          Flujo de Venta Socrático
        </button>
        <button
          onClick={() => setActiveTab('diagnostic')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap
            ${activeTab === 'diagnostic' 
              ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/15' 
              : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'}`}
        >
          <HelpCircle size={14} />
          Guión y Rebote Socrático
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap
            ${activeTab === 'calculator' 
              ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/15' 
              : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'}`}
        >
          <Calculator size={14} />
          Simulador de Fugas (Cierre)
        </button>
        <button
          onClick={() => setActiveTab('premium-diagnostic')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap
            ${activeTab === 'premium-diagnostic' 
              ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/15' 
              : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'}`}
        >
          <Sparkles size={14} className="text-yellow-500" />
          Diagnóstico Cobrado (Premium)
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap
            ${activeTab === 'matrix' 
              ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/15' 
              : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'}`}
        >
          <Target size={14} />
          Dolores vs Soluciones
        </button>
        <button
          onClick={() => setActiveTab('aptitude-disqualification')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap
            ${activeTab === 'aptitude-disqualification' 
              ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/15' 
              : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'}`}
        >
          <Target size={14} className="text-amber-500 animate-pulse" />
          Aptitud & Descarte (Sara Alonso)
        </button>
      </div>

      {/* Pestaña 1: Flujo de Venta Socrático */}
      {activeTab === 'how-to-offer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-cyan-600">
                <Sparkles size={18} className="animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-wider">El Protocolo de Prospección Socrático</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                No fingimos que venimos a asesorar gratis sin vender nada. Nos presentamos con <span className="text-slate-900 font-extrabold">transparencia comercial</span> (venimos a hacer una propuesta). Inmediatamente planteamos las pérdidas típicas del rubro y le pedimos al dueño del taller que califique su propio problema. Esto genera confianza y elimina la resistencia psicológica del cliente.
              </p>
              
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Las 4 Fases de la Conversación Comercial:</h4>
                
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 font-black flex items-center justify-center text-xs shrink-0">1</div>
                    <div className="text-xs space-y-1">
                      <span className="font-extrabold text-slate-800 block">La Entrada Transparente</span>
                      <span className="text-slate-550 leading-normal block">"Hola, te contacto de SmartLean Chile porque queremos hacerte una propuesta comercial enfocada en tu taller."</span>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 font-black flex items-center justify-center text-xs shrink-0">2</div>
                    <div className="text-xs space-y-1">
                      <span className="font-extrabold text-slate-800 block">Plantear Problemáticas Comunes (Pérdidas)</span>
                      <span className="text-slate-550 leading-normal block">"Nos especializamos en tapar fugas de dinero en talleres. Lo típico que vemos es que se pierden repuestos en bodega sin cobrarse, los mecánicos pasan horas desocupados esperando órdenes, no se tiene página web por lo que el cliente se va con la competencia de Maps, o los clientes rechazan presupuestos por desconfianza."</span>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 font-black flex items-center justify-center text-xs shrink-0">3</div>
                    <div className="text-xs space-y-1">
                      <span className="font-extrabold text-slate-800 block">Pregunta de Diagnóstico (El Gancho Socrático)</span>
                      <span className="text-slate-550 leading-normal block text-cyan-700 font-bold">"Y en su caso, ¿usted cree que las pérdidas o el desorden de su negocio vienen de ahí?"</span>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 font-black flex items-center justify-center text-xs shrink-0">4</div>
                    <div className="text-xs space-y-1">
                      <span className="font-extrabold text-slate-800 block">Mitigación y Cierre con el SaaS</span>
                      <span className="text-slate-550 leading-normal block">Si hay buena sintonía y el cliente acepta el dolor, se le explica cómo nuestro software Nexus Garage calma y soluciona el problema de raíz de manera simple.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guiones de Prospección por WhatsApp */}
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100/80 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Pitches Socráticos de Entrada (WhatsApp)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_PITCHES.map((p, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl flex flex-col justify-between space-y-3 relative group">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-slate-800">{p.target}</span>
                        <span className="text-[9px] font-bold text-cyan-600 bg-cyan-100/40 px-1.5 py-0.5 rounded-full">{p.hook}</span>
                      </div>
                      <p className="text-slate-550 font-semibold leading-relaxed italic bg-white p-3 rounded-lg border border-slate-100 mt-2 select-all">
                        "{p.script}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(p.script, idx)}
                      className="self-end text-[10px] font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>{copiedIndex === idx ? '¡Copiado!' : 'Copiar Mensaje'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Psicología del Rapport */}
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-100/80 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 text-cyan-600">
                <Flame size={16} />
                <h4 className="text-xs font-black uppercase tracking-wider">Psicología del Rapport</h4>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                Establecer Rapport significa "afinar la frecuencia" con el dueño de taller. 
              </p>
              <ul className="space-y-3 text-xs font-semibold text-slate-650">
                <li className="flex gap-2">
                  <span className="text-cyan-500 font-extrabold shrink-0">✔</span>
                  <span><span className="font-extrabold text-slate-800">Honestidad brutal:</span> Presentar la propuesta de entrada baja la guardia. El cliente sabe que estás ahí para hacer negocios, no para fingir una amistad.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-500 font-extrabold shrink-0">✔</span>
                  <span><span className="font-extrabold text-slate-800">El silencio es oro:</span> Una vez que haces la pregunta de diagnóstico socrático, haz silencio absoluto. Deja que el cliente llene el vacío y exponga su dolor.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* Pestaña 2: Guión y Rebote Socrático */}
      {activeTab === 'diagnostic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-cyan-600">
              <HelpCircle size={18} />
              <h3 className="text-sm font-black uppercase tracking-wider">El Arte del Rebote Socrático (Manejo de Desviaciones)</h3>
            </div>
            <p className="text-xs text-slate-650 leading-relaxed font-semibold">
              Si le planteas las problemáticas típicas y el cliente las niega o te desvía el problema hacia otro factor, usa la técnica del <span className="font-extrabold text-slate-900">Rebote Socrático</span> para guiarlo de vuelta al origen del dolor.
            </p>

            <div className="space-y-4 pt-3 border-t border-slate-100">
              
              {/* Rebote 1 */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-black text-rose-500 uppercase block">Desviación 1: Culpar al Personal</span>
                <p className="text-xs font-bold text-slate-800">Cliente: "No, mi problema no es la bodega. Mi problema es que los maestros mecánicos son lentos y pasan desocupados."</p>
                <div className="text-xs text-cyan-700 font-semibold bg-cyan-50/60 p-3 rounded-lg border border-cyan-100 flex items-start gap-2">
                  <ArrowRight size={14} className="shrink-0 mt-0.5" />
                  <p>
                    <span className="font-extrabold">Rebote Socrático:</span> "Entiendo, maestro. ¿Y usted no cree que esa lentitud se deba a que no tienen un tablero visual claro de sus tareas y pasan tiempo esperando que les traigan los repuestos correctos de bodega?"
                  </p>
                </div>
              </div>

              {/* Rebote 2 */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-black text-rose-500 uppercase block">Desviación 2: Culpar a los Clientes</span>
                <p className="text-xs font-bold text-slate-800">Cliente: "No tengo fugas de dinero en stock. Lo que pasa es que los clientes de hoy son muy desconfiados y andan cotizando en todos lados."</p>
                <div className="text-xs text-cyan-700 font-semibold bg-cyan-50/60 p-3 rounded-lg border border-cyan-100 flex items-start gap-2">
                  <ArrowRight size={14} className="shrink-0 mt-0.5" />
                  <p>
                    <span className="font-extrabold">Rebote Socrático:</span> "Tiene toda la razón, hoy la gente desconfía mucho. ¿Pero no cree que esa desconfianza se produce porque les enviamos presupuestos solo por texto y no pueden ver la pieza rota con una foto o video en caliente?"
                  </p>
                </div>
              </div>

              {/* Rebote 3 */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-black text-rose-500 uppercase block">Desviación 3: Minimizar Daños Estéticos</span>
                <p className="text-xs font-bold text-slate-800">Cliente: "Aquí nos conocemos todos, a mí nadie me viene a reclamar rayones o golpes previos del vehículo."</p>
                <div className="text-xs text-cyan-700 font-semibold bg-cyan-50/60 p-3 rounded-lg border border-cyan-100 flex items-start gap-2">
                  <ArrowRight size={14} className="shrink-0 mt-0.5" />
                  <p>
                    <span className="font-extrabold">Rebote Socrático:</span> "Qué bueno que tenga clientes leales. ¿Pero no cree que basta con que ocurra un solo malentendido con un rayón para perder la confianza de años o tener que pagar de su bolsillo un arreglo de desabolladura?"
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-100/80 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-cyan-600">
                <Flame size={16} />
                <h4 className="text-xs font-black uppercase tracking-wider">El Traspaso al Cierre</h4>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                Una vez que el cliente acepta el factor raíz del problema, haz la transición:
              </p>
              <p className="text-xs text-slate-800 font-extrabold italic bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                "Ya que identificamos que el dolor real viene de ahí, ¿le parece si ingresamos los autos que atiende y el ticket en la calculadora de fugas? Así vemos cuánto le está costando esa fuga al mes y cómo Nexus Garage le puede mitigar o solucionar eso de inmediato."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña 3: Simulador de Fugas */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Inputs de la Calculadora */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-cyan-600">
              <Calculator size={18} />
              <h3 className="text-sm font-black uppercase tracking-wider">Simulador de Fugas Operacionales en Caliente</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Autos Reparados al Mes</label>
                <input 
                  type="number" 
                  value={autosMes} 
                  onChange={(e) => setAutosMes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Ticket Promedio por Auto ($ CLP)</label>
                <input 
                  type="number" 
                  value={ticketPromedio} 
                  onChange={(e) => setTicketPromedio(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Pérdida en repuestos no cobrados/mermas al mes ($ CLP)</label>
                <input 
                  type="number" 
                  value={fugaStockMes} 
                  onChange={(e) => setFugaStockMes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Costo de reclamos de garantías estéticas al mes ($ CLP)</label>
                <input 
                  type="number" 
                  value={costoReclamos} 
                  onChange={(e) => setCostoReclamos(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">¿Tiene sitio web o presencia digital activa?</label>
                <select 
                  value={tieneWeb}
                  onChange={(e) => setTieneWeb(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  <option value="si">Sí, sitio web activo</option>
                  <option value="no">No tiene web (Fuga por visibilidad)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Porcentaje estimado de presupuestos rechazados (%)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="5" 
                    max="80" 
                    value={tasaRechazo} 
                    onChange={(e) => setTasaRechazo(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-xs font-black text-slate-800 whitespace-nowrap">{tasaRechazo}% rechazados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Pérdida Financiera de Cierre */}
          <div className="glass-panel p-6 rounded-2xl bg-[#090e1f] border border-cyan-500/20 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-cyan-600/10 rounded-full mix-blend-screen filter blur-3xl"></div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-1.5 text-rose-500 font-extrabold text-[10px] bg-rose-500/10 px-2 py-0.5 rounded-full w-max border border-rose-500/25">
                <AlertTriangle size={10} />
                <span>Pérdidas Mensuales Mapeadas</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block font-semibold">Fuga de dinero mensual estimada:</span>
                <span className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">
                  ${perdidaTotalMensual.toLocaleString('es-CL')}
                </span>
                <span className="text-[10px] text-slate-500 block font-bold">o unos ${(perdidaTotalMensual * 12).toLocaleString('es-CL')} al año.</span>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-400">
                <div className="flex justify-between">
                  <span>Mermas de Pañol:</span>
                  <span className="text-slate-200 font-bold">${fugaStockMes.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rechazos por demoras:</span>
                  <span className="text-slate-200 font-bold">${perdidasRechazo.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invisibilidad Web (30%):</span>
                  <span className="text-slate-200 font-bold">${perdidaWeb.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daños estéticos asumidos:</span>
                  <span className="text-slate-200 font-bold">${costoReclamos.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>

            {/* Argumento de Cierre (ROI) */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 bg-slate-900/60 p-3.5 rounded-xl border border-cyan-500/10 space-y-2">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">Argumento ROI de Cierre Comercial</span>
              <p className="text-[11px] text-slate-350 leading-relaxed font-semibold">
                "Don, su taller está perdiendo <span className="text-rose-400 font-extrabold">${perdidaTotalMensual.toLocaleString('es-CL')}</span> al mes por estos factores. Nexus Garage cuesta solo <span className="text-cyan-400 font-extrabold">${costoLicenciaNexus.toLocaleString('es-CL')}</span> mensuales.
                Con que nuestro software le ayude a solucionar o mitigar solo una parte, <span className="text-emerald-400 font-extrabold">se pagará solo {retornoInversion} veces al mes</span>. Cerremos e integremos su taller hoy para frenar esto."
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Pestaña 4: Diagnóstico Premium Cobrado */}
      {activeTab === 'premium-diagnostic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Explicación del Servicio */}
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Sparkles size={18} className="text-yellow-500" />
                <h3 className="text-sm font-black uppercase tracking-wider">Upsell: Diagnóstico Organizativo Premium (Cobrado)</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                Si el cliente ve el desorden en la llamada socrática y exige un análisis profundo, le ofrecemos nuestro **Diagnóstico Organizativo Cobrado**. Este servicio de consultoría Lean de SmartLean Chile se asiste técnicamente de <span className="text-slate-900 font-extrabold">Nexus RPM</span> y abarca 4 pilares estructurales:
              </p>

              {/* Los 4 Pilares del Diagnóstico Premium */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs">
                    <Coins size={14} className="text-amber-500" />
                    <span>Pilar 1: Finanzas & RPM</span>
                  </div>
                  <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
                    Calculamos el punto de equilibrio real del taller, el costo de la hora fija de elevador y la venta diaria mínima necesaria para cubrir costos usando **Nexus RPM**.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs">
                    <Target size={14} className="text-cyan-500" />
                    <span>Pilar 2: Procesos & Garage</span>
                  </div>
                  <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
                    Identificamos cuellos de botella (técnicos en bahías y administrativos en recepción). Reducimos el desperdicio (Muda) de repuestos con **Nexus Garage**.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs">
                    <BookOpen size={14} className="text-indigo-500" />
                    <span>Pilar 3: Viaje del Cliente</span>
                  </div>
                  <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
                    Re-orientamos la atención al cliente al flujo digital de recepción con evidencia fotográfica por WhatsApp y fidelización predictiva post-servicio.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs">
                    <TrendingUp size={14} className="text-emerald-500" />
                    <span>Pilar 4: Posicionamiento</span>
                  </div>
                  <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
                    Subimos el ranking orgánico del taller en Google Maps y redes automatizando las solicitudes de encuestas y reseñas de 5 estrellas al cliente.
                  </p>
                </div>

              </div>
            </div>

            {/* Simulador Financiero RPM */}
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Calculator size={16} className="text-cyan-500" />
                <h4 className="text-xs font-black uppercase tracking-wider">Simulador Express del Diagnóstico Financiero (RPM)</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Gastos Fijos Taller ($/mes)</label>
                  <input 
                    type="number" 
                    value={costosFijosTaller} 
                    onChange={(e) => setCostosFijosTaller(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Mecánicos Operativos</label>
                  <input 
                    type="number" 
                    value={cantMecanicos} 
                    onChange={(e) => setCantMecanicos(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Sueldo Promedio Mecánico ($)</label>
                  <input 
                    type="number" 
                    value={sueldoMecanico} 
                    onChange={(e) => setSueldoMecanico(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resultados Financieros del Diagnóstico Cobrado */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl bg-[#0f172a] text-slate-250 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-1.5 text-yellow-500 font-extrabold text-[10px] bg-yellow-500/10 px-2 py-0.5 rounded-full w-max border border-yellow-500/25">
                <TrendingUp size={10} />
                <span>Resultados de Estructura RPM</span>
              </div>

              <div className="space-y-3 text-xs font-semibold text-slate-400">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Costo Operativo Fijo Mensual:</span>
                  <span className="text-lg font-black text-slate-100">${costoOperativoTotal.toLocaleString('es-CL')}</span>
                </div>
                
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Costo de Hora Fija por Elevador:</span>
                  <span className="text-lg font-black text-slate-100">${costoHoraFijaTaller.toLocaleString('es-CL')} / hr</span>
                  <span className="text-[9px] text-slate-500 block leading-none">(Lo mínimo a cobrar por mano de obra para no perder)</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Punto de Equilibrio (Venta Mensual):</span>
                  <span className="text-lg font-black text-slate-100">${ventaMensualEquilibrio.toLocaleString('es-CL')}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] text-emerald-500 block uppercase font-bold">Venta Diaria Mínima Requerida:</span>
                  <span className="text-xl font-black text-emerald-400">${ventaDiariaEquilibrio.toLocaleString('es-CL')}</span>
                  <span className="text-[9px] text-slate-500 block leading-none">(Para 22 días hábiles de taller al mes)</span>
                </div>
              </div>
            </div>

            {/* Estructura de Precios Recomendada */}
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4 mt-6">
              <div className="flex items-center gap-2 text-slate-800">
                <Coins size={16} className="text-amber-500" />
                <h4 className="text-xs font-black uppercase tracking-wider font-extrabold">Estrategia de Precios del Diagnóstico (Upsell)</h4>
              </div>
              <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">
                Ofrece esta consultoría en 3 niveles de valor. Si el cliente contrata el Plan Anual de Nexus Garage por adelantado, puedes regalarle el Diagnóstico Básico o el Integral como incentivo de cierre.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                {/* Plan 1 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Básico (Express)</span>
                    <span className="text-lg font-black text-slate-800 block">$90.000 CLP</span>
                    <span className="text-[9px] text-slate-400 font-bold block">Pago único</span>
                    <ul className="text-[10px] text-slate-600 font-semibold space-y-1 mt-2.5">
                      <li>• Auditoría financiera RPM</li>
                      <li>• Cálculo Punto de Equilibrio</li>
                      <li>• Diagnóstico en 1 elevador</li>
                      <li>• Informe digital PDF</li>
                    </ul>
                  </div>
                </div>

                {/* Plan 2 */}
                <div className="p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20 flex flex-col justify-between space-y-3 relative overflow-hidden">
                  <span className="absolute top-0 right-0 bg-cyan-500 text-white font-black text-[8px] uppercase px-1.5 py-0.5 rounded-bl-lg">Popular</span>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-cyan-600 uppercase tracking-wider block">Integral Lean</span>
                    <span className="text-lg font-black text-slate-800 block">$180.000 CLP</span>
                    <span className="text-[9px] text-slate-400 font-bold block">Pago único</span>
                    <ul className="text-[10px] text-slate-600 font-semibold space-y-1 mt-2.5">
                      <li>• Todo el Plan Básico</li>
                      <li>• Mapeo Gemba Walk en taller</li>
                      <li>• Detección de mermas de bodega</li>
                      <li>• Ajuste de viaje del cliente</li>
                    </ul>
                  </div>
                </div>

                {/* Plan 3 */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider block">Llave en Mano (Pro)</span>
                    <span className="text-lg font-black text-white block">$350.000 CLP</span>
                    <span className="text-[9px] text-slate-400 font-bold block">Pago único</span>
                    <ul className="text-[10px] text-slate-350 font-semibold space-y-1 mt-2.5">
                      <li>• Todo el Plan Integral</li>
                      <li>• Carga inicial de inventario</li>
                      <li>• Capacitación uno a uno maestros</li>
                      <li>• Acompañamiento en terreno</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}

      {/* Pestaña 5: Matriz de Soluciones */}
      {activeTab === 'matrix' && (
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-cyan-600">
            <Target size={18} />
            <h3 className="text-sm font-black uppercase tracking-wider">Matriz de Soluciones: Dolor del Taller vs Nexus Garage</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-black text-slate-450 uppercase tracking-wider">
                  <th className="p-3">Dolor Operativo Detectado</th>
                  <th className="p-3">Impacto Comercial real</th>
                  <th className="p-3">Solución de Proceso (Nexus)</th>
                  <th className="p-3">Herramienta en el SaaS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                {TROUBLESHOOTING_MATRIX.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-extrabold text-slate-800">{m.problem}</td>
                    <td className="p-3 text-rose-600/90">{m.impact}</td>
                    <td className="p-3 text-slate-600 leading-normal">{m.solution}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-black whitespace-nowrap">
                        {m.feature}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pestaña 6: Calificación de Aptitud & Estrategia de Descarte (Sara Alonso) */}
      {activeTab === 'aptitude-disqualification' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Introducción a la Metodología */}
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Target size={18} className="text-amber-500 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-wider">Estrategia de Calificación por Descarte B2B</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                Siguiendo el enfoque de la consultoría de ventas de alto valor (como Sara Alonso), un buen auditor no ruega por la venta. Al contrario, <strong>evalúa si el cliente es apto</strong> para usar la solución. Si el cliente no tiene el compromiso de cambiar o es extremadamente desordenado, es mejor descalificarlo. Esto no solo te evita un cliente problemático (alto churn), sino que genera un efecto de <strong>psicología inversa</strong> en el dueño, quien querrá "calificar" para comprar tu solución.
              </p>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <span className="text-[11px] font-black text-slate-700 uppercase block tracking-wider">Los 3 Criterios de Aptitud Operativa:</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-800 block">1. Compromiso con el Orden</span>
                    <p className="text-[10px] text-slate-550 leading-normal">
                      ¿El dueño está dispuesto a dedicar 3 minutos diarios para registrar el pañol y auditar el stock o prefiere seguir improvisando?
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-800 block">2. Digitalización Mental</span>
                    <p className="text-[10px] text-slate-550 leading-normal">
                      ¿Está dispuesto a dejar el papel y abrir un smartphone o computador para revisar sus KPIs o se resiste al uso mínimo de tecnología?
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-800 block">3. Liderazgo de Implementación</span>
                    <p className="text-[10px] text-slate-550 leading-normal">
                      ¿Tiene el carácter para guiar y exigirle a sus mecánicos que usen la app del pañol, o le tiene miedo a los reclamos del equipo?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pauta y Guiones Socráticos de Descarte */}
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100/80 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs">
                <BookOpen size={16} className="text-cyan-500 font-extrabold" />
                <span className="uppercase tracking-wider">Guiones y Pautas de Calificación por Descarte</span>
              </div>

              <div className="space-y-4">
                
                {/* Guión 1 */}
                <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 space-y-2 relative">
                  <span className="text-[10px] font-black text-amber-800 uppercase block">Paso 1: La Advertencia Socrática (Descalificación Inicial)</span>
                  <p className="text-xs text-slate-700 italic font-semibold leading-relaxed">
                    "Mire don Marcelo, nuestro software Nexus Garage es excelente y frena el 100% de las pérdidas en repuestos, pero requiere un cambio: sus maestros deben marcar la entrada y salida de bodega en la Tablet. Si usted no está dispuesto a exigir este orden mínimo, no nos contrate. Esto no es para todos los talleres. ¿Usted cree que está listo para comprometerse a este cambio operativo, o prefiere seguir con sus fugas actuales?"
                  </p>
                  <button
                    onClick={() => handleCopy("Mire don Marcelo, nuestro software Nexus Garage es excelente y frena el 100% de las pérdidas en repuestos, pero requiere un cambio: sus maestros deben marcar la entrada y salida de bodega en la Tablet. Si usted no está dispuesto a exigir este orden mínimo, no nos contrate. Esto no es para todos los talleres. ¿Usted cree que está listo para comprometerse a este cambio operativo, o prefiere seguir con sus fugas actuales?", 100)}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-750 rounded-lg text-[9px] font-black border border-slate-200 cursor-pointer shadow-sm"
                  >
                    {copiedIndex === 100 ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>

                {/* Guión 2 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2 relative">
                  <span className="text-[10px] font-black text-slate-700 uppercase block">Paso 2: La Prueba de Aptitud en la Demo</span>
                  <p className="text-xs text-slate-700 italic font-semibold leading-relaxed">
                    "Generalmente no le vendemos el software a talleres donde los mecánicos manejan el negocio en lugar del dueño. Le pregunto derechamente: si su maestro más antiguo le dice que no quiere usar la app porque prefiere el cuaderno, ¿usted lo va a obligar a ordenarse, o va a dejar que la bodega siga con mermas de $200.000?"
                  </p>
                  <button
                    onClick={() => handleCopy("Generalmente no le vendemos el software a talleres donde los mecánicos manejan el negocio en lugar del dueño. Le pregunto derechamente: si su maestro más antiguo le dice que no quiere usar la app porque prefiere el cuaderno, ¿usted lo va a obligar a ordenarse, o va a dejar que la bodega siga con mermas de $200.000?", 101)}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-755 rounded-lg text-[9px] font-black border border-slate-200 cursor-pointer shadow-sm"
                  >
                    {copiedIndex === 101 ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>

                {/* Guión 3 */}
                <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/10 space-y-2 relative">
                  <span className="text-[10px] font-black text-rose-800 uppercase block">Paso 3: El Cierre de Descarte Final (FOMO)</span>
                  <p className="text-xs text-slate-700 italic font-semibold leading-relaxed">
                    "Prefiero serle honesto: si el taller no está listo para digitalizar la recepción, no me sirve que nos pague la mensualidad si a los dos meses va a abandonar el software por falta de uso. Prefiero que sigamos como amigos y nos avise cuando esté listo para liderar este cambio en su taller. ¿Qué opina, lo hacemos en serio ahora, o lo dejamos para el próximo año?"
                  </p>
                  <button
                    onClick={() => handleCopy("Prefiero serle honesto: si el taller no está listo para digitalizar la recepción, no me sirve que nos pague la mensualidad si a los dos meses va a abandonar el software por falta de uso. Prefiero que sigamos como amigos y nos avise cuando esté listo para liderar este cambio en su taller. ¿Qué opina, lo hacemos en serio ahora, o lo dejamos para el próximo año?", 102)}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-755 rounded-lg text-[9px] font-black border border-slate-200 cursor-pointer shadow-sm"
                  >
                    {copiedIndex === 102 ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Tarjeta de Resumen Psicológico de Descarte */}
          <div className="glass-panel p-6 rounded-2xl bg-[#090e1f] border border-amber-500/20 text-white flex flex-col justify-between shadow-xl relative overflow-hidden h-fit">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-600/10 rounded-full mix-blend-screen filter blur-3xl"></div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-full w-max border border-amber-500/25">
                <Target size={10} />
                <span>La Psicología del No es para Todos</span>
              </div>
              
              <div className="space-y-4 text-xs font-semibold text-slate-400">
                <div className="space-y-1">
                  <span className="text-slate-200 block font-bold text-[11px] uppercase tracking-wider text-amber-400">El Efecto Magneto:</span>
                  <p className="text-[11px] text-slate-350 leading-relaxed font-medium">
                    Cuando le dices a un cliente que quizás no califica para tu servicio, su ego B2B se activa. En lugar de justificar por qué es muy caro, empieza a justificar por qué <strong>su taller sí está ordenado y sí es apto</strong> para comprarte.
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-slate-800">
                  <span className="text-slate-200 block font-bold text-[11px] uppercase tracking-wider text-cyan-400">Filtrado Anti-Churn:</span>
                  <p className="text-[11px] text-slate-350 leading-relaxed font-medium">
                    Un cliente de baja aptitud que no quiere usar el sistema consumirá el 80% de tus horas de soporte, se quejará de todo y abandonará el software en 60 días. La venta por descarte protege tu tiempo y el ROI del equipo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
