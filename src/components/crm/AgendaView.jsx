import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Video, 
  CreditCard, 
  Sparkles, 
  Filter,
  DollarSign,
  Search,
  CalendarCheck
} from 'lucide-react';
import EventModal from './EventModal';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function AgendaView({
  events = [],
  customers = [],
  leads = [],
  onSaveEvent,
  onDeleteEvent
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'list' | 'payments'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navegación de mes
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Construir la matriz de días para el mes actual
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Días del mes anterior para rellenar
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateNumber: dayNum,
        dateStr,
        isCurrentMonth: false,
        isPrev: true
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateNumber: i,
        dateStr,
        isCurrentMonth: true,
        isToday: new Date().toISOString().split('T')[0] === dateStr
      });
    }

    // Días del mes siguiente para completar la cuadrícula (múltiplo de 7)
    const remaining = 42 - days.length;
    for (let i = 1; i <= (remaining > 7 ? remaining - 7 : remaining); i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateNumber: i,
        dateStr,
        isCurrentMonth: false,
        isNext: true
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Eventos filtrados
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      return true;
    });
  }, [events, typeFilter]);

  // Agrupar eventos por fecha
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filteredEvents]);

  // Cobros del mes actual basados en la lista de clientes (NK-125 y NK-126)
  const monthlyCustomerPayments = useMemo(() => {
    const active = customers.filter(c => c.status === 'active');
    return active.map(c => {
      const day = c.billing_day || 5;
      const billingDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const base = Number(c.base_fee) || 0;
      const addons = (c.additional_services || []).reduce((sum, a) => sum + (Number(a.price) || 0), 0);
      const total = base + addons;
      
      const todayStr = new Date().toISOString().split('T')[0];
      const isPast = billingDateStr < todayStr;
      const isToday = billingDateStr === todayStr;

      return {
        customer: c,
        billingDateStr,
        day,
        total,
        isPast,
        isToday
      };
    }).sort((a, b) => a.day - b.day);
  }, [customers, currentYear, currentMonth]);

  // KPIs de la agenda
  const stats = useMemo(() => {
    const thisMonthEvents = events.filter(e => {
      const [y, m] = (e.date || '').split('-');
      return parseInt(y) === currentYear && parseInt(m) === (currentMonth + 1);
    });

    const demos = thisMonthEvents.filter(e => e.type === 'demo').length;
    const reuniones = thisMonthEvents.filter(e => e.type === 'reunion' || e.type === 'visita').length;
    const llamadas = thisMonthEvents.filter(e => e.type === 'llamada').length;
    const cobrosTotalMonto = monthlyCustomerPayments.reduce((sum, p) => sum + p.total, 0);

    return {
      totalEvents: thisMonthEvents.length,
      demos,
      reuniones,
      llamadas,
      cobrosTotalMonto
    };
  }, [events, currentYear, currentMonth, monthlyCustomerPayments]);

  // Helper de badges por tipo de evento
  const getEventTypeBadge = (type) => {
    switch (type) {
      case 'demo':
        return <span className="bg-cyan-500/10 text-cyan-700 border border-cyan-200 text-[10px] font-bold px-1.5 py-0.5 rounded">Demo</span>;
      case 'reunion':
        return <span className="bg-blue-500/10 text-blue-700 border border-blue-200 text-[10px] font-bold px-1.5 py-0.5 rounded">Reunión</span>;
      case 'visita':
        return <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">Terreno</span>;
      case 'llamada':
        return <span className="bg-amber-500/10 text-amber-700 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded">Llamada</span>;
      case 'cobro':
        return <span className="bg-purple-500/10 text-purple-700 border border-purple-200 text-[10px] font-bold px-1.5 py-0.5 rounded">Cobro</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Cita</span>;
    }
  };

  const handleOpenWhatsAppPayment = (payment) => {
    const cleanPhone = (payment.customer.phone || '').replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      alert('El cliente no tiene teléfono configurado.');
      return;
    }
    const message = `Hola ${payment.customer.name}, un gusto saludarte de Nexus Garage. Te recordamos que hoy día ${payment.day} corresponde el cobro mensual de tu plan ${payment.customer.plan_name || 'Nexus Garage'} ($${payment.total.toLocaleString('es-CL')} CLP). ¿Te enviamos los datos para la transferencia? ¡Muchas gracias!`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. KPIs del Módulo de Agendamiento (NK-125) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Citas Este Mes</span>
            <CalendarIcon size={18} className="text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">{stats.totalEvents}</div>
          <span className="text-[10px] text-slate-400 font-semibold mt-1">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Demos de Software</span>
            <Sparkles size={18} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600">{stats.demos}</div>
          <span className="text-[10px] text-slate-400 font-semibold mt-1">
            Presentaciones a talleres
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Visitas y Terreno</span>
            <MapPin size={18} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.reuniones}</div>
          <span className="text-[10px] text-slate-400 font-semibold mt-1">
            Encuentros comerciales presenciales
          </span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl border border-slate-700 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Cobros del Mes</span>
            <CreditCard size={18} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            ${stats.cobrosTotalMonto.toLocaleString('es-CL')}
          </div>
          <span className="text-[10px] text-slate-300 font-semibold mt-1">
            {monthlyCustomerPayments.length} clientes a cobrar
          </span>
        </div>

      </div>

      {/* 2. Barra de Navegación del Calendario y Controles */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Selector de Mes */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              Hoy
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
            {MONTH_NAMES[currentMonth]} <span className="text-cyan-600">{currentYear}</span>
          </h3>
        </div>

        {/* Pestañas de Vista & Botón Nueva Cita */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calendario Mensual
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lista de Citas
            </button>
            <button
              onClick={() => setViewMode('payments')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'payments' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-cyan-600'
              }`}
            >
              <CreditCard size={13} className="text-cyan-500" />
              <span>Cobros del Mes ({monthlyCustomerPayments.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-auto sm:ml-0"
          >
            <Plus size={16} />
            <span>Agendar Cita</span>
          </button>
        </div>

      </div>

      {/* 3. Contenido Principal según ViewMode */}

      {/* VISTA 1: CALENDARIO MENSUAL */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Cabecera Días de Semana */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">
            {DAYS_OF_WEEK.map((day, idx) => (
              <div key={idx}>{day}</div>
            ))}
          </div>

          {/* Celdas de Días */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 text-xs">
            {calendarDays.map((day, idx) => {
              const dayEvents = eventsByDate[day.dateStr] || [];
              const dayPaymentCustomers = monthlyCustomerPayments.filter(p => p.day === day.dateNumber && day.isCurrentMonth);

              return (
                <div
                  key={idx}
                  className={`min-h-[105px] sm:min-h-[125px] p-2 flex flex-col justify-between transition-colors ${
                    !day.isCurrentMonth 
                      ? 'bg-slate-50/50 text-slate-300' 
                      : day.isToday 
                        ? 'bg-cyan-50/30 font-bold' 
                        : 'bg-white hover:bg-slate-50/70'
                  }`}
                >
                  {/* Número de Día */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      day.isToday 
                        ? 'bg-cyan-500 text-white shadow-xs' 
                        : day.isCurrentMonth ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {day.dateNumber}
                    </span>

                    {/* Badge de cobro si hoy cae el día de pago de algún cliente */}
                    {dayPaymentCustomers.length > 0 && (
                      <span 
                        className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-black"
                        title={`${dayPaymentCustomers.length} cobro(s) programados hoy`}
                      >
                        ${(dayPaymentCustomers.reduce((s, p) => s + p.total, 0) / 1000)}k
                      </span>
                    )}
                  </div>

                  {/* Lista de eventos del día */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-[85px] custom-scrollbar">
                    {dayEvents.map(event => (
                      <button
                        key={event.id}
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsModalOpen(true);
                        }}
                        className="w-full text-left px-1.5 py-1 rounded bg-slate-100 hover:bg-cyan-50 border border-slate-200/80 hover:border-cyan-300 transition-all flex items-center justify-between gap-1 group cursor-pointer"
                      >
                        <div className="truncate">
                          <span className="text-[10px] font-bold text-slate-800 block truncate group-hover:text-cyan-700">
                            {event.time} {event.title}
                          </span>
                        </div>
                        {getEventTypeBadge(event.type)}
                      </button>
                    ))}
                  </div>

                  {/* Botón rápido para agregar cita en este día */}
                  {day.isCurrentMonth && (
                    <button
                      onClick={() => {
                        setSelectedEvent({ date: day.dateStr });
                        setIsModalOpen(true);
                      }}
                      className="opacity-0 hover:opacity-100 transition-opacity text-[10px] text-cyan-600 font-bold text-center mt-1 py-0.5 rounded hover:bg-cyan-50 cursor-pointer"
                    >
                      + Cita
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA 2: LISTA DE CITAS */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <CalendarIcon size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">No hay citas registradas en la agenda.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredEvents.map(event => (
                <div 
                  key={event.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200/80 flex flex-col items-center justify-center shrink-0">
                      <Clock size={16} />
                      <span className="text-[9px] font-black">{event.time}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-800">{event.title}</h4>
                        {getEventTypeBadge(event.type)}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          event.status === 'completada' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {event.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <CalendarIcon size={13} className="text-cyan-500" />
                          {event.date}
                        </span>
                        {event.contact_name && (
                          <span className="flex items-center gap-1">
                            <Users size={13} className="text-slate-400" />
                            {event.contact_name}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-slate-400" />
                            {event.location}
                          </span>
                        )}
                      </div>

                      {event.notes && (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          "{event.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA 3: COBROS Y RENOVACIONES DEL MES (NK-125 & NK-126) */}
      {viewMode === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 via-white to-cyan-50 border-b border-slate-200">
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <CreditCard size={18} className="text-purple-600" />
              Calendario de Facturación y Cobranza Mensual
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Sincronizado en tiempo real con las fechas de corte de cada cliente activo en Nexus CRM.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {monthlyCustomerPayments.map((p, idx) => (
              <div 
                key={idx}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                    p.isToday 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                      : p.isPast 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    <span className="text-[10px] uppercase font-bold">Día</span>
                    <span className="text-base leading-none">{p.day}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-extrabold text-slate-800">
                        {p.customer.company}
                      </h5>
                      {p.isToday && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700 animate-pulse">
                          ¡Cobro Hoy!
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-slate-700">{p.customer.name}</span>
                      <span>·</span>
                      <span>{p.customer.plan_name || 'Nexus Garage'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">
                      ${p.total.toLocaleString('es-CL')} CLP
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Base + Addons
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenWhatsAppPayment(p)}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Enviar WhatsApp de cobranza / recordatorio de pago"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Cobro</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Crear / Editar Cita */}
      {isModalOpen && (
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          customers={customers}
          leads={leads}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onSave={(data) => {
            onSaveEvent(data);
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onDelete={(id) => {
            onDeleteEvent(id);
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}

    </div>
  );
}
