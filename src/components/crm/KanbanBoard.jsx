import React, { useState, useEffect, useRef } from 'react';
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
  MapPin,
  Trash2
} from 'lucide-react';

const STAGES = [
  { id: 'lead', name: 'Taller Identificado', color: 'bg-slate-100 border-t-slate-400 text-slate-700' },
  { id: 'contacto', name: 'Por Agendar Mentoría', color: 'bg-blue-50/50 border-t-blue-400 text-blue-700' },
  { id: 'demo', name: 'Mentoría Diagnóstica', color: 'bg-indigo-50/50 border-t-indigo-400 text-indigo-700' },
  { id: 'negociacion', name: 'Propuesta de Valor', color: 'bg-amber-50/50 border-t-amber-400 text-amber-700' },
  { id: 'ganado', name: 'Taller Integrado 🚀', color: 'bg-green-50/50 border-t-green-500 text-green-700' },
  { id: 'perdido', name: 'En Espera / Stand-by', color: 'bg-rose-50/50 border-t-rose-400 text-rose-700' },
];

const normalizeText = (text) => {
  if (!text) return '';
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

// Componente Interno para Selección Múltiple de Comunas
function MultiSelectCommunes({ communes, selectedCommunes, onChange, leads }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCount = (commune) => {
    return leads.filter(l => l.commune === commune).length;
  };

  const filteredCommunes = communes
    .filter(c => c !== 'all')
    .filter(c => normalizeText(c).includes(normalizeText(search)));

  const handleToggle = (commune) => {
    if (selectedCommunes.includes(commune)) {
      onChange(selectedCommunes.filter(c => c !== commune));
    } else {
      onChange([...selectedCommunes, commune]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm min-w-[150px] justify-between h-7"
      >
        <div className="flex items-center gap-1 min-w-0">
          <Filter size={11} className="text-slate-400 shrink-0" />
          <span className="truncate max-w-[120px]">
            {selectedCommunes.length === 0 
              ? 'Todas las Comunas' 
              : selectedCommunes.length === 1 
                ? selectedCommunes[0] 
                : `${selectedCommunes.length} comunas`}
          </span>
        </div>
        <span className="text-[8px] text-slate-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 text-xs flex flex-col max-h-64">
          <div className="relative mb-2 shrink-0">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar comuna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-6 pr-2 py-0.5 border border-slate-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold bg-slate-50/50"
            />
          </div>

          <div className="flex justify-between items-center px-1 pb-1.5 border-b border-slate-100 mb-1.5 font-bold text-slate-500 shrink-0 select-none">
            <button 
              type="button" 
              onClick={() => onChange([])}
              className="hover:text-cyan-600 cursor-pointer"
            >
              Todas
            </button>
            {selectedCommunes.length > 0 && (
              <button 
                type="button" 
                onClick={() => onChange([])}
                className="hover:text-rose-500 cursor-pointer"
              >
                Limpiar ({selectedCommunes.length})
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
            {filteredCommunes.map(commune => {
              const isChecked = selectedCommunes.includes(commune);
              return (
                <label 
                  key={commune}
                  className="flex items-center justify-between px-1.5 py-1 hover:bg-slate-50 rounded-lg cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(commune)}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 w-3 h-3 cursor-pointer shrink-0"
                    />
                    <span className="font-semibold text-slate-700 truncate">{commune}</span>
                  </div>
                  <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1 py-0.2 rounded-full shrink-0">
                    {getCount(commune)}
                  </span>
                </label>
              );
            })}
            {filteredCommunes.length === 0 && (
              <p className="text-center text-slate-400 py-4 font-medium">No se encontraron comunas</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function KanbanBoard({ leads, onUpdateLead, onOpenLeadModal, onAddNewLead, onDeleteLead }) {
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommunes, setSelectedCommunes] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [webFilter, setWebFilter] = useState('all');
  const [weekendFilter, setWeekendFilter] = useState('all');

  // Drag & Drop State
  const [draggedId, setDraggedId] = useState(null);

  // Obtener comunas únicas para el filtro
  const communes = ['all', ...new Set(leads.map(l => l.commune).filter(Boolean))];

  // Aplicar filtros
  const filteredLeads = leads.filter(lead => {
    const searchNormalized = normalizeText(searchTerm);
    const matchesSearch = !searchTerm || 
                          normalizeText(lead.name).includes(searchNormalized) || 
                          normalizeText(lead.commune).includes(searchNormalized);
    
    const matchesCommune = selectedCommunes.length === 0 || selectedCommunes.includes(lead.commune);
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    const web = lead.website ? lead.website.trim().toLowerCase() : '';
    const hasNoWeb = !web || web === 'no tiene' || web === 'no';
    const matchesWeb = webFilter === 'all' || 
                       (webFilter === 'no_web' && hasNoWeb) || 
                       (webFilter === 'has_web' && !hasNoWeb);

    const matchesWeekend = weekendFilter === 'all' || 
                           (weekendFilter === 'open_weekends' && lead.openWeekends) ||
                           (weekendFilter === 'closed_weekends' && !lead.openWeekends);

    return matchesSearch && matchesCommune && matchesPriority && matchesWeb && matchesWeekend;
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
    <div className="space-y-3">
      {/* Barra de Filtros Compacta */}
      <div className="glass-panel py-1.5 px-3 rounded-xl bg-white border border-slate-100 flex flex-wrap gap-3 items-center justify-between shadow-sm text-xs relative z-30">
        
        {/* Buscador y Botón Agregar (Grupo Izquierdo) */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar taller o comuna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-slate-50/50 font-semibold"
            />
          </div>
          <button
            onClick={onAddNewLead}
            className="flex items-center gap-1 px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
          >
            <Plus size={14} /> Agregar Lead
          </button>
        </div>

        {/* Dropdowns Filtros (Grupo Derecho) */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          {/* Comuna */}
          <MultiSelectCommunes
            communes={communes}
            selectedCommunes={selectedCommunes}
            onChange={setSelectedCommunes}
            leads={leads}
          />

          {/* Prioridad */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-slate-600"
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
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-slate-600"
          >
            <option value="all">Todos los sitios</option>
            <option value="no_web">Sin Sitio Web (Oportunidad)</option>
            <option value="has_web">Con Sitio Web</option>
          </select>

          {/* Fines de Semana */}
          <select
            value={weekendFilter}
            onChange={(e) => setWeekendFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-slate-600"
          >
            <option value="all">Horario (Cualquiera)</option>
            <option value="open_weekends">Abre Fines de Semana</option>
            <option value="closed_weekends">Cerrado Fines de Semana</option>
          </select>
        </div>

      </div>

      {/* Tablero Kanban Desplazable */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 custom-scrollbar">
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
              <div className={`p-2.5 rounded-xl border-t-4 ${stage.color} mb-2 flex flex-col gap-1 shadow-sm bg-white border border-slate-100`}>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider truncate mr-1" title={stage.name}>
                    {stage.name}
                  </h4>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-full border border-slate-200/50 shrink-0">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold mt-1 pt-1 border-t border-slate-100">
                  <span>SaaS Garage</span>
                  <span className="text-slate-800 font-extrabold">${stageValue.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Lista de Tarjetas */}
              <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                {stageLeads.slice(0, 50).map(lead => {
                  const web = lead.website ? lead.website.trim().toLowerCase() : '';
                  const hasNoWeb = !web || web === 'no tiene' || web === 'no';
                  
                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => onOpenLeadModal(lead)}
                      className={`
                        glass-panel p-2.5 rounded-xl bg-white border border-slate-100/80 shadow-sm cursor-grab active:cursor-grabbing hover:border-cyan-200/80 transition-all duration-200 relative group
                        ${draggedId === lead.id ? 'opacity-40 border-dashed border-cyan-300' : ''}
                      `}
                    >
                      {/* Badge Comuna + Enlace Maps */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200/50">
                            {lead.commune}
                          </span>
                          {lead.openWeekends && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200/30 select-none">
                              Sáb/Dom
                            </span>
                          )}
                        </div>
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
                      <h5 className="font-extrabold text-xs text-slate-800 leading-tight mt-1.5 tracking-tight group-hover:text-cyan-700 transition-colors truncate">
                        {lead.name}
                      </h5>

                      {/* Info de Negocio */}
                      <div className="mt-1 text-xs flex justify-between items-center text-slate-500">
                        <span className="font-semibold text-[11px]">${(Number(lead.value) || 0).toLocaleString('es-CL')}</span>
                        
                        {/* Prioridad */}
                        <div className="flex gap-0.5 items-center">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            lead.priority === 'Alta' ? 'bg-amber-100 text-amber-800' : 
                            lead.priority === 'Media' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {lead.priority}
                          </span>
                        </div>
                      </div>

                      {/* Sitio Web y Dirección en la parte inferior */}
                      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {hasNoWeb ? (
                            <span className="text-[8px] font-extrabold bg-[#22c55e]/15 text-[#166534] px-1.5 py-0.5 rounded border border-[#22c55e]/30 flex items-center gap-0.5 select-none shrink-0">
                              <span className="w-1 h-1 rounded-full bg-[#22c55e] animate-pulse"></span>
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

                        {/* Botón Acciones */}
                        <div className="flex gap-1">
                          {lead.phone && (
                            <a
                              href={getWhatsAppLink(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-500 hover:text-white text-green-600 flex items-center justify-center transition-all cursor-pointer shadow-sm border border-green-100/50"
                              title="Enviar Pitch por WhatsApp"
                            >
                              <Phone size={11} />
                            </a>
                          )}
                          
                          {lead.nextVisitDate && (
                            <div 
                              className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100/50"
                              title={`Visita agendada: ${lead.nextVisitDate}`}
                            >
                              <Calendar size={11} />
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`¿Estás seguro de eliminar permanentemente a "${lead.name}"?`)) {
                                onDeleteLead(lead.id);
                              }
                            }}
                            className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 flex items-center justify-center transition-all cursor-pointer shadow-sm border border-rose-100/50"
                            title="Eliminar Prospecto"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}

                {stageLeads.length > 50 && (
                  <div className="bg-slate-100/80 border border-slate-200/50 rounded-xl p-3 text-center text-[10px] text-slate-500 font-bold select-none mt-2">
                    ⚡ Mostrando primeras 50 de {stageLeads.length} tarjetas. Usa los filtros de comuna o el buscador para ver más.
                  </div>
                )}

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
