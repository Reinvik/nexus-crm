import React, { useState, useMemo, useEffect } from 'react';
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
  CalendarCheck,
  CalendarDays,
  ListFilter
} from 'lucide-react';
import EventModal from './EventModal';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Formateador local seguro YYYY-MM-DD
const toLocalDateStr = (d) => {
  const dateObj = (d instanceof Date) ? d : new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generar los 7 días de la semana (Lunes a Domingo) para la fecha base
const getWeekDays = (baseDate) => {
  const d = new Date(baseDate);
  const dayOfWeek = d.getDay(); // 0 Dom, 1 Lun...
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const days = [];
  const todayStr = toLocalDateStr(new Date());
  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const fullLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const dateStr = toLocalDateStr(cur);
    days.push({
      date: cur,
      dateNumber: cur.getDate(),
      dateStr,
      dayName: dayLabels[i],
      fullDayName: fullLabels[i],
      isToday: dateStr === todayStr
    });
  }
  return days;
};

export default function AgendaView({
  events = [],
  customers = [],
  leads = [],
  onSaveEvent,
  onDeleteEvent,
  initialCustomer = null,
  onClearInitialCustomer
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'day' | 'week' | 'month' | 'list' | 'payments'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');

  // Precargar modal si se solicita agendar desde un cliente activo (NK-125)
  useEffect(() => {
    if (initialCustomer) {
      setSelectedEvent({
        customer: initialCustomer,
        date: toLocalDateStr(new Date()),
        time: '10:00'
      });
      setIsModalOpen(true);
    }
  }, [initialCustomer]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navegación inteligente según vista activa
  const handlePrev = () => {
    if (viewMode === 'day') {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 1);
      setCurrentDate(prev);
    } else if (viewMode === 'week') {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 7);
      setCurrentDate(prev);
    } else {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 1);
      setCurrentDate(next);
    } else if (viewMode === 'week') {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 7);
      setCurrentDate(next);
    } else {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Etiqueta legible del rango/fecha en el encabezado
  const headerDateLabel = useMemo(() => {
    if (viewMode === 'day') {
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return `${days[currentDate.getDay()]}, ${currentDate.getDate()} de ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (viewMode === 'week') {
      const wDays = getWeekDays(currentDate);
      const start = wDays[0];
      const end = wDays[6];
      if (start.date.getMonth() === end.date.getMonth()) {
        return `${start.dateNumber} al ${end.dateNumber} de ${MONTH_NAMES[start.date.getMonth()]} ${start.date.getFullYear()}`;
      }
      return `${start.dateNumber} ${MONTH_NAMES[start.date.getMonth()]} - ${end.dateNumber} ${MONTH_NAMES[end.date.getMonth()]} ${end.date.getFullYear()}`;
    }
    return `${MONTH_NAMES[currentMonth]} ${currentYear}`;
  }, [viewMode, currentDate, currentMonth, currentYear]);

  // Días de la semana actual para la vista semanal
  const weekDays = useMemo(() => {
    return getWeekDays(currentDate);
  }, [currentDate]);

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
    const todayStr = toLocalDateStr(new Date());
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateNumber: i,
        dateStr,
        isCurrentMonth: true,
        isToday: todayStr === dateStr
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

  // Eventos filtrados por tipo
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      return true;
    });
  }, [events, typeFilter]);

  // Agrupar eventos por fecha YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filteredEvents]);

  // Cobros del mes actual basados en la lista de clientes activos (NK-125 y NK-126)
  const monthlyCustomerPayments = useMemo(() => {
    const active = customers.filter(c => c.status === 'active');
    return active.map(c => {
      const day = c.billing_day || 5;
      const billingDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const base = Number(c.base_fee) || 0;
      const addons = (c.additional_services || []).reduce((sum, a) => sum + (Number(a.price) || 0), 0);
      const total = base + addons;
      
      const todayStr = toLocalDateStr(new Date());
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

  // Eventos y cobros específicos del día seleccionado (para vista Diaria)
  const currentDayStr = useMemo(() => toLocalDateStr(currentDate), [currentDate]);
  const currentDayEvents = useMemo(() => {
    const list = eventsByDate[currentDayStr] || [];
    return [...list].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }, [eventsByDate, currentDayStr]);

  const currentDayPayments = useMemo(() => {
    const dayNum = currentDate.getDate();
    return monthlyCustomerPayments.filter(p => p.day === dayNum);
  }, [monthlyCustomerPayments, currentDate]);

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

  // Badges y colores según tipo de evento
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

  const getEventBorderClass = (type) => {
    switch (type) {
      case 'demo':
        return 'border-l-4 border-l-cyan-500 bg-cyan-50/40 border-cyan-200';
      case 'reunion':
        return 'border-l-4 border-l-blue-500 bg-blue-50/40 border-blue-200';
      case 'visita':
        return 'border-l-4 border-l-emerald-500 bg-emerald-50/40 border-emerald-200';
      case 'llamada':
        return 'border-l-4 border-l-amber-500 bg-amber-50/40 border-amber-200';
      case 'cobro':
        return 'border-l-4 border-l-purple-500 bg-purple-50/40 border-purple-200';
      default:
        return 'border-l-4 border-l-slate-500 bg-slate-50 border-slate-200';
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

      {/* 2. Barra de Navegación del Calendario y Selector de Vistas (NK-125) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col xl:flex-row items-center justify-between gap-4">
        
        {/* Controles de Navegación y Fecha */}
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={handlePrev}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Anterior"
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
              onClick={handleNext}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
            {headerDateLabel}
          </h3>
        </div>

        {/* Pestañas de Vista (Día, Semana, Mes, Lista, Cobros) y Botón Nueva Cita */}
        <div className="flex flex-wrap items-center justify-between xl:justify-end gap-2 w-full xl:w-auto">
          
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 overflow-x-auto">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'day' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock size={13} className="text-cyan-600" />
              <span>Día</span>
            </button>

            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays size={13} className="text-blue-600" />
              <span>Semana</span>
            </button>

            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon size={13} className="text-indigo-600" />
              <span>Mes</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter size={13} className="text-slate-600" />
              <span>Lista</span>
            </button>

            <button
              onClick={() => setViewMode('payments')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'payments' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              <CreditCard size={13} className="text-purple-600" />
              <span>Cobros ({monthlyCustomerPayments.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedEvent({ date: toLocalDateStr(currentDate) });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-auto xl:ml-0"
          >
            <Plus size={16} />
            <span>Agendar Cita</span>
          </button>
        </div>

      </div>

      {/* 3. Contenido Principal según ViewMode */}

      {/* VISTA 1: DIARIA (CRONOGRAMA DE HORARIOS - ESTILO NEXUS AIR) */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-black text-slate-800">
                  {headerDateLabel}
                </h4>
                {toLocalDateStr(currentDate) === toLocalDateStr(new Date()) && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 border border-blue-200">
                    Hoy
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentDayEvents.length} cita(s) programada(s) · {currentDayPayments.length} cobro(s) asignado(s) a este día
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('week')}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Ver Semana
              </button>
              <button
                onClick={() => {
                  setSelectedEvent({ date: toLocalDateStr(currentDate) });
                  setIsModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>Agendar en este día</span>
              </button>
            </div>
          </div>

          {/* Banner de cobros del día si existen */}
          {currentDayPayments.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-white border border-purple-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-black text-purple-900">
                  <CreditCard size={16} className="text-purple-600" />
                  <span>Cobros Recurrentes para Hoy ({currentDayPayments.length} clientes)</span>
                </div>
                <span className="text-xs font-black text-purple-700">
                  Total: ${currentDayPayments.reduce((s, p) => s + p.total, 0).toLocaleString('es-CL')} CLP
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {currentDayPayments.map((p, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <div className="font-extrabold text-xs text-slate-800">{p.customer.company}</div>
                      <div className="text-[11px] text-purple-700 font-bold">${p.total.toLocaleString('es-CL')} CLP</div>
                      <div className="text-[10px] text-slate-400">{p.customer.name}</div>
                    </div>
                    <button
                      onClick={() => handleOpenWhatsAppPayment(p)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle size={13} />
                      <span>Cobrar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de citas de la jornada diaria */}
          {currentDayEvents.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                No hay citas agendadas para esta jornada
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                La jornada comercial está disponible. Puedes agendar demostraciones de software, reuniones de cierre o visitas a talleres.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedEvent({ date: toLocalDateStr(currentDate) });
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Programar Cita en Esta Fecha</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {currentDayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`bg-white p-4 rounded-2xl border shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 text-left ${getEventBorderClass(evt.type)}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200/60">
                        <Clock size={13} className="text-cyan-600" />
                        <span>{evt.time} {evt.endTime ? `- ${evt.endTime}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getEventTypeBadge(evt.type)}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          evt.status === 'completada' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {evt.status}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {evt.title}
                    </h4>

                    {evt.contact_name && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                        <Users size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{evt.contact_name}</span>
                      </div>
                    )}

                    {evt.location && (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    )}

                    {evt.notes && (
                      <div className="p-2.5 bg-white/90 border border-slate-200/60 rounded-xl text-xs text-slate-600 italic">
                        "{evt.notes}"
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    {evt.phone ? (
                      <a
                        href={`https://wa.me/${evt.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 text-xs font-bold text-emerald-600 hover:text-white hover:bg-emerald-500 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp</span>
                      </a>
                    ) : <div />}

                    <button
                      onClick={() => {
                        setSelectedEvent(evt);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Editar Cita
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: SEMANAL (CALENDARIO MULTICOLUMNA ESTILO NEXUS AIR) */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header de días de la semana */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/90 divide-x divide-slate-200 text-center">
            {weekDays.map((day) => {
              const dayEvents = eventsByDate[day.dateStr] || [];
              const dayPayments = monthlyCustomerPayments.filter(p => p.day === day.dateNumber && p.isCurrentMonth);
              const isSelected = toLocalDateStr(currentDate) === day.dateStr;

              return (
                <div 
                  key={day.dateStr}
                  onClick={() => setCurrentDate(day.date)}
                  className={`p-2 sm:p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-50/50' : 'hover:bg-slate-100/50'
                  }`}
                >
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    {day.dayName}
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentDate(day.date);
                        setViewMode('day');
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                        day.isToday 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : isSelected
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-800 hover:bg-slate-200'
                      }`}
                      title="Abrir vista diaria para este día"
                    >
                      {day.dateNumber}
                    </button>
                    {(dayEvents.length > 0 || dayPayments.length > 0) && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800">
                        {dayEvents.length + dayPayments.length}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cuadrícula de Contenido de la Semana */}
          <div className="grid grid-cols-7 divide-x divide-slate-200 min-h-[500px] bg-white">
            {weekDays.map((day) => {
              const dayEvents = eventsByDate[day.dateStr] || [];
              const dayPayments = monthlyCustomerPayments.filter(p => p.day === day.dateNumber && p.isCurrentMonth);

              return (
                <div 
                  key={day.dateStr}
                  className={`p-2 space-y-2 flex flex-col ${
                    day.isToday ? 'bg-blue-50/20' : ''
                  }`}
                >
                  {/* Cobros programados para este día */}
                  {dayPayments.map((p, idx) => (
                    <div 
                      key={`pay-${idx}`}
                      onClick={() => handleOpenWhatsAppPayment(p)}
                      className="p-1.5 rounded-lg border border-purple-200 bg-purple-50 text-[10px] text-purple-900 cursor-pointer hover:bg-purple-100 transition-colors"
                      title="Cobro mensual programado. Clic para contactar por WhatsApp."
                    >
                      <div className="font-extrabold flex items-center gap-1">
                        <CreditCard size={10} className="text-purple-600" />
                        <span>${p.total.toLocaleString('es-CL')}</span>
                      </div>
                      <div className="truncate text-slate-700 font-semibold">{p.customer.company}</div>
                    </div>
                  ))}

                  {/* Citas del día */}
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => {
                        setSelectedEvent(evt);
                        setIsModalOpen(true);
                      }}
                      className={`p-2 rounded-xl border hover:shadow-md transition-all cursor-pointer space-y-1 text-left group ${getEventBorderClass(evt.type)}`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[10px] font-mono font-bold text-slate-700">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-slate-400" />
                          {evt.time}
                        </span>
                        {getEventTypeBadge(evt.type)}
                      </div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2">
                        {evt.title}
                      </div>
                      {evt.contact_name && (
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <Users size={10} className="text-slate-400 shrink-0" />
                          <span className="truncate">{evt.contact_name}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {dayEvents.length === 0 && dayPayments.length === 0 && (
                    <div 
                      onClick={() => {
                        setSelectedEvent({ date: day.dateStr });
                        setIsModalOpen(true);
                      }}
                      className="h-full min-h-[110px] rounded-xl border border-dashed border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/30 flex flex-col items-center justify-center p-2 text-center text-slate-400 text-[11px] cursor-pointer group transition-all"
                    >
                      <Plus className="w-4 h-4 mb-1 opacity-0 group-hover:opacity-100 text-cyan-600 transition-opacity" />
                      <span className="group-hover:text-cyan-700 text-[10px]">Sin citas</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA 3: CALENDARIO MENSUAL */}
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
                    <button
                      onClick={() => {
                        if (day.dateStr) {
                          const [y, m, d] = day.dateStr.split('-').map(Number);
                          setCurrentDate(new Date(y, m - 1, d));
                          setViewMode('day');
                        }
                      }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 cursor-pointer ${
                        day.isToday 
                          ? 'bg-cyan-500 text-white shadow-xs' 
                          : day.isCurrentMonth ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-400'
                      }`}
                      title="Ir a vista diaria de este día"
                    >
                      {day.dateNumber}
                    </button>

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

      {/* VISTA 4: LISTA DE CITAS */}
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

      {/* VISTA 5: COBROS Y RENOVACIONES DEL MES (NK-125 & NK-126) */}
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
            onClearInitialCustomer?.();
          }}
          onSave={(data) => {
            onSaveEvent(data);
            setIsModalOpen(false);
            setSelectedEvent(null);
            onClearInitialCustomer?.();
          }}
          onDelete={(id) => {
            onDeleteEvent(id);
            setIsModalOpen(false);
            setSelectedEvent(null);
            onClearInitialCustomer?.();
          }}
        />
      )}

    </div>
  );
}
