import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  HelpCircle, 
  BookOpen, 
  Play, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  User, 
  Phone, 
  MapPin, 
  Save, 
  ArrowRight, 
  ArrowLeft,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { dbService } from '../../services/dbService';

export default function SalesGuide({ onLeadCreated }) {
  // Estados de navegación
  const [currentStep, setCurrentStep] = useState(1); // Steps: 1 (Apertura), 2 (Diagnóstico), 3 (Demo de Impacto), 4 (Aptitud), 5 (Simulador & Registro)
  
  // Estado de las respuestas y rutas seleccionadas
  const [aperturaRuta, setAperturaRuta] = useState(null); // 'acepta', 'tiempo', 'quien'
  const [dolorSeleccionado, setDolorSeleccionado] = useState(null); // 'bodega', 'rechazo', 'maps', 'ninguno'
  const [aptitudeSeleccionada, setAptitudeSeleccionada] = useState(null); // 'comprometido', 'resistente'

  // Estados para la Demo en Vivo de 3 minutos (Fase 3)
  const [demoPatente, setDemoPatente] = useState('');
  const [demoCelular, setDemoCelular] = useState('');
  const [demoCargando, setDemoCargando] = useState(false);
  const [demoVehiculo, setDemoVehiculo] = useState(null);
  const [demoEnviadoCotizacion, setDemoEnviadoCotizacion] = useState(false);
  const [demoEnviadoListo, setDemoEnviadoListo] = useState(false);

  // Variables del formulario para registrar nuevo Lead
  const [tallerName, setTallerName] = useState('');
  const [tallerPhone, setTallerPhone] = useState('');
  const [tallerCommune, setTallerCommune] = useState('Santiago (Centro)');
  const [tallerAddress, setTallerAddress] = useState('');
  const [tallerNotes, setTallerNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Estados del mini-simulador de fugas integrado (alineados con Playbook)
  const [autosMes, setAutosMes] = useState(60);
  const [ticketPromedio, setTicketPromedio] = useState(120000);
  const [tieneWeb, setTieneWeb] = useState('no');
  const [fugaBodega, setFugaBodega] = useState(180000);
  const [tasaRechazo, setTasaRechazo] = useState(40);
  const [costoReclamos, setCostoReclamos] = useState(120000);
  const costoLicenciaNexus = 45000;

  // Estados de los sliders de aptitud (Sara Alonso)
  const [commitment, setCommitment] = useState(3);
  const [digital, setDigital] = useState(3);
  const [leadership, setLeadership] = useState(3);

  // Cálculos rápidos de fuga (fórmulas idénticas al Playbook)
  const consultasTotales = autosMes / (1 - tasaRechazo / 100);
  const perdidaRechazo = Math.round((consultasTotales - autosMes) * 0.3 * ticketPromedio);
  const perdidaWeb = tieneWeb === 'no' ? Math.round(consultasTotales * 0.3 * ticketPromedio) : 0;
  const perdidaTotal = fugaBodega + perdidaRechazo + perdidaWeb + costoReclamos;
  const retornoInversion = Math.round(perdidaTotal / costoLicenciaNexus);

  // Handler para guardar Lead directamente en Supabase/LocalStorage
  const handleRegisterLead = async (e) => {
    e.preventDefault();
    if (!tallerName.trim()) {
      alert("Por favor, ingresa el nombre del taller.");
      return;
    }

    setIsSaving(true);
    try {
      // Asignar stage según fase alcanzada en el wizard
      const stageByPhase = currentStep >= 4 ? 'demo' : currentStep >= 3 ? 'contacto' : 'lead';

      const newLead = {
        name: tallerName,
        phone: tallerPhone,
        commune: tallerCommune,
        address: tallerAddress,
        stage: stageByPhase,
        priority: 'Media',
        value: Number(perdidaTotal) > 0 ? Math.round(perdidaTotal * 0.1) : 45000, // 10% de la fuga como valor potencial o min $45.000
        pain: dolorSeleccionado === 'bodega' ? 'Descontrol en bodega y repuestos perdidos' :
              dolorSeleccionado === 'rechazo' ? 'Alta tasa de rechazo en cotizaciones enviadas' :
              dolorSeleccionado === 'maps' ? 'Falta de presencia en Google Maps y sin web' :
              'Desorden generalizado en el taller',
        pitch: `Hola, le escribo porque estuvimos conversando sobre las pérdidas de bodega en ${tallerName}...`,
        openWeekends: false,
        aptitudeCommitment: commitment,
        aptitudeDigital: digital,
        aptitudeLeadership: leadership,
        notes: `Registrado desde el Asistente de Ventas.\nDolor detectado: ${dolorSeleccionado || 'Desconocido'}.\nFuga mensual estimada: $${perdidaTotal.toLocaleString('es-CL')} CLP.\nNotas adicionales: ${tallerNotes}`
      };

      const saved = await dbService.saveLead(newLead);
      
      // Registrar interacción inicial
      await dbService.saveActivity({
        lead_id: saved.id,
        type: 'llamada',
        description: 'Llamada inicial de prospección y diagnóstico de aptitud comercial.'
      });

      alert(`🎉 Lead "${tallerName}" registrado con éxito en la primera columna del Kanban.`);
      
      // Limpiar formulario y resetear simulador
      setTallerName('');
      setTallerPhone('');
      setTallerAddress('');
      setTallerNotes('');
      setCurrentStep(1);
      setAperturaRuta(null);
      setDolorSeleccionado(null);
      setAptitudeSeleccionada(null);

      if (onLeadCreated) {
        onLeadCreated(saved);
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar el prospecto.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Cabecera del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">En Vivo</span>
            <h2 className="text-lg font-black tracking-tight flex items-center gap-1.5">
              <Sparkles size={18} className="text-cyan-400" />
              Asistente de Llamadas & Guía de Ventas
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Guión interactivo en caliente con rutas de objeciones, psicología de descarte de Sara Alonso y simulación de fugas.
          </p>
        </div>
      </div>

      {/* Indicador de Fases del Pipeline de Ventas */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 right-0 h-1 bg-slate-100 top-1/2 -translate-y-1/2 z-0"></div>
          
          <button 
            onClick={() => setCurrentStep(1)}
            className={`relative z-10 flex flex-col items-center gap-1 cursor-pointer transition-all ${currentStep === 1 ? 'scale-105' : 'opacity-80'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
              currentStep === 1 ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25' :
              currentStep > 1 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-500'
            }`}>
              1
            </div>
            <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">Apertura</span>
          </button>

          <button 
            onClick={() => currentStep >= 2 && setCurrentStep(2)}
            disabled={currentStep < 2}
            className={`relative z-10 flex flex-col items-center gap-1 transition-all ${currentStep === 2 ? 'scale-105' : 'opacity-80 disabled:opacity-40'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
              currentStep === 2 ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25' :
              currentStep > 2 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-500'
            }`}>
              2
            </div>
            <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">Diagnóstico</span>
          </button>

          <button 
            onClick={() => currentStep >= 3 && setCurrentStep(3)}
            disabled={currentStep < 3}
            className={`relative z-10 flex flex-col items-center gap-1 transition-all ${currentStep === 3 ? 'scale-105' : 'opacity-80 disabled:opacity-40'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
              currentStep === 3 ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25' :
              currentStep > 3 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-500'
            }`}>
              3
            </div>
            <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">Demo (3 min)</span>
          </button>

          <button 
            onClick={() => currentStep >= 4 && setCurrentStep(4)}
            disabled={currentStep < 4}
            className={`relative z-10 flex flex-col items-center gap-1 transition-all ${currentStep === 4 ? 'scale-105' : 'opacity-80 disabled:opacity-40'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
              currentStep === 4 ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25' :
              currentStep > 4 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-500'
            }`}>
              4
            </div>
            <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">Aptitud (Descarte)</span>
          </button>

          <button 
            onClick={() => currentStep >= 5 && setCurrentStep(5)}
            disabled={currentStep < 5}
            className={`relative z-10 flex flex-col items-center gap-1 transition-all ${currentStep === 5 ? 'scale-105' : 'opacity-80 disabled:opacity-40'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
              currentStep === 5 ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25' :
              'bg-white border-slate-300 text-slate-500'
            }`}>
              5
            </div>
            <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">Fugas & Cierre</span>
          </button>
        </div>
      </div>

      {/* Flujo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda y Centro: El Guión y Opciones */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* FASE 1: APERTURA COMERCIAL TRANSPARENTE */}
          {currentStep === 1 && (
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-600">
                  <Play size={18} className="text-cyan-500 animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-wider">Fase 1: La Apertura Transparente</h3>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-100">
                  Establecer postura comercial sincera
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">🗣️ Qué decir por teléfono:</span>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold italic">
                  "Hola don [Nombre del dueño], ¿cómo está? Le hablo de SmartLean Chile. Le comento: le llamo porque venimos a hacerle una propuesta comercial para su taller enfocada en tapar pérdidas típicas de stock y ordenar la bodega para que deje de botar dinero. ¿Le molesta si le hablo de esto en 1 minuto?"
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-extrabold text-slate-700 block">¿Cómo reacciona el cliente? Selecciona una ruta:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => setAperturaRuta('acepta')}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      aperturaRuta === 'acepta' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-md' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs mb-1">
                      <CheckCircle size={14} className={aperturaRuta === 'acepta' ? 'text-emerald-600' : 'text-slate-400'} />
                      <span>Acepta hablar</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">"Sí, dígame no más de qué se trata."</p>
                  </button>

                  <button 
                    onClick={() => setAperturaRuta('tiempo')}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      aperturaRuta === 'tiempo' 
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-md' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs mb-1">
                      <AlertTriangle size={14} className={aperturaRuta === 'tiempo' ? 'text-amber-600' : 'text-slate-400'} />
                      <span>"No tengo tiempo"</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">"Estoy en medio de un motor / Ocupado."</p>
                  </button>

                  <button 
                    onClick={() => setAperturaRuta('quien')}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      aperturaRuta === 'quien' 
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold shadow-md' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs mb-1">
                      <HelpCircle size={14} className={aperturaRuta === 'quien' ? 'text-cyan-600' : 'text-slate-400'} />
                      <span>¿De qué se trata?</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">"¿Quién eres y qué me vas a ofrecer?"</p>
                  </button>
                </div>
              </div>

              {/* Soluciones a las Rutas en caliente */}
              {aperturaRuta && (
                <div className="p-4 rounded-xl border animate-fadeIn space-y-3 bg-slate-50 border-slate-200">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">🛠️ Qué responder de inmediato (Ruta Seleccionada):</span>
                  
                  {aperturaRuta === 'acepta' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                        "¡Excelente! Don Marcelo. Mire, lo que hacemos es instalar nuestro sistema **Nexus Garage** para tapar las típicas mermas del taller. ¿Le ha pasado que un mecánico saca una ampolleta o un filtro de bodega y a fin de mes se da cuenta de que nunca se le cobró al cliente? ¿O que se le pierden repuestos en stock?"
                      </p>
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Continuar al Diagnóstico <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                  {aperturaRuta === 'tiempo' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                        "Entiendo perfectamente don [Nombre], sé que en el taller no hay un segundo libre. No le quitaré tiempo. ¿Le acomoda que le envíe un mensaje breve por WhatsApp con una simulación de fugas de bodega para que lo vea en 1 minuto cuando tenga un espacio, o le acomoda más que le llame hoy a las 18:00 hrs?"
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setDolorSeleccionado('bodega'); setCurrentStep(4); }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Ir al Simulador de Fugas WhatsApp
                        </button>
                        <button 
                          onClick={() => setCurrentStep(2)}
                          className="px-3 py-1.5 bg-white border border-slate-350 hover:bg-slate-55 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          "Me da el minuto" &rarr; Ir a Diagnóstico
                        </button>
                      </div>
                    </div>
                  )}

                  {aperturaRuta === 'quien' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                        "Mire don [Nombre], somos SmartLean Chile. Ayudamos a los talleres a evitar que los mecánicos pierdan tiempo buscando herramientas o repuestos en bodega, y automatizamos el envío de presupuestos digitales para que cierren el doble de cotizaciones. Venimos a proponerle un piloto de 7 días sin costo para su taller. ¿Cómo le suena?"
                      </p>
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Avanzar a Diagnóstico <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FASE 2: DIAGNÓSTICO DE DOLOR & REBOTES SOCRÁTICOS */}
          {currentStep === 2 && (
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-600">
                  <HelpCircle size={18} className="text-cyan-500 animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-wider">Fase 2: Diagnóstico de Fugas y Dolores</h3>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-100">
                  El cliente debe aceptar su problema
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">🗣️ Qué decir (El Planteamiento):</span>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold italic">
                  "Nosotros en talleres vemos 4 problemáticas típicas: pérdida de stock en bodega, baja productividad de mecánicos que pasan horas parados, presupuestos rechazados porque se envían por simple texto en WhatsApp, o falta de clientes por no tener página web o un buen posicionamiento en Maps. **Y en su caso, ¿usted cree que las pérdidas o el desorden de su negocio vienen de ahí?**"
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-extrabold text-slate-700 block">¿Qué dolor acepta el dueño? Selecciona una ruta:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={() => setDolorSeleccionado('bodega')}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      dolorSeleccionado === 'bodega' 
                        ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-md' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-655'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 block mb-1">📦 Pérdidas en Bodega / Repuestos</span>
                    <p className="text-[10px] text-slate-500 leading-tight">"Sí, la verdad es que se me pierden herramientas y repuestos."</p>
                  </button>

                  <button 
                    onClick={() => setDolorSeleccionado('rechazo')}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      dolorSeleccionado === 'rechazo' 
                        ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-md' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-655'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 block mb-1">📉 Rechazo de Presupuestos (WhatsApp)</span>
                    <p className="text-[10px] text-slate-500 leading-tight">"Envío presupuestos pero la gente cotiza en otro lado o duda."</p>
                  </button>

                  <button 
                    onClick={() => setDolorSeleccionado('maps')}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      dolorSeleccionado === 'maps' 
                        ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-md' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-655'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 block mb-1">🌐 Falta de Clientes / Sin Presencia Web</span>
                    <p className="text-[10px] text-slate-550 leading-tight">"Casi no me llega gente nueva de internet, dependo del boca a boca."</p>
                  </button>

                  <button 
                    onClick={() => setDolorSeleccionado('ninguno')}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      dolorSeleccionado === 'ninguno' 
                        ? 'bg-amber-50 border-amber-400 text-amber-955 font-bold shadow-md' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-655'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 block mb-1">🙅‍♂️ Dice que no tiene pérdidas ("Todo ordenado")</span>
                    <p className="text-[10px] text-slate-500 leading-tight">"Aquí no se pierde nada, yo controlo todo en mi cuaderno."</p>
                  </button>
                </div>
              </div>

              {dolorSeleccionado && (
                <div className="p-4 rounded-xl border animate-fadeIn space-y-3 bg-slate-50 border-slate-200">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">🛠️ Qué responder (El Rebote Socrático):</span>
                  
                  {dolorSeleccionado === 'bodega' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        "Entiendo don Marcelo. La pérdida de bodega es la fuga más silenciosa de un taller. Con **Nexus Garage** usted tiene un pañolero digital en una tablet donde cada mecánico debe marcar lo que saca. Si no lo asocia a una Orden de Trabajo, el sistema alerta de inmediato. Así detiene la fuga. ¿Le suena lógico?"
                      </p>
                    </div>
                  )}

                  {dolorSeleccionado === 'rechazo' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        "Claro, enviar un mensaje plano por WhatsApp genera desconfianza. En **Nexus Garage** creamos un link interactivo profesional de presupuesto con fotos del daño (ej. amortiguador reventado), desglose de precios y un botón digital de aprobación. El cliente aprueba con un toque desde su celular. La tasa de aceptación sube un 40%. ¿Cómo le ayudaría eso?"
                      </p>
                    </div>
                  )}

                  {dolorSeleccionado === 'maps' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        "Claro, hoy en día el que busca taller busca en Google Maps. Si no tiene web o tiene pocas estrellitas, el cliente se va con el vecino. Nosotros en SmartLean le creamos su presencia web y automatizamos que cada cliente contento califique con 5 estrellas mediante un link interactivo al terminar la OT. El posicionamiento sube de inmediato. ¿Cuántos clientes más cree que le llegarían al mes?"
                      </p>
                    </div>
                  )}

                  {dolorSeleccionado === 'ninguno' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-705 leading-relaxed font-semibold italic text-amber-800">
                        "¡Lo felicito don Marcelo! Es muy poco común ver un taller tan controlado. Le hago una pregunta sincera: si hiciéramos una auditoría sorpresa en su pañol ahora mismo, ¿de verdad no encontraríamos ni un filtro de aceite, ni una ampolleta perdida o repuestos que se compraron para un auto y quedaron ahí acumulando polvo? ¿O a veces un mecánico saca un repuesto y se le olvida anotarlo en el cuaderno?"
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold bg-amber-500/5 p-2 rounded border border-amber-500/10">
                        💡 Nota del consultor: El 99% de los dueños admite que "bueno, sí, a veces pasa". En ese instante se abre la puerta de la venta.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="px-3 py-1.5 bg-white border border-slate-350 hover:bg-slate-55 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft size={12} /> Atrás
                    </button>
                    <button 
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      Siguiente: Demo en Vivo <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FASE 3: DEMO DE IMPACTO (EL GANCHO DE LOS 3 MINUTOS) */}
          {currentStep === 3 && (
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-600">
                  <Play size={18} className="text-cyan-500 animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-wider">Fase 3: La Carta Ganadora (Demo en vivo en 3 Minutos)</h3>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  Carta Ganadora de Cierre
                </span>
              </div>

              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                **La Estrategia**: En lugar de explicar el software, haz que el cliente experimente la magia en su propio celular. Regístrale su auto personal usando su patente y envíale las notificaciones de prueba.
              </p>

              <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl space-y-2">
                <span className="text-[10px] font-black text-cyan-800 uppercase tracking-wider block">🗣️ Guión sugerido para iniciar la Demo:</span>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold italic">
                  "Don [Nombre], hagamos una prueba real en vivo en su propio celular ahora mismo. Dígame la patente de su auto personal para agendarlo y crearle una orden en el sistema. Así verá exactamente lo que sentirá su cliente en su teléfono."
                </p>
              </div>

              {/* Simulador Interactivo de Consulta de Patente */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <span className="text-[10px] font-black text-slate-500 tracking-wider block">Simulador de Ingreso en Taller (Obtención de Datos en 3s)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Patente del Dueño (Ej: ABCD12 o AB-CD-12)</label>
                    <input 
                      type="text" 
                      value={demoPatente}
                      onChange={(e) => setDemoPatente(e.target.value.toUpperCase())}
                      placeholder="Ingrese patente..." 
                      className="w-full bg-white border rounded-lg p-2 font-bold uppercase placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">N° Celular del Dueño (WhatsApp)</label>
                    <input 
                      type="tel" 
                      value={demoCelular}
                      onChange={(e) => setDemoCelular(e.target.value)}
                      placeholder="Ej: 56912345678" 
                      className="w-full bg-white border rounded-lg p-2 font-bold placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!demoPatente.trim()) {
                        alert("Por favor, ingresa una patente para la simulación.");
                        return;
                      }
                      setDemoCargando(true);
                      setDemoVehiculo(null);
                      
                      // Simular obtención de datos en 2 segundos
                      setTimeout(() => {
                        setDemoCargando(false);
                        const marcas = ['Toyota Hilux', 'Hyundai Santa Fe', 'Chevrolet Sail', 'Suzuki Swift', 'Nissan Qashqai', 'Mitsubishi L200'];
                        const anios = ['2018', '2019', '2020', '2021', '2022', '2023'];
                        const marcaModelo = marcas[Math.abs(demoPatente.charCodeAt(0) || 0) % marcas.length];
                        const anio = anios[Math.abs(demoPatente.charCodeAt(1) || 0) % anios.length];
                        const vin = `93HGD${Math.floor(100000 + Math.random() * 900000)}HJA9105432`;
                        
                        setDemoVehiculo({
                          marca: marcaModelo,
                          anio: anio,
                          vin: vin
                        });
                        
                        // Autocompletar variables del lead
                        if (!tallerNotes) {
                          setTallerNotes(`Auto del dueño registrado en Demo: ${marcaModelo} (${anio}), patente ${demoPatente}.`);
                        }
                      }, 2000);
                    }}
                    disabled={demoCargando}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {demoCargando ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Consultando Patente (3 segundos)...
                      </>
                    ) : (
                      <>
                        <span>⚡ Obtener datos del vehículo</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Resultados de la Consulta */}
                {demoVehiculo && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-[10px]">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <span>VEHÍCULO IDENTIFICADO EN MENOS DE 3 SEGUNDOS</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Vehículo</span>
                        <span>{demoVehiculo.marca}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Año</span>
                        <span>{demoVehiculo.anio}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">N° VIN / Chasis</span>
                        <span className="font-mono">{demoVehiculo.vin.substring(0, 10)}...</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-700 block">Enviar pruebas al celular del dueño por WhatsApp:</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Botón 1: Enviar Cotización */}
                        <a
                          href={`https://api.whatsapp.com/send?phone=${demoCelular.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                            `Hola don Marcelo, aquí tiene la cotización interactiva para su ${demoVehiculo.marca} de mantenimiento en Nexus Garage. Puede revisarla y aprobar los trabajos aquí: https://demo.smartlean.cl/cotizacion/12345`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDemoEnviadoCotizacion(true)}
                          className={`py-2 px-3 rounded-lg text-[10px] font-black text-center flex items-center justify-center gap-1.5 transition-colors ${
                            demoEnviadoCotizacion 
                              ? 'bg-emerald-100 text-emerald-805 border border-emerald-200' 
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          💬 1. Enviar Cotización Interactiva
                        </a>

                        {/* Botón 2: Enviar Vehículo Listo */}
                        <a
                          href={`https://api.whatsapp.com/send?phone=${demoCelular.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                            `Hola don Marcelo, le notificamos que su ${demoVehiculo.marca} patente ${demoPatente} está listo para ser retirado en nuestro taller. Puede ver el detalle de los repuestos cambiados y su garantía aquí: https://demo.smartlean.cl/entrega/12345`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDemoEnviadoListo(true)}
                          className={`py-2 px-3 rounded-lg text-[10px] font-black text-center flex items-center justify-center gap-1.5 transition-colors ${
                            demoEnviadoListo 
                              ? 'bg-emerald-100 text-emerald-805 border border-emerald-200' 
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          🚗 2. Enviar "Auto Listo"
                        </a>
                      </div>
                      <p className="text-[9px] text-slate-500 font-medium italic">
                        * Nota: Al presionar se abrirá WhatsApp con el mensaje pre-cargado para enviar al dueño del taller.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de navegación de la Fase 3 */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="px-3 py-1.5 bg-white border border-slate-350 hover:bg-slate-55 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft size={12} /> Atrás
                </button>
                <button 
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  Siguiente: Calificar Aptitud <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* FASE 4: CALIFICACIÓN DE APTITUD (SARA ALONSO) */}
          {currentStep === 4 && (
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-600">
                  <Target size={18} className="text-amber-500 animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-wider">Fase 3: Calificación de Aptitud (Estrategia Sara Alonso)</h3>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                  Evaluar si el cliente es apto
                </span>
              </div>

              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                **Importante**: No le ruegues. Pon a prueba su compromiso operativo. Si el cliente no está dispuesto a ordenarse, adviértele que Nexus no le servirá. Esto aumentará su deseo de pertenecer y comprar.
              </p>

              <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 space-y-2">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">🗣️ Postura de Descarte (Psicología Inversa):</span>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold italic">
                  "Mire don [Nombre], nuestra solución es excelente para frenar fugas de stock, pero requiere que su equipo dedique 3 minutos diarios a registrar en la tablet. Si usted no está dispuesto a exigir este orden mínimo a sus maestros, nuestro sistema no le servirá. Esto no es para todos. ¿Se compromete a guiar a su equipo, o prefiere seguir con sus fugas actuales?"
                </p>
              </div>

              <div className="space-y-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-extrabold text-slate-700 block">¿Cómo reacciona el cliente ante el descarte?</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={() => { setAptitudeSeleccionada('comprometido'); setCommitment(5); setLeadership(4); }}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      aptitudeSeleccionada === 'comprometido' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-md' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-655'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 block mb-1">👍 Acepta el Desafío (Comprometido)</span>
                    <p className="text-[10px] text-slate-500 leading-tight">"Yo soy el jefe acá. Si yo les digo que usen la tablet, la usan."</p>
                  </button>

                  <button 
                    onClick={() => { setAptitudeSeleccionada('resistente'); setCommitment(2); setLeadership(2); }}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      aptitudeSeleccionada === 'resistente' 
                        ? 'bg-rose-50 border-rose-400 text-rose-955 font-bold shadow-md' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-655'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 block mb-1">👎 Se resiste / Pone excusas</span>
                    <p className="text-[10px] text-slate-550 leading-tight">"Es muy difícil obligar a mis maestros, no tienen tiempo de usar computadores."</p>
                  </button>
                </div>
              </div>

              {aptitudeSeleccionada && (
                <div className="p-4 rounded-xl border animate-fadeIn space-y-3 bg-slate-50 border-slate-200">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">🛠️ Qué responder (El siguiente paso):</span>
                  
                  {aptitudeSeleccionada === 'comprometido' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        "¡Excelente don Marcelo! Eso es el liderazgo que necesita un taller digital. Como veo que su taller califica, le propongo que pasemos a simular en vivo cuánto dinero está perdiendo hoy en su bodega para ver si el ROI de Nexus le hace sentido de inmediato."
                      </p>
                    </div>
                  )}

                  {aptitudeSeleccionada === 'resistente' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        "Entiendo. Le propongo algo: si cree que no tiene la fuerza para ordenar a su equipo, mejor no compre el software todavía. Le ofrezco que hagamos nuestro **Diagnóstico Lean Express**. Yo mismo vendré al taller a evaluar el flujo y le mostraré cómo convencer a sus maestros. Esto cuesta $90.000 y al final sabrá con certeza si está listo para digitalizar o si es mejor seguir en el cuaderno."
                      </p>
                    </div>
                  )}

                  {/* Calificadores Interactivos Rápidos de Aptitud */}
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase block">Calificación de Aptitud en Vivo:</span>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-1">Orden (1-5)</label>
                        <select 
                          value={commitment} 
                          onChange={(e) => setCommitment(Number(e.target.value))}
                          className="w-full text-xs bg-white border rounded p-1 font-bold"
                        >
                          {[1,2,3,4,5].map(v => <option key={v} value={v}>{v} ★</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-1">Digital (1-5)</label>
                        <select 
                          value={digital} 
                          onChange={(e) => setDigital(Number(e.target.value))}
                          className="w-full text-xs bg-white border rounded p-1 font-bold"
                        >
                          {[1,2,3,4,5].map(v => <option key={v} value={v}>{v} ★</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 block mb-1">Liderazgo (1-5)</label>
                        <select 
                          value={leadership} 
                          onChange={(e) => setLeadership(Number(e.target.value))}
                          className="w-full text-xs bg-white border rounded p-1 font-bold"
                        >
                          {[1,2,3,4,5].map(v => <option key={v} value={v}>{v} ★</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setCurrentStep(3)}
                      className="px-3 py-1.5 bg-white border border-slate-350 hover:bg-slate-55 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft size={12} /> Atrás
                    </button>
                    <button 
                      onClick={() => setCurrentStep(5)}
                      className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      Siguiente: Fugas & Registro <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FASE 5: SIMULADOR DE FUGAS & REGISTRO DE LEADS */}
          {currentStep === 5 && (
            <div className="space-y-6">
              
              {/* Formulario e Inputs de Fugas */}
              <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-cyan-600">
                  <DollarSign size={18} className="text-cyan-500 animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-wider">Fase 5: Demostración Matemática y Registro</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-1">Autos que atiende al mes</label>
                    <input 
                      type="number" 
                      value={autosMes} 
                      onChange={(e) => setAutosMes(Number(e.target.value))}
                      className="w-full bg-slate-50 border rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-1">Ticket promedio (CLP)</label>
                    <input 
                      type="number" 
                      value={ticketPromedio} 
                      onChange={(e) => setTicketPromedio(Number(e.target.value))}
                      className="w-full bg-slate-50 border rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-1">¿Tiene presencia web / Google Maps?</label>
                    <select 
                      value={tieneWeb} 
                      onChange={(e) => setTieneWeb(e.target.value)}
                      className="w-full bg-slate-50 border rounded-lg p-2 font-bold"
                    >
                      <option value="si">Sí tiene presencia web activa</option>
                      <option value="no">No tiene web / Fuga de visibilidad</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-1">Fuga estimada en Bodega mensual (CLP)</label>
                    <input 
                      type="number" 
                      value={fugaBodega} 
                      onChange={(e) => setFugaBodega(Number(e.target.value))}
                      className="w-full bg-slate-50 border rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-1">Costo de reclamos estéticos/garantías al mes (CLP)</label>
                    <input 
                      type="number" 
                      value={costoReclamos} 
                      onChange={(e) => setCostoReclamos(Number(e.target.value))}
                      className="w-full bg-slate-50 border rounded-lg p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-1">Tasa de rechazo de presupuestos (%)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="5" 
                        max="80" 
                        value={tasaRechazo} 
                        onChange={(e) => setTasaRechazo(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                      <span className="text-xs font-black text-slate-800 whitespace-nowrap">{tasaRechazo}%</span>
                    </div>
                  </div>
                </div>

                {/* Resultado de Fugas en Vivo */}
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-rose-800 uppercase block tracking-wider">💸 Pérdida Total Estimada del Taller:</span>
                    <span className="text-xl font-black text-rose-600">${perdidaTotal.toLocaleString('es-CL')} CLP / mes</span>
                    <span className="text-[9px] text-slate-500 block font-bold">o unos ${(perdidaTotal * 12).toLocaleString('es-CL')} al año.</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-bold bg-white px-3 py-2 rounded-lg border border-slate-200 leading-normal">
                    Nexus cuesta <span className="text-slate-900 font-extrabold">${costoLicenciaNexus.toLocaleString('es-CL')} CLP / mes</span>.<br />
                    Se paga solo <span className="text-emerald-700 font-extrabold">{retornoInversion}x al mes</span> recuperando las fugas.
                  </div>
                </div>
              </div>

              {/* Registro Físico del Lead a Supabase */}
              <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs uppercase tracking-wider">
                  <Save size={16} className="text-cyan-500" />
                  <span>Insertar Taller en el Kanban de Ventas</span>
                </div>

                <form onSubmit={handleRegisterLead} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 block mb-1">Nombre del Taller *</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Ej. Frenos AM Maipú"
                          value={tallerName} 
                          onChange={(e) => setTallerName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 block mb-1">Teléfono / WhatsApp</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Ej. +56988887777"
                          value={tallerPhone} 
                          onChange={(e) => setTallerPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 block mb-1">Comuna</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Ej. Macul, Maipú, Santiago..."
                          value={tallerCommune} 
                          onChange={(e) => setTallerCommune(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 block mb-1">Dirección Física</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Ej. Av. Los Pajaritos 1234"
                          value={tallerAddress} 
                          onChange={(e) => setTallerAddress(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-1">Notas de la llamada</label>
                    <textarea 
                      rows={3} 
                      placeholder="Registra cualquier detalle de la llamada aquí..."
                      value={tallerNotes} 
                      onChange={(e) => setTallerNotes(e.target.value)}
                      className="w-full bg-slate-50 border rounded-lg p-3 font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft size={14} /> Volver a Aptitud
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Registrando...
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          Guardar Lead y Otorgar Acceso
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Tarjeta de Apoyo al Vendedor */}
        <div className="space-y-6">
          
          {/* Tarjeta 1: Indicador de Postura Mental */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="relative z-10 space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-cyan-800 font-extrabold text-[10px] bg-cyan-50 border border-cyan-100/80 px-2.5 py-1 rounded-full w-max">
                <Target size={12} className="text-cyan-600" />
                <span>Mentalidad del Auditor de Ventas</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-slate-800 font-extrabold block text-xs uppercase tracking-wider">1. Posición de Autoridad</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Tú eres un consultor de procesos Lean, no un vendedor de software. No ruegues por tiempo. Haz preguntas difíciles de control y deja que el dueño sienta el dolor de la desorganización de su taller.
                  </p>
                </div>
                <div className="space-y-1 pt-3.5 border-t border-slate-100">
                  <span className="text-slate-800 font-extrabold block text-xs uppercase tracking-wider">2. Descarte Sara Alonso</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Advierte que el software no hace milagros. Si el dueño no lidera con el ejemplo, el software no le servirá. Forzar a que te digan *"Yo sí me comprometo"* genera un pacto de honor en la venta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Matriz de Objeciones en Vivo */}
          <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs uppercase tracking-wider">
              <MessageSquare size={16} className="text-cyan-500" />
              <span>Manual Anti-Objeciones</span>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-650 leading-relaxed">
              <details className="cursor-pointer group bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <summary className="text-[10px] font-black uppercase text-slate-750 flex items-center justify-between">
                  <span>❌ "Es muy caro"</span>
                  <ArrowRight size={10} className="group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-1.5 text-[10px] text-slate-550 leading-normal pl-2 border-l border-cyan-400">
                  "Don Marcelo, si perdiera $200.000 en bodega todos los meses y yo le ofreciera tapar esa fuga por $45.000, ¿sería caro? Nexus no es un gasto, es una reja en la bodega para que deje de botar dinero."
                </p>
              </details>

              <details className="cursor-pointer group bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <summary className="text-[10px] font-black uppercase text-slate-750 flex items-center justify-between">
                  <span>❌ "No sé usar computadores"</span>
                  <ArrowRight size={10} className="group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-1.5 text-[10px] text-slate-550 leading-normal pl-2 border-l border-cyan-400">
                  "Nuestros clientes más contentos son don Hugo de San Miguel, que tiene 65 años y nunca usó un PC. Nexus Garage se maneja con 3 botones táctiles en el celular o tablet. Si sabe mandar audios por WhatsApp, sabe usar Nexus."
                </p>
              </details>

              <details className="cursor-pointer group bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <summary className="text-[10px] font-black uppercase text-slate-750 flex items-center justify-between">
                  <span>❌ "Mis mecánicos se opondrán"</span>
                  <ArrowRight size={10} className="group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-1.5 text-[10px] text-slate-550 leading-normal pl-2 border-l border-cyan-400">
                  "Al principio siempre se oponen porque no quieren control. Pero cuando ven que la orden digital les ayuda a registrar mejor el trabajo y les quita disputas con los clientes, son los primeros en agradecerlo."
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
