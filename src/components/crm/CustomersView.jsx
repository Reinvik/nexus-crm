import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MessageCircle, 
  Calendar, 
  CreditCard, 
  Sparkles, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Filter,
  DollarSign,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import CustomerModal from './CustomerModal';

export default function CustomersView({ 
  customers = [], 
  onSaveCustomer, 
  onDeleteCustomer 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'cards'

  // Calcular métricas y KPIs globales (NK-128)
  const stats = useMemo(() => {
    const active = customers.filter(c => c.status === 'active');
    const totalBaseMRR = active.reduce((sum, c) => sum + (Number(c.base_fee) || 0), 0);
    const totalAddonsMRR = active.reduce((sum, c) => {
      const addonsSum = (c.additional_services || []).reduce((s, a) => s + (Number(a.price) || 0), 0);
      return sum + addonsSum;
    }, 0);
    const totalMRR = totalBaseMRR + totalAddonsMRR;
    const arpu = active.length > 0 ? Math.round(totalMRR / active.length) : 0;

    return {
      activeCount: active.length,
      totalCount: customers.length,
      totalBaseMRR,
      totalAddonsMRR,
      totalMRR,
      arpu
    };
  }, [customers]);

  // Filtrado de clientes
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.commune?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.rut?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // Generador de enlace de WhatsApp con mensaje personalizado (NK-126)
  const handleOpenWhatsApp = (customer, type = 'recordatorio') => {
    const cleanPhone = (customer.phone || '').replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      alert('El cliente no tiene un teléfono configurado.');
      return;
    }

    const totalMRR = (Number(customer.base_fee) || 0) + 
      ((customer.additional_services || []).reduce((s, a) => s + (Number(a.price) || 0), 0));

    let message = '';
    if (type === 'recordatorio') {
      message = `Hola ${customer.name}, te saludamos de Nexus Garage / Smartlean. Te escribimos para recordarte que el día ${customer.billing_day || 5} corresponde el cobro mensual de tu plan ${customer.plan_name || 'Nexus Garage'} ($${totalMRR.toLocaleString('es-CL')} CLP). ¿Te gustaría que te enviemos la cuenta para transferencia? ¡Quedamos atentos!`;
    } else if (type === 'seguimiento') {
      message = `Hola ${customer.name}, ¿cómo va todo en ${customer.company}? Te escribimos desde el equipo de Nexus Garage para saber si todo marcha bien con el sistema y si necesitas apoyo con el uso de inventarios o nuevas funciones. ¡Un saludo cordial!`;
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">🟢 Activo</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">🟡 Pendiente</span>;
      case 'paused':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">⏸️ Pausado</span>;
      case 'churned':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">🔴 Cancelado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header con Resumen de Rentabilidad y MRR (NK-128) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Clientes Activos */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Clientes Activos</span>
            <Users size={18} className="text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">{stats.activeCount}</span>
            <span className="text-xs text-slate-400 font-semibold">de {stats.totalCount} total</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1">100% Retención este mes</span>
        </div>

        {/* KPI 2: MRR Software Base */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">MRR Planes Base</span>
            <CreditCard size={18} className="text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800">
            ${stats.totalBaseMRR.toLocaleString('es-CL')}
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-1">Suscripción recurrente</span>
        </div>

        {/* KPI 3: MRR Addons (Servicios Adicionales) */}
        <div className="bg-white p-4 rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50/40 to-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">MRR Addons</span>
            <Sparkles size={18} className="text-cyan-500 animate-pulse" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-600">
            +${stats.totalAddonsMRR.toLocaleString('es-CL')}
          </div>
          <span className="text-[10px] text-cyan-600 font-semibold mt-1">
            Marketing, Ads y Soporte
          </span>
        </div>

        {/* KPI 4: Total MRR Combinado */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl border border-slate-700 shadow-md flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Ingreso Mensual Total</span>
            <TrendingUp size={18} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            ${stats.totalMRR.toLocaleString('es-CL')}
          </div>
          <span className="text-[10px] text-slate-300 font-medium mt-1">
            Base + Servicios Adicionales
          </span>
        </div>

        {/* KPI 5: ARPU (Ticket Promedio) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hidden lg:flex">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Ticket Promedio (ARPU)</span>
            <DollarSign size={18} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">
            ${stats.arpu.toLocaleString('es-CL')}
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-1">Facturación prom. x cliente</span>
        </div>

      </div>

      {/* 2. Barra de Herramientas, Búsqueda y Botón Nuevo Cliente */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Búsqueda */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por taller, dueño, teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
          />
        </div>

        {/* Filtros de Estado */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'all' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({customers.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'active' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Activos ({customers.filter(c => c.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'pending' 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Pendientes ({customers.filter(c => c.status === 'pending').length})
          </button>

          {/* Botón Crear Cliente */}
          <button
            onClick={() => {
              setSelectedCustomer(null);
              setIsModalOpen(true);
            }}
            className="ml-auto sm:ml-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Nuevo Cliente</span>
          </button>
        </div>

      </div>

      {/* 3. Tabla / Listado de Clientes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 size={36} className="mx-auto text-slate-300 mb-3" />
            <h4 className="text-sm font-bold text-slate-700 mb-1">No se encontraron clientes</h4>
            <p className="text-xs text-slate-400 mb-4">
              {searchTerm ? 'Intenta ajustando el término de búsqueda o filtro.' : 'Empieza agregando tu primer cliente activo a Nexus CRM.'}
            </p>
            <button
              onClick={() => {
                setSelectedCustomer(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Agregar Primer Cliente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Taller & Contacto</th>
                  <th className="py-3 px-4">Plan Base</th>
                  <th className="py-3 px-4">Servicios Adicionales (NK-128)</th>
                  <th className="py-3 px-4">Total Mensual (MRR)</th>
                  <th className="py-3 px-4">Día de Cobro</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCustomers.map(customer => {
                  const baseFee = Number(customer.base_fee) || 0;
                  const addons = customer.additional_services || [];
                  const addonsFee = addons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
                  const totalFee = baseFee + addonsFee;

                  return (
                    <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Taller y Contacto */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/60 flex items-center justify-center text-cyan-600 font-black text-xs shrink-0">
                            {customer.company?.substring(0, 2).toUpperCase() || 'TX'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-800 text-[13px] flex items-center gap-1.5">
                              {customer.company}
                              {customer.rut && (
                                <span className="text-[10px] text-slate-400 font-mono font-normal">
                                  ({customer.rut})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="font-medium text-slate-600">{customer.name}</span>
                              <span>·</span>
                              <span>{customer.commune || customer.city}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plan Base */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-700">
                          {customer.plan_name || 'Nexus Garage Básico'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-semibold">
                          ${baseFee.toLocaleString('es-CL')} /mes
                        </div>
                      </td>

                      {/* Servicios Adicionales (NK-128) */}
                      <td className="py-3.5 px-4">
                        {addons.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic">
                            Sin servicios adicionales
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex flex-wrap gap-1">
                              {addons.map(a => (
                                <span 
                                  key={a.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200"
                                  title={`${a.name}: $${Number(a.price).toLocaleString('es-CL')}`}
                                >
                                  {a.name} (+${Number(a.price).toLocaleString('es-CL')})
                                </span>
                              ))}
                            </div>
                            <div className="text-[11px] text-cyan-600 font-bold">
                              Subtotal Addons: +${addonsFee.toLocaleString('es-CL')} /mes
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Total Mensual (MRR) */}
                      <td className="py-3.5 px-4">
                        <div className="text-sm font-black text-slate-900">
                          ${totalFee.toLocaleString('es-CL')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">
                          CLP recurrente
                        </div>
                      </td>

                      {/* Día de Cobro (NK-126) */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                          <Calendar size={13} className="text-cyan-500" />
                          <span>Día {customer.billing_day || 5} de cada mes</span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(customer.status)}
                      </td>

                      {/* Acciones & Botón WhatsApp (NK-126) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Botón WhatsApp Recordatorio de Pago */}
                          <button
                            onClick={() => handleOpenWhatsApp(customer, 'recordatorio')}
                            className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-500 rounded-lg border border-emerald-200 hover:border-emerald-500 transition-colors cursor-pointer"
                            title="Enviar WhatsApp: Recordatorio de Cobro"
                          >
                            <MessageCircle size={15} />
                          </button>

                          {/* Botón WhatsApp Seguimiento */}
                          <button
                            onClick={() => handleOpenWhatsApp(customer, 'seguimiento')}
                            className="p-1.5 text-cyan-600 hover:text-white hover:bg-cyan-500 rounded-lg border border-cyan-200 hover:border-cyan-500 transition-colors cursor-pointer"
                            title="Enviar WhatsApp: Seguimiento de Satisfacción"
                          >
                            <Phone size={15} />
                          </button>

                          {/* Botón Editar Ficha */}
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar Ficha de Cliente"
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Botón Eliminar */}
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar cliente ${customer.company}?`)) {
                                onDeleteCustomer(customer.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar Cliente"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar Cliente */}
      {isModalOpen && (
        <CustomerModal
          customer={selectedCustomer}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
          onSave={(data) => {
            onSaveCustomer(data);
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
          onDelete={(id) => {
            onDeleteCustomer(id);
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
        />
      )}

    </div>
  );
}
