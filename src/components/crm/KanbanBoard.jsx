import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Globe, 
  Phone, 
  Calendar,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';

const STAGES = [
  { id: 'lead', name: 'Taller Identificado', color: 'bg-slate-100 border-t-slate-400 text-slate-700' },
  { id: 'contacto', name: 'Por Agendar Mentoría', color: 'bg-blue-50/50 border-t-blue-400 text-blue-700' },
  { id: 'demo', name: 'Mentoría Diagnóstica', color: 'bg-indigo-50/50 border-t-indigo-400 text-indigo-700' },
  { id: 'negociacion', name: 'Propuesta de Valor', color: 'bg-amber-50/50 border-t-amber-400 text-amber-700' },
  { id: 'ganado', name: 'Taller Integrado 🚀', color: 'bg-green-50/50 border-t-green-500 text-green-700' },
  { id: 'perdido', name: 'En Espera / Stand-by', color: 'bg-rose-50/50 border-t-rose-400 text-rose-700' },
];

export default function KanbanBoard({ leads, onUpdateLead, onOpenLeadModal, onAddNewLead }) {
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [communeFilter, setCommuneFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [webFilter, setWebFilter] = useState('all');

  // Drag & Drop State
  const [draggedId, setDraggedId] = useState(null);

  // Obtener comunas únicas para el filtro
  const communes = ['all', ...new Set(leads.map(l => l.commune).filter(Boolean))];

  // Aplicar filtros
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.commune.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCommune = communeFilter === 'all' || lead.commune === communeFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    const web = lead.website ? lead.website.trim().toLowerCase() : '';
    const hasNoWeb = !web || web === 'no tiene' || web === 'no';
    const matchesWeb = webFilter === 'all' || 
                       (webFilter === 'no_web' && hasNoWeb) || 
                       (webFilter === 'has_web' && !hasNoWeb);

    return matchesSearch && matchesCommune && matchesPriority && matchesWeb;
  });

  // Funciones de Drag & Drop nativo
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Permitir el drop
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (!id) return;

    const lead = leads.find(l => l.id === id);
    if (lead && lead.stage !== targetStage) {
      onUpdateLead({ ...lead, stage: targetStage });
    }
    setDraggedId(null);
  };

  // Enlace a WhatsApp
  const getWhatsAppLink = (lead) => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    let finalPhone = cleanPhone;
    if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) {
      finalPhone = '56' + cleanPhone;
    } else if (cleanPhone.length === 8) {
      finalPhone = '569' + cleanPhone;
    }
    
    const pitch = lead.pitch || 'Hola, me gustaría contactarte por Nexus Garage.';
    return `https://wa.me/${finalPhone}?text=${encodeURIComponent(pitch)}`;
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        
        {/* Buscador */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar taller o comuna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-slate-50/50"
          />
        </div>

        {/* Dropdowns Filtros */}
        <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
          
          {/* Comuna */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter size={14} />
            <select
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
            >
              <option value="all">Todas las Comunas</option>
              {communes.filter(c => c !== 'all').map(commune => (
                <option key={commune} value={commune}>{commune}</option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-slate-600"
          >
            <option value="all">Todas las Prioridades</option>
            <option value="Alta">Prioridad Alta</option>
            <option value="Media">Prioridad Media</option>
            <option value="Baja">Prioridad Baja</option>
          </select>

          {/* Sitio Web */}
          <select
            value={webFilter}
            onChange={(e) => setWebFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-slate-600"
          >
            <option value="all">Todos los sitios</option>
            <option value="no_web">Sin Sitio Web (Oportunidad)</option>
            <option value="has_web">Con Sitio Web</option>
          </select>

          {/* Botón Nuevo Lead */}
          <button
            onClick={onAddNewLead}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-500/10 cursor-pointer ml-auto md:ml-0"
          >
            <Plus size={16} /> Agregar Lead
          </button>
        </div>

      </div>

      {/* Tablero Kanban Desplazable */}
      <div className="flex gap-5 overflow-x-auto pb-6 pt-2 custom-scrollbar">
        {STAGES.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
          const stageValue = stageLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
          
          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="flex flex-col min-w-[285px] w-[285px] shrink-0 bg-slate-50 rounded-2xl border border-slate-200/50 p-3 shadow-sm transition-colors duration-200 kanban-column-height"
            >
              {/* Cabecera Columna */}
              <div className={`p-3.5 rounded-xl border-t-4 ${stage.color} mb-3.5 flex flex-col gap-1.5 shadow-sm bg-white border border-slate-100`}>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider truncate mr-1" title={stage.name}>
                    {stage.name}
                  </h4>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-full border border-slate-200/50 shrink-0">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold mt-1 pt-1.5 border-t border-slate-100">
                  <span>SaaS Garage</span>
                  <span className="text-slate-800 font-extrabold">${stageValue.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Lista de Tarjetas */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                {stageLeads.map(lead => {
                  const web = lead.website ? lead.website.trim().toLowerCase() : '';
                  const hasNoWeb = !web || web === 'no tiene' || web === 'no';
                  
                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => onOpenLeadModal(lead)}
                      className={`
                        glass-panel p-3.5 rounded-xl bg-white border border-slate-100/80 shadow-sm cursor-grab active:cursor-grabbing hover:border-cyan-200/80 transition-all duration-200 relative group
                        ${draggedId === lead.id ? 'opacity-40 border-dashed border-cyan-300' : ''}
                      `}
                    >
                      {/* Badge Comuna + Enlace Maps */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200/50">
                          {lead.commune}
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.name}, ${lead.commune}, Chile`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-slate-400 hover:text-cyan-600 font-semibold flex items-center gap-0.5 cursor-pointer"
                          title="Buscar en Google Maps"
                        >
                          <MapPin size={10} className="text-rose-500" />
                          <span className="text-[8px] font-extrabold">Ver Maps</span>
                        </a>
                      </div>

                      {/* Nombre Taller */}
                      <h5 className="font-extrabold text-sm text-slate-800 leading-tight mt-2 tracking-tight group-hover:text-cyan-700 transition-colors truncate">
                        {lead.name}
                      </h5>

                      {/* Info de Negocio */}
                      <div className="mt-2 text-xs flex justify-between items-center text-slate-500">
                        <span className="font-semibold">${(Number(lead.value) || 0).toLocaleString('es-CL')}</span>
                        
                        {/* Prioridad */}
                        <div className="flex gap-0.5 items-center">
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            lead.priority === 'Alta' ? 'bg-amber-100 text-amber-800' : 
                            lead.priority === 'Media' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {lead.priority}
                          </span>
                        </div>
                      </div>

                      {/* Sitio Web y Dirección en la parte inferior */}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {hasNoWeb ? (
                            <span className="text-[9px] font-extrabold bg-[#22c55e]/15 text-[#166534] px-1.5 py-0.5 rounded border border-[#22c55e]/30 flex items-center gap-0.5 select-none shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
                              SIN WEB
                            </span>
                          ) : (
                            <a 
                              href={lead.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[9px] font-bold text-cyan-600 hover:underline flex items-center gap-0.5 truncate max-w-[65px] shrink-0"
                              title={lead.website}
                            >
                              <Globe size={10} /> Web
                            </a>
                          )}
                          
                          <span className="text-slate-300 text-[10px] select-none">|</span>
                          
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.name}, ${lead.commune}, Chile`)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[9px] font-bold text-rose-600 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
                            title="Buscar dirección en Google Maps"
                          >
                            <MapPin size={10} /> Dir
                          </a>
                        </div>

                        {/* Botón WhatsApp */}
                        <div className="flex gap-1.5">
                          {lead.phone && (
                            <a
                              href={getWhatsAppLink(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-500 hover:text-white text-green-600 flex items-center justify-center transition-all cursor-pointer shadow-sm border border-green-100/50"
                              title="Enviar Pitch por WhatsApp"
                            >
                              <Phone size={12} />
                            </a>
                          )}
                          
                          {lead.nextVisitDate && (
                            <div 
                              className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100/50"
                              title={`Visita agendada: ${lead.nextVisitDate}`}
                            >
                              <Calendar size={12} />
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}

                {stageLeads.length === 0 && (
                  <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-xs">
                    Arrastra prospectos aquí
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
