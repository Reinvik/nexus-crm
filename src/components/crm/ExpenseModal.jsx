import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Server, 
  Bot, 
  Sparkles, 
  Truck, 
  HelpCircle, 
  Calendar, 
  CreditCard, 
  Save, 
  Trash2, 
  Receipt 
} from 'lucide-react';

export const EXPENSE_CATEGORIES = [
  { 
    id: 'servidores', 
    label: 'Servidores & Infraestructura', 
    icon: Server, 
    color: 'text-blue-500 bg-blue-50 border-blue-200',
    desc: 'Vercel, Supabase, Dominios, Cloudflare' 
  },
  { 
    id: 'ia_apis', 
    label: 'APIs & Modelos de IA', 
    icon: Bot, 
    color: 'text-purple-500 bg-purple-50 border-purple-200',
    desc: 'OpenAI, Gemini, Anthropic, Embeddings' 
  },
  { 
    id: 'marketing', 
    label: 'Publicidad & Marketing', 
    icon: Sparkles, 
    color: 'text-pink-500 bg-pink-50 border-pink-200',
    desc: 'Meta Ads, Google Ads, Campañas' 
  },
  { 
    id: 'traslados', 
    label: 'Traslados & Visitas en Terreno', 
    icon: Truck, 
    color: 'text-amber-500 bg-amber-50 border-amber-200',
    desc: 'Combustible, Peajes / TAG, Metro / Uber' 
  },
  { 
    id: 'otros', 
    label: 'Otros Gastos Operativos', 
    icon: HelpCircle, 
    color: 'text-slate-500 bg-slate-50 border-slate-200',
    desc: 'Equipamiento, Insumos administrativos' 
  },
];

export default function ExpenseModal({
  expense,
  isOpen,
  onClose,
  onSave,
  onDelete
}) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'servidores',
    amount: '',
    currency: 'CLP',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    payment_method: 'tarjeta',
    notes: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        id: expense.id || '',
        title: expense.title || '',
        category: expense.category || 'servidores',
        amount: expense.amount || '',
        currency: expense.currency || 'CLP',
        date: expense.date || new Date().toISOString().split('T')[0],
        vendor: expense.vendor || '',
        payment_method: expense.payment_method || 'tarjeta',
        notes: expense.notes || ''
      });
    } else {
      setFormData({
        id: '',
        title: '',
        category: 'servidores',
        amount: '',
        currency: 'CLP',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        payment_method: 'tarjeta',
        notes: ''
      });
    }
  }, [expense]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || Number(formData.amount) <= 0) {
      alert('Por favor ingresa una descripción y un monto válido para el gasto.');
      return;
    }
    const cat = EXPENSE_CATEGORIES.find(c => c.id === formData.category);
    onSave({
      ...formData,
      amount: Number(formData.amount),
      category_label: cat ? cat.label : formData.category
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col my-6">
        
        {/* Cabecera */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {formData.id ? 'Editar Gasto Operativo' : 'Registrar Gasto Operativo'}
              </h3>
              <p className="text-xs text-slate-300">
                Nexus Finanzas · Costos de Infraestructura, APIs y Operación
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
          
          {/* Título o Concepto */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Descripción / Concepto *</label>
            <input
              type="text"
              required
              placeholder="Ej: Consumo API OpenAI GPT-4o o Supabase Pro"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Categoría de Gasto */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Categoría de Gasto (NK-127)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXPENSE_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-xs ring-1 ring-cyan-500/30' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} className={isSelected ? 'text-cyan-600 mt-0.5' : 'text-slate-400 mt-0.5'} />
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-cyan-900' : 'text-slate-700'}`}>
                        {cat.label}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {cat.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monto y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Monto ($ CLP) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  placeholder="25000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Fecha del Gasto</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none font-medium"
              />
            </div>
          </div>

          {/* Proveedor y Método de Pago */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Proveedor / Plataforma</label>
              <input
                type="text"
                placeholder="Ej: Google Cloud, OpenAI, Copec, Vercel"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Medio de Pago</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-cyan-500 outline-none font-medium"
              >
                <option value="tarjeta">💳 Tarjeta de Crédito / Débito</option>
                <option value="transferencia">🏦 Transferencia Bancaria</option>
                <option value="efectivo">💵 Efectivo / Caja Chica</option>
              </select>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Notas Adicionales</label>
            <textarea
              rows="2"
              placeholder="Detalles de facturación, comprobante o desglose de tokens..."
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
                  if (confirm('¿Eliminar este registro de gasto?')) {
                    onDelete(formData.id);
                  }
                }}
                className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                Eliminar Gasto
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
                Guardar Gasto
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
