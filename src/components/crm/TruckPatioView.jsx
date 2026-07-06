import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  Search, 
  Clock, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Navigation,
  ArrowRight,
  LogOut,
  Send,
  Building,
  Smartphone,
  LayoutDashboard
} from 'lucide-react';
import { dbService } from '../../services/dbService';

export default function TruckPatioView() {
  const [currentMode, setCurrentMode] = useState('operator'); // 'operator' o 'driver'
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para el formulario del chofer
  const [driverPlate, setDriverPlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverCompany, setDriverCompany] = useState('');
  const [driverNotes, setDriverNotes] = useState('');
  const [driverActiveTicket, setDriverActiveTicket] = useState(null);

  // Estados de andenes
  const DOCKS = ['Andén 1', 'Andén 2', 'Andén 3', 'Andén 4', 'Andén 5'];
  const [assigningTicket, setAssigningTicket] = useState(null); // Ticket en proceso de asignación de andén

  // Cargar tickets de patio al iniciar
  const fetchTickets = async () => {
    try {
      const data = await dbService.getTruckTickets();
      setTickets(data);
      
      // Sincronizar el ticket activo del chofer (si está simulando)
      const savedPlate = localStorage.getItem('nexus_crm_driver_active_plate');
      if (savedPlate) {
        const active = data.find(t => t.plate.toUpperCase() === savedPlate.toUpperCase() && t.status !== 'retirado');
        setDriverActiveTicket(active || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // Autorefrescar cada 4 segundos en la demo para sentir dinamismo
    const interval = setInterval(fetchTickets, 4000);
    return () => clearInterval(interval);
  }, []);

  // Registrar llegada de camión (Chofer)
  const handleReportArribo = async (e) => {
    e.preventDefault();
    if (!driverPlate.trim() || !driverName.trim() || !driverPhone.trim()) {
      alert("Por favor completa los datos obligatorios (*).");
      return;
    }

    const newTicket = {
      plate: driverPlate.toUpperCase().replace(/[^A-Z0-9-]/g, ''),
      driverName,
      driverPhone,
      company: driverCompany || 'Particular / Sin Empresa',
      notes: driverNotes,
      status: 'patio',
      dock: null,
      entryTime: new Date().toISOString()
    };

    try {
      const saved = await dbService.saveTruckTicket(newTicket);
      localStorage.setItem('nexus_crm_driver_active_plate', saved.plate);
      setDriverActiveTicket(saved);
      
      // Resetear campos
      setDriverPlate('');
      setDriverName('');
      setDriverPhone('');
      setDriverCompany('');
      setDriverNotes('');
      
      fetchTickets();
      alert("Status: ¡Llegada reportada con éxito! Permanece en tu cabina hasta que se te asigne un andén.");
    } catch (err) {
      console.error(err);
    }
  };

  // Asignar andén al camión (Operador)
  const handleAssignDock = async (ticket, dockName) => {
    const updated = {
      ...ticket,
      status: 'anden',
      dock: dockName,
      dockTime: new Date().toISOString()
    };
    try {
      await dbService.saveTruckTicket(updated);
      setAssigningTicket(null);
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  // Finalizar carga/descarga (Operador)
  const handleFinishLoading = async (ticket) => {
    const updated = {
      ...ticket,
      status: 'listo',
      readyTime: new Date().toISOString()
    };
    try {
      await dbService.saveTruckTicket(updated);
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  // Despachar camión / Confirmar salida de patio (Chofer u Operador)
  const handleExitPatio = async (ticket) => {
    const updated = {
      ...ticket,
      status: 'retirado',
      exitTime: new Date().toISOString()
    };
    try {
      await dbService.saveTruckTicket(updated);
      if (driverActiveTicket && driverActiveTicket.id === ticket.id) {
        setDriverActiveTicket(null);
        localStorage.removeItem('nexus_crm_driver_active_plate');
      }
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar ticket (para mantenimiento de la demo)
  const handleDeleteTicket = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este ticket de patio?")) {
      await dbService.deleteTruckTicket(id);
      fetchTickets();
    }
  };

  // Obtener camión ocupando un andén específico
  const getDockOccupant = (dockName) => {
    return tickets.find(t => t.dock === dockName && t.status === 'anden');
  };

  // Calcular tiempo de ciclo
  const formatElapsedTime = (startTime) => {
    if (!startTime) return '0 min';
    const diffMs = new Date() - new Date(startTime);
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min`;
  };

  // Filtrar tickets por búsqueda
  const filteredTickets = tickets.filter(t => {
    const query = searchQuery.toLowerCase();
    return (
      t.plate.toLowerCase().includes(query) ||
      t.driverName.toLowerCase().includes(query) ||
      t.company.toLowerCase().includes(query)
    );
  });

  // Clasificar tickets por columna
  const waitingTickets = filteredTickets.filter(t => t.status === 'patio');
  const activeDockTickets = filteredTickets.filter(t => t.status === 'anden');
  const readyTickets = filteredTickets.filter(t => t.status === 'listo');
  const historyTickets = filteredTickets.filter(t => t.status === 'retirado').slice(0, 10); // Últimos 10

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Selector de Vista / Demo */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Truck className="text-cyan-400 animate-pulse" size={22} />
            MÓDULO LEAN LOGÍSTICO: patio & andenes
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Control de andenes en tiempo real con semáforo digital de carga y aviso remoto al transportista.
          </p>
        </div>
        <div className="flex gap-2.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700/80 shrink-0">
          <button
            onClick={() => setCurrentMode('operator')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              currentMode === 'operator' 
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} /> Vista Operador
          </button>
          <button
            onClick={() => setCurrentMode('driver')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              currentMode === 'driver' 
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={14} /> App del Chofer (Móvil)
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VISTA 1: OPERADOR DE PATIO (ADMINISTRADOR)               */}
      {/* ======================================================== */}
      {currentMode === 'operator' && (
        <div className="space-y-6">
          
          {/* Fila superior: Estado de los Andenes */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {DOCKS.map((dockName, index) => {
              const occupant = getDockOccupant(dockName);
              return (
                <div 
                  key={index} 
                  className={`border rounded-2xl p-4 transition-all shadow-sm flex flex-col justify-between h-32 relative overflow-hidden ${
                    occupant 
                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-900' 
                      : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-900'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{dockName}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border ${
                      occupant 
                        ? 'bg-rose-500 border-rose-600 animate-pulse' 
                        : 'bg-emerald-500 border-emerald-600'
                    }`} />
                  </div>
                  
                  {occupant ? (
                    <div className="space-y-1">
                      <span className="text-base font-black tracking-tight text-slate-800 uppercase block">{occupant.plate}</span>
                      <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                        <span className="truncate max-w-[80px]">{occupant.driverName}</span>
                        <span>{formatElapsedTime(occupant.dockTime)}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">DISPONIBLE</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Barra de Filtros */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por patente, chofer o empresa de transporte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <button
              onClick={fetchTickets}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-colors cursor-pointer"
            >
              Sincronizar Patio
            </button>
          </div>

          {/* Columnas Kanban Operativas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Columna 1: En Espera (Patio) */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Esperando Andén ({waitingTickets.length})</h3>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {waitingTickets.length === 0 ? (
                  <p className="text-[11px] text-slate-400 font-bold text-center py-10">Sin camiones en patio.</p>
                ) : (
                  waitingTickets.map(t => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{t.company}</span>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t.plate}</h4>
                        </div>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase">Patio</span>
                      </div>

                      <div className="space-y-1.5 text-[10px] text-slate-600 font-bold">
                        <div className="flex items-center gap-1">
                          <User size={12} className="text-slate-400" />
                          <span>{t.driverName} ({t.driverPhone})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>Esperando hace: {formatElapsedTime(t.entryTime)}</span>
                        </div>
                        {t.notes && <p className="text-[9px] text-slate-405 italic font-medium pt-1 border-t border-slate-50">{t.notes}</p>}
                      </div>

                      {/* Selector de Andén rápido */}
                      <div className="pt-2.5 border-t border-slate-100 space-y-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase block">Asignar Andén Operativo:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {DOCKS.map((dockName, idx) => {
                            const isOccupied = getDockOccupant(dockName);
                            return (
                              <button
                                key={idx}
                                disabled={isOccupied}
                                onClick={() => handleAssignDock(t, dockName)}
                                className={`px-2 py-1 rounded text-[9px] font-black transition-colors cursor-pointer ${
                                  isOccupied 
                                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                                    : 'bg-cyan-50 hover:bg-cyan-500 text-cyan-800 hover:text-slate-950 border border-cyan-100/50'
                                }`}
                              >
                                {dockName.split(' ')[1]}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button 
                          onClick={() => handleDeleteTicket(t.id)} 
                          className="text-[9px] font-bold text-rose-500 hover:underline cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Columna 2: En Proceso (Carga / Descarga) */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Cargando / Descargando ({activeDockTickets.length})</h3>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {activeDockTickets.length === 0 ? (
                  <p className="text-[11px] text-slate-400 font-bold text-center py-10">Sin camiones en andenes.</p>
                ) : (
                  activeDockTickets.map(t => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{t.company}</span>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t.plate}</h4>
                        </div>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 uppercase">{t.dock}</span>
                      </div>

                      <div className="space-y-1.5 text-[10px] text-slate-600 font-bold">
                        <div className="flex items-center gap-1">
                          <User size={12} className="text-slate-400" />
                          <span>{t.driverName} ({t.driverPhone})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>En andén hace: {formatElapsedTime(t.dockTime)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleFinishLoading(t)}
                        className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle size={12} /> Finalizar Carga
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Columna 3: Listo para partir (Verde) */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Listo para partir ({readyTickets.length})</h3>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {readyTickets.length === 0 ? (
                  <p className="text-[11px] text-slate-400 font-bold text-center py-10">Sin camiones listos.</p>
                ) : (
                  readyTickets.map(t => (
                    <div key={t.id} className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 shadow-sm space-y-3 animate-fadeIn">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{t.company}</span>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t.plate}</h4>
                        </div>
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 uppercase flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          Listo
                        </span>
                      </div>

                      <div className="space-y-1.5 text-[10px] text-slate-600 font-bold">
                        <div className="flex items-center gap-1">
                          <User size={12} className="text-slate-400" />
                          <span>{t.driverName} ({t.driverPhone})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>Listo hace: {formatElapsedTime(t.readyTime)}</span>
                        </div>
                      </div>

                      {/* Notificar por WhatsApp */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <a
                          href={`https://api.whatsapp.com/send?phone=${t.driverPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                            `¡Hola ${t.driverName}! Tu camión patente ${t.plate} ya finalizó su proceso de carga/descarga. Por favor, retíralo de inmediato del andén para mantener el flujo Lean del patio.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center block"
                        >
                          <Send size={12} className="inline mr-1" /> Solicitar Retiro (WhatsApp)
                        </a>

                        <button
                          onClick={() => handleExitPatio(t)}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          Confirmar Salida Manual
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Historial Compacto */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Historial de Salidas (Últimos 10)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase">
                    <th className="py-2.5">Patente</th>
                    <th className="py-2.5">Chofer</th>
                    <th className="py-2.5">Empresa</th>
                    <th className="py-2.5">Andén</th>
                    <th className="py-2.5">Hora Llegada</th>
                    <th className="py-2.5">Hora Salida</th>
                    <th className="py-2.5">Tiempo Patio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyTickets.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-6 text-center text-slate-400 font-bold">Sin salidas registradas hoy.</td>
                    </tr>
                  ) : (
                    historyTickets.map(t => {
                      const totalTime = t.exitTime && t.entryTime 
                        ? `${Math.floor((new Date(t.exitTime) - new Date(t.entryTime)) / 60000)} min`
                        : 'N/A';
                      return (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 font-extrabold text-slate-800 uppercase">{t.plate}</td>
                          <td className="py-2.5">{t.driverName}</td>
                          <td className="py-2.5 text-slate-400">{t.company}</td>
                          <td className="py-2.5 text-slate-700 font-bold">{t.dock || 'N/A'}</td>
                          <td className="py-2.5 text-slate-400">{t.entryTime ? new Date(t.entryTime).toLocaleTimeString() : 'N/A'}</td>
                          <td className="py-2.5 text-slate-400">{t.exitTime ? new Date(t.exitTime).toLocaleTimeString() : 'N/A'}</td>
                          <td className="py-2.5 text-emerald-600 font-black">{totalTime}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* VISTA 2: APP DEL CHOFER (CELULAR SIMULADO)               */}
      {/* ======================================================== */}
      {currentMode === 'driver' && (
        <div className="flex justify-center py-4">
          
          {/* Marco de Celular Físico */}
          <div className="w-full max-w-sm bg-slate-950 rounded-[40px] p-4 shadow-2xl border-4 border-slate-800 relative">
            
            {/* Notch superior */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full z-20" />
            
            {/* Pantalla del Celular */}
            <div className="bg-slate-50 min-h-[580px] rounded-[32px] overflow-hidden flex flex-col justify-between font-sans text-slate-900 relative p-5 pt-8 select-none">
              
              {/* Header de la App */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center text-white">
                    <Truck size={12} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none">NEXUS PATIO</h3>
                    <span className="text-[7px] text-cyan-500 font-black tracking-wider leading-none">CHOFER DIGITAL</span>
                  </div>
                </div>
                {driverActiveTicket && (
                  <button
                    onClick={() => {
                      if (confirm("¿Seguro que deseas desvincularte de este camión?")) {
                        setDriverActiveTicket(null);
                        localStorage.removeItem('nexus_crm_driver_active_plate');
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                    title="Cerrar Sesión"
                  >
                    <LogOut size={12} />
                  </button>
                )}
              </div>

              {/* Contenido Principal */}
              <div className="flex-1 flex flex-col justify-center">
                
                {/* CASO A: CHOFER NO REGISTRADO (FORMULARIO DE INGRESO) */}
                {!driverActiveTicket ? (
                  <form onSubmit={handleReportArribo} className="space-y-3.5 text-xs text-slate-700">
                    <div className="text-center space-y-1 mb-2">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">AVISAR LLEGADA A PATIO</h4>
                      <p className="text-[9px] text-slate-400 font-medium">Ingresa los datos del camión para solicitar andén.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase block">Patente del Camión *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: CLJY39"
                        value={driverPlate}
                        onChange={(e) => setDriverPlate(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold uppercase focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase block">Nombre Completo Chofer *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Juan Pérez"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase block">N° Celular (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: +56930057769"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase block">Empresa de Transporte / Carga</label>
                      <input
                        type="text"
                        placeholder="Ej: Pullman Cargo, Particular"
                        value={driverCompany}
                        onChange={(e) => setDriverCompany(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase block">Observaciones / Tipo Carga</label>
                      <textarea
                        rows={2}
                        placeholder="Ej: Carga de repuestos, palletizados..."
                        value={driverNotes}
                        onChange={(e) => setDriverNotes(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase rounded-lg tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Navigation size={12} /> Registrar Llegada
                    </button>
                  </form>
                ) : (
                  
                  // CASO B: CHOFER REGISTRADO (SEMÁFORO DIGITAL LEAN)
                  <div className="space-y-6 text-center animate-fadeIn">
                    
                    {/* Tarjeta del Camión */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm text-left text-[10px] font-bold space-y-1">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                        <span className="text-slate-400 block uppercase tracking-wider">Vehículo Activo</span>
                        <span className="font-extrabold text-slate-800 uppercase">{driverActiveTicket.company}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1.5">
                        <div>
                          <span className="text-slate-400 block uppercase text-[8px]">Patente</span>
                          <span className="text-slate-800 uppercase font-black text-xs">{driverActiveTicket.plate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase text-[8px]">Chofer</span>
                          <span className="text-slate-800 truncate block max-w-[100px]">{driverActiveTicket.driverName}</span>
                        </div>
                      </div>
                    </div>

                    {/* El Semáforo Digital */}
                    <div className="flex flex-col items-center gap-4 bg-slate-900/5 border border-slate-900/10 rounded-3xl p-6">
                      
                      {/* Luces del Semáforo */}
                      <div className="w-16 bg-slate-950 rounded-2xl p-2 flex flex-col gap-2.5 border border-slate-800 shadow-inner">
                        {/* Luz Roja (Permanecer Quieto) */}
                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          (driverActiveTicket.status === 'patio' || driverActiveTicket.status === 'anden')
                            ? 'bg-rose-500 border-rose-600 shadow-lg shadow-rose-500/50 scale-105'
                            : 'bg-rose-950/40 border-rose-950/10 opacity-30'
                        }`}>
                          <span className="text-[7px] font-black text-white leading-none">STOP</span>
                        </div>

                        {/* Luz Amarilla (Auxiliar en transición) */}
                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          false 
                            ? 'bg-amber-400 border-amber-500 shadow-lg shadow-amber-400/50 animate-pulse'
                            : 'bg-amber-950/40 border-amber-950/10 opacity-30'
                        }`} />

                        {/* Luz Verde (Listo para Partir) */}
                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          driverActiveTicket.status === 'listo'
                            ? 'bg-emerald-500 border-emerald-600 shadow-lg shadow-emerald-500/50 scale-105 animate-pulse'
                            : 'bg-emerald-950/40 border-emerald-950/10 opacity-30'
                        }`}>
                          <span className="text-[7px] font-black text-white leading-none">GO</span>
                        </div>
                      </div>

                      {/* Instrucción Dinámica Lean */}
                      <div className="space-y-1.5">
                        {driverActiveTicket.status === 'patio' && (
                          <>
                            <h5 className="text-xs font-black uppercase text-rose-700">Llegado a Patio · Esperando Andén</h5>
                            <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                              Estaciónate en las zonas amarillas de patio y permanece en tu cabina. Te notificaremos cuando tu andén esté libre.
                            </p>
                          </>
                        )}
                        {driverActiveTicket.status === 'anden' && (
                          <>
                            <h5 className="text-xs font-black uppercase text-rose-700">Andén Asignado: {driverActiveTicket.dock}</h5>
                            <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                              Dirígete al andén asignado. Permanece con freno de mano puesto. Prohibido mover el vehículo durante la faena.
                            </p>
                          </>
                        )}
                        {driverActiveTicket.status === 'listo' && (
                          <>
                            <h5 className="text-xs font-black uppercase text-emerald-600 animate-pulse">¡LISTO! RETIRAR CAMIÓN</h5>
                            <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                              Carga/descarga completada. Por favor, retírate del andén y del patio de inmediato para liberar el flujo.
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Botón de Confirmación Chofer */}
                    {driverActiveTicket.status === 'listo' && (
                      <button
                        onClick={() => handleExitPatio(driverActiveTicket)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-98"
                      >
                        <CheckCircle size={14} /> Confirmar Salida de Patio
                      </button>
                    )}

                  </div>
                )}
              </div>

              {/* Footer de la Pantalla */}
              <div className="border-t border-slate-200 pt-2 mt-4 text-center text-[7px] font-black text-slate-400 uppercase tracking-widest shrink-0">
                SMARTLEAN CHILE · OPERACIONES
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
