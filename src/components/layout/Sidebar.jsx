import React from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Map, 
  Settings, 
  X, 
  ShieldCheck, 
  TrendingUp, 
  LogOut, 
  Users, 
  ScrollText, 
  PhoneCall, 
  Navigation
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ currentView, setCurrentView, isOpen, setIsOpen }) {
  const { session, logout } = useAuth();
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', name: 'Embudo de Ventas', icon: KanbanSquare },
    { id: 'routing', name: 'Planificador de Ruta', icon: Navigation },
    { id: 'hunter', name: 'Nexus Hunter', icon: Map },
    { id: 'personas', name: 'Buyer Personas', icon: Users },
    { id: 'playbook', name: 'Playbook de Cierre', icon: ScrollText },
    { id: 'sales-guide', name: 'Asistente de Ventas', icon: PhoneCall },
    { id: 'settings', name: 'Configuración', icon: Settings },
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Contenedor Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#070b19] text-slate-300 z-50 flex flex-col justify-between
        transform lg:transform-none lg:static transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Cabecera */}
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-[#040712]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                <TrendingUp size={18} className="animate-pulse" />
              </div>
              <div>
                <h1 className="font-black text-lg text-white tracking-tight">NEXUS <span className="text-cyan-400">CRM</span></h1>
                <p className="text-[10px] text-cyan-400 font-semibold tracking-wider -mt-1">SMARTLEAN.CL</p>
              </div>
            </div>
            
            {/* Cerrar en móvil */}
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menú */}
          <nav className="p-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 font-semibold' 
                      : 'hover:bg-slate-800/60 hover:text-slate-100'}
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#040712]/50">
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-800/40 rounded-xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-cyan-600/30 flex items-center justify-center text-cyan-400 shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{session?.user?.name || 'Propietario'}</p>
                <p className="text-[9px] text-cyan-400 font-medium truncate">Propietario Nexus</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-1.5 hover:bg-slate-700/60 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Cerrar Sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
