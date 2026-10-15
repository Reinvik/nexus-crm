import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Plus, 
  Trash2, 
  Sparkles, 
  DollarSign, 
  Layers, 
  Save, 
  AlertCircle 
} from 'lucide-react';

const PLAN_PRESETS = [
  { id: 'basico', name: 'Nexus Garage - Básico', price: 45000, desc: 'Gestión de OT, clientes e inventario base' },
  { id: 'pro', name: 'Nexus Garage - Pro', price: 75000, desc: 'Stock avanzado, multi-mecánicos y WhatsApp bot' },
  { id: 'enterprise', name: 'Nexus Garage - Enterprise', price: 150000, desc: 'Multi-sucursal, reportes avanzados y soporte 24/7' },
  { id: 'custom', name: 'Plan Personalizado', price: 0, desc: 'Tarifa acordada a medida' }
];

const ADDON_PRESETS = [
  { name: 'Manejo Web & Google Business', category: 'marketing', price: 35000 },
  { name: 'Campaña Meta Ads (Captación)', category: 'publicidad', price: 45000 },
  { name: 'Campaña Google Ads (Búsquedas)', category: 'publicidad', price: 55000 },
  { name: 'Integración WhatsApp Notificaciones', category: 'integracion', price: 20000 },
  { name: 'Soporte Prioritario & Capacitación 1 a 1', category: 'soporte', price: 30000 },
];

export default function CustomerModal({ customer, isOpen, onClose, onSave, onDelete, onScheduleMeeting }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    company: '',
    rut: '',
    phone: '',
    email: '',
    address: '',
    commune: 'Santiago (Centro)',
    city: 'Santiago',
    status: 'active',
    plan: 'basico',
    plan_name: 'Nexus Garage - Básico',
    base_fee: 45000,
    billing_day: 5,
    payment_method: 'transferencia',
    notes: '',
    additional_services: []
  });

  const [newAddon, setNewAddon] = useState({
    name: '',
    category: 'marketing',
    price: 35000,
    recurrence: 'mensual',
    notes: ''
  });

  const [showAddonForm, setShowAddonForm] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id || '',
        name: customer.name || '',
        company: customer.company || '',
        rut: customer.rut || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        commune: customer.commune || 'Santiago (Centro)',
        city: customer.city || 'Santiago',
        status: customer.status || 'active',
        plan: customer.plan || 'basico',
        plan_name: customer.plan_name || 'Nexus Garage - Básico',
        base_fee: customer.base_fee !== undefined ? customer.base_fee : 45000,
        billing_day: customer.billing_day || 5,
        payment_method: customer.payment_method || 'transferencia',
        notes: customer.notes || '',
        additional_services: customer.additional_services || []
      });
    } else {
      setFormData({
        id: '',
        name: '',
        company: '',
        rut: '',
        phone: '+56 9 ',
        email: '',
        address: '',
        commune: 'Santiago (Centro)',
        city: 'Santiago',
        status: 'active',
        plan: 'basico',
        plan_name: 'Nexus Garage - Básico',
        base_fee: 45000,
        billing_day: 5,
        payment_method: 'transferencia',
        notes: '',
        additional_services: []
      });
    }
  }, [customer]);

  if (!isOpen) return null;

  const handlePlanChange = (e) => {
    const selectedPlanId = e.target.value;
    const preset = PLAN_PRESETS.find(p => p.id === selectedPlanId);
    if (preset) {
      setFormData(prev => ({
        ...prev,
        plan: preset.id,
        plan_name: preset.name,
        base_fee: preset.id === 'custom' ? prev.base_fee : preset.price
      }));
    }
  };

  const handleAddService = () => {
    if (!newAddon.name.trim() || Number(newAddon.price) <= 0) return;
    const addon = {
      id: `addon-${Date.now()}`,
      name: newAddon.name.trim(),
      category: newAddon.category,
      price: Number(newAddon.price),
      recurrence: newAddon.recurrence || 'mensual',
      notes: newAddon.notes || ''
    };
    setFormData(prev => ({
      ...prev,
      additional_services: [...(prev.additional_services || []), addon]
    }));
    setNewAddon({
      name: '',
      category: 'marketing',
      price: 35000,
      recurrence: 'mensual',
      notes: ''
    });
    setShowAddonForm(false);
  };

  const handleRemoveService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      additional_services: (prev.additional_services || []).filter(s => s.id !== serviceId)
    }));
  };

  const handleApplyAddonPreset = (preset) => {
    setNewAddon(prev => ({
      ...prev,
      name: preset.name,
      category: preset.category,
      price: preset.price
    }));
  };

  const totalAddons = (formData.additional_services || []).reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const totalMonthlyMRR = Number(formData.base_fee || 0) + totalAddons;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim()) {
      alert('Por favor indica al menos el nombre de contacto y el nombre de la empresa / taller.');
      return;
    }
    const customerId = (formData.id && String(formData.id).trim() !== '')
      ? String(formData.id).trim()
      : `cust-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    onSave({
      ...formData,
      id: customerId
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-3xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {formData.id ? 'Editar Ficha de Cliente' : 'Nuevo Cliente & Suscripción'}
              </h3>
              <p className="text-xs text-slate-300">
                Nexus CRM · Convenios, Servicios Adicionales y Cobranza
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido Formulario Scrolleable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-700">
          
          {/* Fila 1: Datos Generales */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User size={14} className="text-cyan-500" />
              Información del Cliente y Taller
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Empresa / Taller *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Taller Mecánico San Cristóbal"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nombre del Contacto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Mora (Dueño / Administrador)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">RUT Empresa / Persona</label>
                <input
                  type="text"
                  placeholder="Ej: 76.452.910-K"
                  value={formData.rut}
                  onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Teléfono / WhatsApp *</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="+56 9 8765 4321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    placeholder="contacto@taller.cl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Estado de la Cuenta</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
                >
                  <option value="active">🟢 Activo / Al día</option>
                  <option value="pending">🟡 Pendiente de Pago</option>
                  <option value="paused">⏸️ En Pausa</option>
                  <option value="churned">🔴 Cancelado / Churned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Dirección del Taller</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Av. Recoleta 1420"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Comuna</label>
                <input
                  type="text"
                  placeholder="Recoleta, Ñuñoa, Santiago..."
                  value={formData.commune}
                  onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Fila 2: Plan Base y Facturación (NK-126) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CreditCard size={14} className="text-cyan-500" />
              Plan Base de Software y Convenio
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Plan de Suscripción</label>
                <select
                  value={formData.plan}
                  onChange={handlePlanChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl font-medium focus:border-cyan-500 outline-none"
                >
                  {PLAN_PRESETS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Valor Mensual Base ($ CLP)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.base_fee}
                    onChange={(e) => setFormData({ ...formData, base_fee: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Día de Cobro Mensual (1 - 31)</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.billing_day}
                    onChange={(e) => setFormData({ ...formData, billing_day: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-cyan-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Día del mes para facturación y cobro recurrente.</p>
              </div>
            </div>
          </div>

          {/* Fila 3: Servicios Adicionales (NK-128) */}
          <div className="bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/30 p-4.5 rounded-xl border border-cyan-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-500" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">
                    Servicios Adicionales (Addons)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Suma de marketing, integraciones o soporte dedicado a la tarifa mensual.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddonForm(!showAddonForm)}
                className="px-3 py-1.5 text-xs font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                {showAddonForm ? 'Cerrar' : 'Agregar Servicio'}
              </button>
            </div>

            {/* Formulario desplegable para agregar nuevo servicio */}
            {showAddonForm && (
              <div className="p-4 bg-white rounded-xl border border-cyan-200 mb-4 shadow-sm animate-fadeIn">
                <p className="text-xs font-bold text-slate-700 mb-2">Plantillas rápidas sugeridas:</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {ADDON_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyAddonPreset(p)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-cyan-100 text-slate-700 hover:text-cyan-800 rounded-md transition-colors"
                    >
                      {p.name} (${p.price.toLocaleString('es-CL')})
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nombre del Servicio Adicional</label>
                    <input
                      type="text"
                      placeholder="Ej: Gestión de Redes Sociales y WhatsApp Bot"
                      value={newAddon.name}
                      onChange={(e) => setNewAddon({ ...newAddon, name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Monto Mensual ($ CLP)</label>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={newAddon.price}
                      onChange={(e) => setNewAddon({ ...newAddon, price: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddonForm(false)}
                    className="px-3 py-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Guardar Addon
                  </button>
                </div>
              </div>
            )}

            {/* Lista de addons actuales */}
            {(!formData.additional_services || formData.additional_services.length === 0) ? (
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 text-center text-xs text-slate-400">
                Este cliente solo cuenta con su plan base. Haz clic en "Agregar Servicio" para añadir addons adicionales (publicidad, integraciones, etc.).
              </div>
            ) : (
              <div className="space-y-2">
                {formData.additional_services.map((addon) => (
                  <div
                    key={addon.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs hover:border-cyan-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-xs">
                        +
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{addon.name}</h5>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {addon.category || 'Servicio'} · Facturación {addon.recurrence || 'mensual'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-cyan-600">
                        +${Number(addon.price).toLocaleString('es-CL')} /mes
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(addon.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-colors"
                        title="Eliminar servicio"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Resumen Total MRR de este cliente */}
            <div className="mt-4 pt-3 border-t border-cyan-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="space-y-0.5">
                <div className="text-slate-500 font-medium text-[11px]">
                  Plan Base: <span className="font-bold text-slate-800">${Number(formData.base_fee).toLocaleString('es-CL')}</span> + Addons: <span className="font-bold text-cyan-600">${totalAddons.toLocaleString('es-CL')}</span>
                </div>
                <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span>Facturación Total Mensual:</span>
                  <span className="text-cyan-600 text-base font-black">
                    ${totalMonthlyMRR.toLocaleString('es-CL')} <span className="text-[10px] font-bold text-slate-500">CLP/mes</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Fila 4: Notas / Convenios Especiales */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Notas de Convenio y Acuerdos Especiales</label>
            <textarea
              rows="3"
              placeholder="Detalles sobre fechas de gracia, acuerdo de comisiones o requerimientos especiales..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none transition-all"
            />
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {formData.id && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Estás seguro de eliminar al cliente ${formData.company}?`)) {
                      onDelete(formData.id);
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  Eliminar Cliente
                </button>
              )}

              {formData.id && onScheduleMeeting && (
                <button
                  type="button"
                  onClick={() => {
                    onScheduleMeeting(customer || formData);
                    onClose();
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Configurar reunión programada en la agenda"
                >
                  <Calendar size={14} className="text-cyan-600" />
                  Agendar Reunión
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save size={14} />
                Guardar Cliente
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
