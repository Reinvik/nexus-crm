import React from 'react';
import { 
  Users, 
  TrendingUp, 
  MonitorOff, 
  CalendarDays,
  Target,
  ArrowUpRight
} from 'lucide-react';

export default function Dashboard({ leads, onNavigate }) {
  // Cálculos de métricas
  const totalLeads = leads.length;
  
  // Leads activos (excluyendo perdidos y ganados)
  const activeLeads = leads.filter(l => l.stage !== 'ganado' && l.stage !== 'perdido');
  const pipelineValue = activeLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  
  // Tasa de conversión
  const wonLeads = leads.filter(l => l.stage === 'ganado').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;
  
  // Demos programadas
  const demoLeads = leads.filter(l => l.stage === 'demo').length;
  
  // Sin sitio web
  const noWebsiteLeads = leads.filter(l => {
    const web = l.website ? l.website.trim().toLowerCase() : '';
    return !web || web === 'no tiene' || web === 'no';
  }).length;
  const noWebsitePct = totalLeads > 0 ? ((noWebsiteLeads / totalLeads) * 100).toFixed(0) : 0;

  // Distribución por Comuna
  const communeMap = {};
  leads.forEach(l => {
    const commune = l.commune || 'No Definida';
    communeMap[commune] = (communeMap[commune] || 0) + 1;
  });
  
  const communesSorted = Object.entries(communeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Próximas actividades (leads que tienen fecha de nueva visita)
  const upcomingVisits = leads
    .filter(l => l.nextVisitDate)
    .sort((a, b) => new Date(a.nextVisitDate) - new Date(b.nextVisitDate))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Pipeline Value */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Valor del Pipeline</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              ${pipelineValue.toLocaleString('es-CL')}
            </h3>
            <p className="text-slate-400 text-xs mt-1 font-medium">Ingreso potencial de leads activos</p>
          </div>
        </div>

        {/* KPI 2: Total Leads */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Prospectos</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{totalLeads}</h3>
            <p className="text-slate-400 text-xs mt-1 font-medium">Registrados en la base de datos</p>
          </div>
        </div>

        {/* KPI 3: Tasa de Conversión */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Conversión SaaS</span>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Target size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{conversionRate}%</h3>
            <p className="text-slate-400 text-xs mt-1 font-medium">{wonLeads} talleres ganados en Nexus Garage</p>
          </div>
        </div>

        {/* KPI 4: Oportunidad (Sin Sitio Web) */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Oportunidad Web</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <MonitorOff size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{noWebsitePct}%</h3>
            <p className="text-slate-400 text-xs mt-1 font-medium">{noWebsiteLeads} prospectos no tienen sitio web</p>
          </div>
        </div>

      </div>

      {/* Grid de Reportes Detallados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reporte Comunas */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 lg:col-span-2">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight mb-4">Talleres por Comuna (Top 5)</h3>
          <div className="space-y-4">
            {communesSorted.map(([commune, count]) => {
              const percentage = totalLeads > 0 ? ((count / totalLeads) * 100) : 0;
              return (
                <div key={commune} className="space-y-1">
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                    <span>{commune}</span>
                    <span className="text-slate-500">{count} talleres ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {communesSorted.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-6">No hay leads registrados aún.</p>
            )}
          </div>
        </div>

        {/* Próximas Actividades */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Ruta de Visitas</h3>
            <button 
              onClick={() => onNavigate('kanban')} 
              className="text-xs text-cyan-600 hover:text-cyan-800 font-bold flex items-center gap-0.5"
            >
              Ver Kanban <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingVisits.map(lead => (
              <div 
                key={lead.id} 
                className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors border border-slate-100"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0 mt-0.5">
                  <CalendarDays size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{lead.name}</p>
                  <p className="text-xs text-slate-400 font-semibold">{lead.commune}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-bold">
                      {lead.nextVisitDate}
                    </span>
                    <span className="text-[10px] text-cyan-600 font-bold">
                      {lead.nextVisitTime || 'Sin hora'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {upcomingVisits.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <CalendarDays size={32} className="mx-auto mb-2 opacity-35" />
                <p className="text-sm font-semibold">No hay visitas de seguimiento agendadas</p>
                <p className="text-xs">Usa el Kanban para planificar actividades.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
