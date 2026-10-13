import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  FileText, 
  Save, 
  Trash2, 
  CheckCircle2, 
  Video, 
  DollarSign 
} from 'lucide-react';

const EVENT_TYPES = [
  { id: 'demo', label: 'Demostración de Software', color: 'bg-cyan-500' },
  { id: 'reunion', label: 'Reunión Comercial', color: 'bg-blue-500' },
  { id: 'visita', label: 'Visita en Terreno (Taller)', color: 'bg-emerald-500' },
  { id: 'llamada', label: 'Llamada de Prospección', color: 'bg-amber-500' },
  { id: 'cobro', label: 'Cobro / Facturación Mensual', color: 'bg-purple-500' },
  { id: 'seguimiento', label: 'Seguimiento de Satisfacción', color: 'bg-indigo-500' },
];

export default function EventModal({ 
  event, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  customers = [], 
  leads = [] 
}) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    type: 'demo',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    endTime: '11:00',
    contact_name: '',
    phone: '',
    location: '',
    status: 'pendiente',
    notes: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        id: event.id || '',
        title: event.title || '',
        type: event.type || 'demo',
        date: event.date || new Date().toISOString().split('T')[0],
        time: event.time || '10:00',
        endTime: event.endTime || '11:00',
        contact_name: event.contact_name || '',
        phone: event.phone || '',
        location: event.location || '',
        status: event.status || 'pendiente',
        notes: event.notes || '',
      });
    } else {
      setFormData({
        id: '',
        title: '',
        type: 'demo',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        endTime: '11:00',
        contact_name: '',
        phone: '',
        location: '',
        status: 'pendiente',
        notes: '',
      });
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSelectContact = (contactId) => {
    if (!contactId) return;
    const cust = customers.find(c => c.id === contactId);
    if (cust) {
      setFormData(prev => ({
        ...prev,
        contact_name: `${cust.name} (${cust.company})`,
        phone: cust.phone || '',
        location: cust.address ? `${cust.address}, ${cust.commune}` : prev.location
      }));
      return;
    }

    const lead = leads.find(l => l.id === contactId);
    if (lead) {
      setFormData(prev => ({
        ...prev,
        contact_name: lead.name,
        phone: lead.phone || '',
        location: lead.address || prev.location
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) {
      alert('Por favor ingresa un título y una fecha para la cita.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-xl overflow-hidden flex flex-col my-6">
        
        {/* Cabecera */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {formData.id ? 'Editar Cita / Compromiso' : 'Agendar Nueva Cita'}
              </h3>
              <p className="text-xs text-slate-300">
                Nexus Agenda · Reuniones, Demos y Seguimientos
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-700">
          
          {/* Título de la Cita */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Título de la Cita / Compromiso *</label>
            <input
              type="text"
              required
              placeholder="Ej: Demo Sistema de Control de Stock y WhatsApp"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Tipo de Evento & Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Evento</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none font-medium"
              >
                {EVENT_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Estado de la Cita</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none font-medium"
              >
                <option value="pendiente">⏳ Pendiente</option>
                <option value="completada">✅ Realizada con Éxito</option>
                <option value="reprogramada">🔄 Reprogramada</option>
                <option value="cancelada">❌ Cancelada</option>
              </select>
            </div>
          </div>

          {/* Fecha, Hora Inicio y Hora Fin */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Fecha *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Hora Inicio</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Hora Fin</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none font-medium"
              />
            </div>
          </div>

          {/* Vincular Cliente o Prospecto Rápido */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Vincular Cliente o Lead (Opcional)</label>
            <select
              onChange={(e) => handleSelectContact(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none mb-2"
              defaultValue=""
            >
              <option value="">-- Seleccionar de la base de datos --</option>
              <optgroup label="Clientes Activos">
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                ))}
              </optgroup>
              <optgroup label="Prospectos / Leads">
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.name} - {l.commune}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Contacto & Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nombre del Contacto</label>
              <input
                type="text"
                placeholder="Ej: Roberto Guerrero"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Teléfono / WhatsApp</label>
              <input
                type="text"
                placeholder="+56 9 8765 4001"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Lugar / Dirección o Enlace Meet */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Lugar de Reunión / Enlace Meet</label>
            <input
              type="text"
              placeholder="Ej: Av. Grecia 3510, Ñuñoa o meet.google.com/xyz"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Notas y Temario */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Notas y Puntos a Tratar</label>
            <textarea
              rows="2"
              placeholder="Objetivos de la reunión, objeciones esperadas, material a llevar..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {formData.id && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Eliminar esta cita de la agenda?')) {
                    onDelete(formData.id);
                  }
                }}
                className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                Eliminar Cita
              </button>
            ) : <div />}

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
                Guardar Cita
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
