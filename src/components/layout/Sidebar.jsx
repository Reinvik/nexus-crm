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
  Navigation,
  RefreshCw,
  Camera,
  User,
  Layers
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

  const userName = session?.user?.name || 'Propietario';
  const userEmail = session?.user?.email || 'propietario@nexusgarage.cl';
  const userRole = session?.user?.role === 'nexusowner' ? 'Super Admin' : 'Administrador';

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Contenedor Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-[265px] bg-[#050811] text-slate-300 z-50 flex flex-col justify-between
        transform lg:transform-none lg:static transition-transform duration-300 ease-in-out border-r border-white/[0.03]
        shadow-[10px_0_40px_rgba(0,0,0,0.3)] select-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Superior */}
        <div>
          {/* Header de Marca Smartlean */}
          <div className="p-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-[0_4px_14px_rgba(6,182,212,0.35)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <Layers size={18} className="font-black" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-extrabold text-[19px] text-white tracking-tight leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  NEXUS <span className="text-[#00d2ff]">CRM</span>
                </h1>
                <span className="text-[9px] font-black text-[#00d2ff] tracking-[0.16em] uppercase mt-1 drop-shadow-[0_0_10px_rgba(0,210,255,0.4)]">
                  BY SMARTLEAN
                </span>
              </div>
            </div>
            
            {/* Cerrar en móvil */}
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 lg:hidden transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Categoría */}
          <div className="px-6 pt-4 pb-2 text-[10px] font-extrabold text-[#475569] tracking-[0.15em] uppercase">
            MENÚ PRINCIPAL
          </div>

          {/* Menú de Navegación */}
          <nav className="px-3 space-y-1">
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
                    group relative w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-[13.5px] transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-white font-bold' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] hover:translate-x-1'}
                  `}
                >
                  {/* Píldora activa neón */}
                  {isActive && (
                    <span className="absolute left-0 top-[15%] h-[70%] w-1 bg-[#00d2ff] rounded-r-md shadow-[0_0_10px_#00d2ff]" />
                  )}

                  <Icon 
                    size={18} 
                    className={`transition-colors duration-200 ${
                      isActive 
                        ? 'text-[#00d2ff]' 
                        : 'text-slate-400 group-hover:text-[#00d2ff]'
                    }`} 
                  />
                  <span className={isActive ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.35)]' : 'group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]'}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar - Usuario Activo Estilo Smartlean */}
        <div className="p-4 border-t border-white/[0.04] bg-[#040712]/60">
          <div className="flex items-center gap-3 mb-3 px-1">
            {/* Avatar circular con badge de cámara flotante */}
            <div 
              className="relative group cursor-pointer shrink-0" 
              onClick={() => setCurrentView('settings')}
              title="Ver Perfil"
            >
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#00d2ff] transition-all duration-200 group-hover:border-cyan-500/40">
                <User size={18} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] bg-[#090f1e] border border-cyan-500/40 rounded-full flex items-center justify-center text-[#22d3ee] transition-all duration-200 group-hover:bg-[#00d2ff] group-hover:text-[#050811] group-hover:scale-115">
                <Camera size={9} />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-white truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                {userName}
              </p>
              <p className="text-[11px] text-[#64748b] font-normal truncate -mt-0.5">
                {userEmail}
              </p>
              <p className="text-[11px] font-bold text-[#00d2ff] drop-shadow-[0_0_10px_rgba(0,210,255,0.35)] mt-0.5">
                {userRole}
              </p>
            </div>
          </div>

          {/* Botón Cambiar Contraseña / Perfil en una sola línea */}
          <button 
            onClick={() => setCurrentView('settings')}
            className="w-full py-2.5 px-2 mb-3 bg-cyan-500/[0.03] border border-cyan-500/20 text-[#00d2ff] hover:bg-cyan-500/12 hover:border-cyan-500/45 hover:text-white rounded-xl text-[10.5px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 whitespace-nowrap cursor-pointer drop-shadow-[0_0_8px_rgba(0,210,255,0.3)] hover:shadow-[0_4px_16px_rgba(6,182,212,0.2)] hover:-translate-y-0.5"
          >
            <ShieldCheck size={14} />
            <span>CAMBIAR CONTRASEÑA / PERFIL</span>
          </button>

          {/* Fila Horizontal de Acciones Inferiores: REINICIAR / SALIR */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="group flex-1 py-2 px-2.5 rounded-lg text-[11px] font-extrabold text-[#64748b] hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
              title="Reiniciar Aplicación"
            >
              <RefreshCw size={12} className="transition-transform duration-500 group-hover:rotate-180" />
              <span>REINICIAR</span>
            </button>
            <button 
              onClick={logout}
              className="flex-1 py-2 px-2.5 rounded-lg text-[11px] font-extrabold text-[#64748b] hover:text-[#f87171] hover:bg-rose-500/15 border border-transparent hover:border-rose-500/40 flex items-center justify-center gap-1.5 transition-all duration-200 hover:shadow-[0_4px_14px_rgba(239,68,68,0.25)] hover:-translate-y-0.5 cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut size={12} />
              <span>SALIR</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
