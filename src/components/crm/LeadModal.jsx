import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  MessageSquare, 
  Calendar, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Clock, 
  Sparkles,
  Play,
  RotateCcw,
  ChevronRight,
  Flame,
  Target
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { geminiService } from '../../services/geminiService';

export default function LeadModal({ lead, onClose, onSaveLead, onDeleteLead }) {
  // Estados del Formulario
  const [name, setName] = useState('');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [emailType, setEmailType] = useState('No tiene');
  const [priority, setPriority] = useState('Media');
  const [stage, setStage] = useState('lead');
  const [value, setValue] = useState(45000);
  const [pain, setPain] = useState('');
  const [pitch, setPitch] = useState('');
  
  // Seguimiento
  const [visitStatus, setVisitStatus] = useState('Ninguna');
  const [interest, setInterest] = useState('Indeciso');
  const [nextVisitDate, setNextVisitDate] = useState('');
  const [nextVisitTime, setNextVisitTime] = useState('');
  const [notes, setNotes] = useState('');
  const [buyerPersona, setBuyerPersona] = useState('');
  const [openWeekends, setOpenWeekends] = useState(false);
  const [aptitudeCommitment, setAptitudeCommitment] = useState(3);
  const [aptitudeDigital, setAptitudeDigital] = useState(3);
  const [aptitudeLeadership, setAptitudeLeadership] = useState(3);

  // Actividades
  const [activities, setActivities] = useState([]);
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityType, setNewActivityType] = useState('nota');

  // IA Loading
  const [isQualifying, setIsQualifying] = useState(false);

  // Inicializar Formulario
  useEffect(() => {
    if (lead) {
      setName(lead.name || '');
      setCommune(lead.commune || '');
      setAddress(lead.address || '');
      setPhone(lead.phone || '');
      setWebsite(lead.website || '');
      setEmail(lead.email || '');
      setEmailType(lead.emailType || 'No tiene');
      setPriority(lead.priority || 'Media');
      setStage(lead.stage || 'lead');
      setValue(lead.value || 45000);
      setPain(lead.pain || '');
      setPitch(lead.pitch || '');
      setVisitStatus(lead.visitStatus || 'Ninguna');
      setInterest(lead.interest || 'Indeciso');
      setNextVisitDate(lead.nextVisitDate || '');
      setNextVisitTime(lead.nextVisitTime || '');
      setNotes(lead.notes || '');
      setBuyerPersona(lead.buyerPersona || '');
      setOpenWeekends(lead.openWeekends || false);
      setAptitudeCommitment(lead.aptitudeCommitment !== undefined ? lead.aptitudeCommitment : 3);
      setAptitudeDigital(lead.aptitudeDigital !== undefined ? lead.aptitudeDigital : 3);
      setAptitudeLeadership(lead.aptitudeLeadership !== undefined ? lead.aptitudeLeadership : 3);

      // Cargar Actividades
      loadActivities();
    }
  }, [lead]);

  const loadActivities = async () => {
    if (lead && lead.id) {
      const data = await dbService.getActivities(lead.id);
      setActivities(data);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('El nombre del taller es obligatorio');
      return;
    }
    
    const updatedLead = {
      ...lead,
      name,
      commune,
      address,
      phone,
      website,
      email,
      emailType,
      priority,
      stage,
      value: Number(value),
      pain,
      pitch,
      visitStatus,
      interest,
      nextVisitDate,
      nextVisitTime,
      notes,
      buyerPersona,
      openWeekends,
      aptitudeCommitment,
      aptitudeDigital,
      aptitudeLeadership
    };
    
    onSaveLead(updatedLead);
  };

  // Re-calificar con Gemini
  const handleQualifyWithIA = async () => {
    if (!name.trim()) return;
    setIsQualifying(true);
    try {
      const result = await geminiService.qualifyLead(name, 'Taller Mecánico', website, address, '4.0');
      if (result) {
        setPriority(result.prioridad || 'Media');
        setPain(result.dolor_probable || '');
        setPitch(result.pitch_whatsapp || '');
        
        // Registrar actividad de análisis
        if (lead && lead.id) {
          await dbService.saveActivity({
            leadId: lead.id,
            type: 'nota',
            description: '🤖 Análisis de IA ejecutado: Dolor operacional y Pitch de ventas redactados.'
          });
          loadActivities();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsQualifying(false);
    }
  };

  // Registrar nueva actividad
  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivityDesc.trim() || !lead?.id) return;

    await dbService.saveActivity({
      leadId: lead.id,
      type: newActivityType,
      description: newActivityDesc
    });

    setNewActivityDesc('');
    loadActivities();
  };

  // Enlace a WhatsApp
  const getWhatsAppLink = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    let finalPhone = cleanPhone;
    if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) {
      finalPhone = '56' + cleanPhone;
    } else if (cleanPhone.length === 8) {
      finalPhone = '569' + cleanPhone;
    }
    return `https://wa.me/${finalPhone}?text=${encodeURIComponent(pitch)}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-55 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Ficha de Prospecto</span>
            <span className="text-slate-300">|</span>
            <h3 className="font-extrabold text-slate-800 truncate max-w-[200px] sm:max-w-none">
              {name || 'Nuevo Taller'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Formulario e Información General */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Datos Básicos</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre Taller */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nombre Taller</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Ej. Cheos Garage"
                />
              </div>

              {/* Comuna */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Comuna</label>
                <input
                  type="text"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Ej. Ñuñoa"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Teléfono (WhatsApp)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Ej. 56987654321"
                />
              </div>

              {/* Sitio Web */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Sitio Web</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Ej. https://garage.cl (o vaciar)"
                />
              </div>

              {/* Correo */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Ej. taller@gmail.com"
                />
              </div>

              {/* Tipo Correo */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Tipo de Correo</label>
                <select
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="No tiene">No tiene</option>
                  <option value="Corporativo (Formal)">Corporativo (Formal)</option>
                  <option value="Gmail/Hotmail (Personal)">Gmail/Hotmail (Personal)</option>
                </select>
              </div>

              {/* Dirección Completa */}
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-600">Dirección</label>
                  {address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${commune}, Chile`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Ver Ficha y Fotos en Google Maps"
                    >
                      <MapPin size={12} className="animate-bounce" />
                      <span>Ver Ficha y Fotos en Google Maps</span>
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Dirección física del taller"
                />
              </div>
            </div>

            {/* Bloque de Calificación Inteligente (IA) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-cyan-500" />
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">Calificación de Venta por IA</span>
                </div>
                <button
                  type="button"
                  onClick={handleQualifyWithIA}
                  disabled={isQualifying}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isQualifying ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analizando...
                    </>
                  ) : (
                    <>
                      <RotateCcw size={12} /> Redactar con IA
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {/* Dolor Probable */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1">Dolor Operacional Probable</label>
                  <textarea
                    rows={2}
                    value={pain}
                    onChange={(e) => setPain(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none bg-white"
                    placeholder="Ej. Descontrol en inventario de repuestos y OTs"
                  />
                </div>

                {/* Pitch WhatsApp */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1">Mensaje de WhatsApp Sugerido</label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none bg-white font-mono"
                      placeholder="Pitch de WhatsApp"
                    />
                    {phone && pitch && (
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2 bottom-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow shadow-green-500/20"
                      >
                        <Phone size={12} /> Chatear
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Historial de Actividades */}
            {lead?.id && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Historial de Interacciones</h4>
                
                {/* Formulario Nueva Actividad */}
                <form onSubmit={handleAddActivity} className="flex gap-2">
                  <select
                    value={newActivityType}
                    onChange={(e) => setNewActivityType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-bold"
                  >
                    <option value="nota">Nota</option>
                    <option value="llamada">Llamada</option>
                    <option value="visita">Visita</option>
                    <option value="mail">Mail</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Registrar interacción (ej. Llamé y agendé demo)"
                    value={newActivityDesc}
                    onChange={(e) => setNewActivityDesc(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Registrar
                  </button>
                </form>

                {/* Listado */}
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {activities.map(act => (
                    <div key={act.id} className="p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100/50 flex justify-between gap-4">
                      <div className="flex gap-2 items-start">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          act.type === 'llamada' ? 'bg-green-100 text-green-800' :
                          act.type === 'visita' ? 'bg-cyan-100 text-cyan-800' :
                          act.type === 'mail' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {act.type}
                        </span>
                        <p className="text-slate-700">{act.description}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 whitespace-nowrap">
                        {new Date(act.created_at || act.createdAt).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-center py-4 text-slate-400 text-xs italic">No hay interacciones registradas aún.</p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Columna Derecha: Configuración de Venta y Seguimiento */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Estado de la Venta</h4>
            
            {/* Etapa */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Etapa del Kanban</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:ring-1 focus:ring-cyan-500"
              >
                <option value="lead">Prospecto</option>
                <option value="contacto">Primer Contacto</option>
                <option value="demo">Demo Programada</option>
                <option value="negociacion">Negociación</option>
                <option value="ganado">Cerrado Ganado</option>
                <option value="perdido">Cerrado Perdido</option>
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Prioridad de Prospección</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Alta">Alta (Gran Oportunidad)</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            {/* Valor Negocio */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Valor Estimado Negocio (CLP/mensual)</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Perfil de Cliente - Buyer Persona */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Perfil del Cliente (Buyer Persona)</label>
              <select
                value={buyerPersona}
                onChange={(e) => setBuyerPersona(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-cyan-500"
              >
                <option value="">No clasificado</option>
                <option value="marcelo">Marcelo "El Pragmático"</option>
                <option value="sebastian">Sebastián "El Tecno-Heredero"</option>
                <option value="hugo">Don Hugo "El Tradicionalista"</option>
                <option value="socios">Consorcio "Socios Multi-Taller"</option>
              </select>
            </div>

            {/* Widget de Calificación de Aptitud (Sara Alonso) */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-xs">
                  <Target size={14} className="text-amber-600" />
                  <span>Aptitud del Cliente (Estrategia Sara Alonso)</span>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  ((Number(aptitudeCommitment) + Number(aptitudeDigital) + Number(aptitudeLeadership)) / 3) >= 4.0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  ((Number(aptitudeCommitment) + Number(aptitudeDigital) + Number(aptitudeLeadership)) / 3) < 2.5 ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {(((Number(aptitudeCommitment) + Number(aptitudeDigital) + Number(aptitudeLeadership)) / 3)).toFixed(1)} / 5.0
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-semibold">
                {/* Compromiso con el Orden */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                    <span>Compromiso con el Orden:</span>
                    <span className="text-slate-800">{aptitudeCommitment}★</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={aptitudeCommitment}
                    onChange={(e) => setAptitudeCommitment(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Nivel de Digitalización */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                    <span>Digitalización Mental:</span>
                    <span className="text-slate-800">{aptitudeDigital}★</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={aptitudeDigital}
                    onChange={(e) => setAptitudeDigital(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Liderazgo de Implementación */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                    <span>Liderazgo / Guía de Maestros:</span>
                    <span className="text-slate-800">{aptitudeLeadership}★</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={aptitudeLeadership}
                    onChange={(e) => setAptitudeLeadership(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>

              {/* Status de Alerta de Aptitud */}
              <div className="pt-2 border-t border-slate-100">
                {((Number(aptitudeCommitment) + Number(aptitudeDigital) + Number(aptitudeLeadership)) / 3) >= 4.0 ? (
                  <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                    🟢 Cliente Apto: Alto compromiso. Ideal para plan anual.
                  </p>
                ) : ((Number(aptitudeCommitment) + Number(aptitudeDigital) + Number(aptitudeLeadership)) / 3) < 2.5 ? (
                  <p className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded">
                    🔴 Descartar / Riesgo: Muy bajo compromiso. Churn inminente.
                  </p>
                ) : (
                  <p className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                    🟡 Calificación Crítica: Requiere advertencia de descarte socrático.
                  </p>
                )}
              </div>

              {/* Script de Descarte Socrático (Sara Alonso) */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[10px] text-slate-650 leading-relaxed font-semibold">
                <span className="font-extrabold text-amber-850 block mb-1">🗣️ Postura de Descarte (Psicología Inversa):</span>
                "Mire don {name.split(' ')[0] || 'dueño'}, Nexus Garage es una herramienta excelente para frenar fugas de stock, pero requiere que su equipo registre los repuestos. Si usted no está dispuesto a exigir este orden mínimo a sus maestros, nuestro sistema no le servirá. Esto no es para todos. ¿Se compromete a guiar a su equipo, o prefiere seguir con sus fugas actuales?"
              </div>
            </div>

            {/* Widget Guía Comercial Dinámica */}
            {buyerPersona && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3.5 space-y-2.5 text-xs">
                <div className="font-extrabold text-cyan-800 flex items-center gap-1">
                  <Sparkles size={12} className="text-cyan-500 shrink-0" />
                  <span>Guía Comercial Express</span>
                </div>
                {buyerPersona === 'marcelo' && (
                  <div className="text-slate-650 leading-relaxed font-semibold space-y-1.5">
                    <p><span className="font-extrabold text-slate-800">⚡ Dolor:</span> Fugas de repuestos y desorden operativo.</p>
                    <p><span className="font-extrabold text-slate-800">💬 Objeción:</span> "Mis mecánicos no querrán usarlo".</p>
                    <p><span className="font-extrabold text-cyan-800">💡 Foco:</span> La app del mecánico toma solo 3 clics.</p>
                    <p className="pt-1 border-t border-cyan-500/10"><span className="font-extrabold text-emerald-700">🎁 Pregunta Socrática:</span> "¿Usted cree que la pérdida de dinero en su taller viene de repuestos instalados que se olvida cobrar?"</p>
                    <p className="pt-1 border-t border-cyan-500/10 text-cyan-800"><span className="font-extrabold">⭐ Caso de Éxito:</span> Taller AM Frenos redujo un 80% las mermas de pastillas en su bodega en el primer mes de uso de Nexus.</p>
                    <p className="pt-1 border-t border-cyan-500/10 text-amber-800"><span className="font-bold">💎 Upsell Premium:</span> Ofrece el Diagnóstico de Procesos & Stock Cobrado con Nexus Garage para ordenar el pañol.</p>
                  </div>
                )}
                {buyerPersona === 'sebastian' && (
                  <div className="text-slate-650 leading-relaxed font-semibold space-y-1.5">
                    <p><span className="font-extrabold text-slate-800">⚡ Dolor:</span> Resistencia al cambio del padre y mecánicos.</p>
                    <p><span className="font-extrabold text-slate-800">💬 Objeción:</span> "Mi papá dice que el papel nunca falla".</p>
                    <p><span className="font-extrabold text-cyan-800">💡 Foco:</span> Ofrece agendamiento web y presupuestos con fotos del daño.</p>
                    <p className="pt-1 border-t border-cyan-500/10"><span className="font-extrabold text-emerald-700">🎁 Pregunta Socrática:</span> "¿Usted cree que la fuga de clientes jóvenes viene de tardar más de 20 minutos en enviar el presupuesto por WhatsApp?"</p>
                    <p className="pt-1 border-t border-cyan-500/10 text-cyan-800"><span className="font-extrabold">⭐ Caso de Éxito:</span> Automotriz Romacenter logró que mecánicos antiguos usaran la app dándoles incentivos por orden ingresada.</p>
                    <p className="pt-1 border-t border-cyan-500/10 text-amber-800"><span className="font-bold">💎 Upsell Premium:</span> Diagnóstico de Procesos (Cuellos de Botella) + Posicionamiento en Maps para atraer jóvenes.</p>
                  </div>
                )}
                {buyerPersona === 'hugo' && (
                  <div className="text-slate-650 leading-relaxed font-semibold space-y-1.5">
                    <p><span className="font-extrabold text-slate-800">⚡ Dolor:</span> Pérdida de clientes jóvenes y olvido de cobros.</p>
                    <p><span className="font-extrabold text-slate-800">💬 Objeción:</span> "A mi edad no aprenderé programas".</p>
                    <p><span className="font-extrabold text-cyan-800">💡 Foco:</span> Se opera por WhatsApp. Cobrará mejor su mano de obra.</p>
                    <p className="pt-1 border-t border-cyan-500/10"><span className="font-extrabold text-emerald-700">🎁 Pregunta Socrática:</span> "¿Usted cree que a fin de mes le queda menos dinero del esperado porque regala mano de obra al cobrar al ojo?"</p>
                    <p className="pt-1 border-t border-cyan-500/10 text-cyan-800"><span className="font-extrabold">⭐ Caso de Éxito:</span> Don Hugo (Lubricentro Guerrero, 64 años) delegó presupuestos a su secretaria usando plantillas automáticas de WhatsApp de Nexus.</p>
                    <p className="pt-1 border-t border-cyan-500/10 text-amber-800"><span className="font-bold">💎 Upsell Premium:</span> Diagnóstico Financiero Cobrado (Cálculo de hora mecánico y punto de equilibrio) con Nexus RPM.</p>
                  </div>
                )}
                {buyerPersona === 'socios' && (
                  <div className="text-slate-650 leading-relaxed font-semibold space-y-1.5">
                    <p><span className="font-extrabold text-slate-800">⚡ Dolor:</span> Falta de datos consolidados y mermas por sucursal.</p>
                    <p><span className="font-extrabold text-slate-800">💬 Objeción:</span> "Es muy caro licenciar múltiples locales".</p>
                    <p><span className="font-extrabold text-cyan-800">💡 Foco:</span> Destaca el panel consolidado y auditoría obligatoria de bodega.</p>
                    <p className="pt-1 border-t border-cyan-500/10"><span className="font-extrabold text-emerald-700">🎁 Pregunta Socrática:</span> "¿Usted cree que las diferencias de inventario vienen de repuestos que salen de bodega sin estar asociados a una patente?"</p>
                    <p className="pt-1 border-t border-cyan-500/10 text-cyan-800"><span className="font-extrabold">⭐ Caso de Éxito:</span> Consorcio Boxes Car Center centralizó 3 sucursales, frenando pérdidas por mermas de $1.200.000 mensuales.</p>
                    <p className="pt-1 border-t border-cyan-500/10 text-amber-800"><span className="font-bold">💎 Upsell Premium:</span> Auditoría de Bodegas inter-sucursales + Viaje del Cliente estandarizado.</p>
                  </div>
                )}
              </div>
            )}

            {/* Caja de Herramientas de Cierre Psicológico */}
            {buyerPersona && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 space-y-2.5 text-xs">
                <div className="font-extrabold text-emerald-800 flex items-center gap-1">
                  <Flame size={12} className="text-emerald-600 shrink-0" />
                  <span>Hacks de Cierre Psicológico</span>
                </div>
                
                <div className="space-y-2 font-semibold text-slate-650">
                  <details className="cursor-pointer group">
                    <summary className="text-[10px] font-black uppercase text-slate-750 flex items-center justify-between">
                      <span>📉 Costo de la Inacción</span>
                      <ChevronRight size={10} className="group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-1.5 leading-relaxed text-slate-600 pl-2 border-l-2 border-emerald-400">
                      "Don, si decidimos esperar un mes más para ordenar la bodega, se le volverán a perder otros $200.000 en stock. Esperar le cuesta $7.000 diarios. Detengamos la fuga hoy."
                    </p>
                  </details>

                  <details className="cursor-pointer group pt-1.5 border-t border-emerald-500/10">
                    <summary className="text-[10px] font-black uppercase text-slate-750 flex items-center justify-between">
                      <span>🤏 El Micro-Paso (Piloto)</span>
                      <ChevronRight size={10} className="group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-1.5 leading-relaxed text-slate-600 pl-2 border-l-2 border-emerald-400">
                      "No compre el año completo. Hagamos un piloto de 7 días con un solo elevador y veamos cómo reacciona su equipo sin ningún riesgo para usted."
                    </p>
                  </details>

                  <details className="cursor-pointer group pt-1.5 border-t border-emerald-500/10">
                    <summary className="text-[10px] font-black uppercase text-slate-750 flex items-center justify-between">
                      <span>🤝 Garantía SmartLean</span>
                      <ChevronRight size={10} className="group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-1.5 leading-relaxed text-slate-600 pl-2 border-l-2 border-emerald-400">
                      "Nosotros no vendemos software y nos marchamos. Yo mismo vendré al taller a configurarle el sistema y capacitar a sus maestros uno a uno."
                    </p>
                  </details>
                </div>
              </div>
            )}

            <div className="border-t border-slate-200/80 my-2 pt-3 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Planificación de Actividades</h4>

              {/* Horario Fines de Semana */}
              <div className="flex items-center gap-2 py-2.5 px-3 bg-slate-550/5 border border-slate-200/50 rounded-xl">
                <input
                  type="checkbox"
                  id="openWeekends"
                  checked={openWeekends}
                  onChange={(e) => setOpenWeekends(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-350 cursor-pointer"
                />
                <label htmlFor="openWeekends" className="text-xs font-black text-slate-700 cursor-pointer select-none">
                  Abre Fines de Semana (Sáb/Dom)
                </label>
              </div>

              {/* Visita Realizada */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Estado de Visita</label>
                <select
                  value={visitStatus}
                  onChange={(e) => setVisitStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Ninguna">Ninguna</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Hecha">Visita Realizada</option>
                </select>
              </div>

              {/* Nivel de Interés */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nivel de Interés</label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Indeciso">Indeciso</option>
                  <option value="Interesado">Interesado (Caliente)</option>
                  <option value="No Interesado">No Interesado (Frío)</option>
                </select>
              </div>

              {/* Fecha Próxima Visita */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Fecha Próxima Visita</label>
                <input
                  type="date"
                  value={nextVisitDate}
                  onChange={(e) => setNextVisitDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Hora Próxima Visita */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Hora Visita</label>
                <input
                  type="time"
                  value={nextVisitTime}
                  onChange={(e) => setNextVisitTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Notas de Seguimiento */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Notas Internas</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles sobre lo conversado..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Acciones del Footer */}
        <div className="h-16 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            {lead?.id && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Estás seguro de eliminar este prospecto?')) {
                    onDeleteLead(lead.id);
                  }
                }}
                className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={14} /> Eliminar Lead
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow shadow-cyan-500/10 cursor-pointer"
            >
              <Save size={14} /> Guardar Cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
