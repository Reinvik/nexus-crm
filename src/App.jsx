import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/crm/Dashboard';
import KanbanBoard from './components/crm/KanbanBoard';
import NexusHunter from './components/crm/NexusHunter';
import SettingsView from './components/crm/SettingsView';
import LeadModal from './components/crm/LeadModal';
import BuyerPersonas from './components/crm/BuyerPersonas';
import MentorshipPlaybook from './components/crm/MentorshipPlaybook';
import { dbService } from './services/dbService';
import { Menu, Calendar } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Login from './components/auth/Login';

export default function App() {
  const { session } = useAuth();
  const [currentView, setCurrentView] = useState('kanban');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Estado Leads
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado Modal Lead
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar Google Font Outfit
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Cargar Leads al inicio
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        // Cargar keys dinámicas desde localStorage si el usuario las reconfiguró en la UI
        const userGemini = localStorage.getItem('nexus_crm_user_gemini_key');
        const userSubUrl = localStorage.getItem('nexus_crm_user_supabase_url');
        const userSubKey = localStorage.getItem('nexus_crm_user_supabase_key');
        
        if (userGemini) import.meta.env.VITE_GEMINI_API_KEY = userGemini;
        if (userSubUrl) import.meta.env.VITE_SUPABASE_URL = userSubUrl;
        if (userSubKey) import.meta.env.VITE_SUPABASE_ANON_KEY = userSubKey;

        const data = await dbService.getLeads();
        setLeads(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Guardar o actualizar un lead
  const handleSaveLead = async (leadToSave) => {
    try {
      const saved = await dbService.saveLead(leadToSave);
      setLeads(prev => {
        const idx = prev.findIndex(l => l.id === saved.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        } else {
          return [saved, ...prev];
        }
      });
      setIsModalOpen(false);
      setSelectedLead(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar Lead
  const handleDeleteLead = async (id) => {
    try {
      await dbService.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      setIsModalOpen(false);
      setSelectedLead(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Importar múltiples leads calificados
  const handleImportLeads = async (newLeads) => {
    try {
      const savedLeads = [];
      for (let lead of newLeads) {
        const saved = await dbService.saveLead(lead);
        savedLeads.push(saved);
      }
      setLeads(prev => [...savedLeads, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // Abrir modal para nuevo lead
  const handleAddNewLead = () => {
    const defaultNewLead = {
      name: '',
      commune: 'Santiago (Centro)',
      address: '',
      phone: '',
      website: '',
      email: '',
      emailType: 'No tiene',
      priority: 'Media',
      stage: 'lead',
      value: 45000,
      pain: '',
      pitch: '',
      visitStatus: 'Ninguna',
      interest: 'Indeciso',
      nextVisitDate: '',
      nextVisitTime: '',
      notes: ''
    };
    setSelectedLead(defaultNewLead);
    setIsModalOpen(true);
  };

  // Obtener títulos de vistas
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Resumen Comercial e Inteligencia de Ventas';
      case 'kanban': return 'Embudo de Ventas - Nexus Garage';
      case 'hunter': return 'Nexus Hunter - Prospección Google Maps';
      case 'personas': return 'Perfiles de Clientes Ideales (Buyer Personas)';
      case 'playbook': return 'Playbook Comercial: Diagnósticos y Cierres';
      case 'settings': return 'Configuración de Sistema';
      default: return 'Nexus CRM';
    }
  };

  if (!session) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar Lateral */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Barra Superior (Header) */}
        <header className="h-20 border-b border-slate-200/80 bg-white flex items-center justify-between px-6 lg:px-8 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight truncate max-w-[200px] sm:max-w-none">
              {getViewTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/50 px-3.5 py-1.5 rounded-full select-none">
            <Calendar size={14} className="text-cyan-500" />
            <span>2026-06-28</span>
          </div>
        </header>

        {/* Contenido de la Vista Activa */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#f8fafc] custom-scrollbar">
          <div className={`${currentView === 'kanban' ? 'max-w-full' : 'max-w-7xl'} mx-auto`}>
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-semibold text-sm text-slate-400">Sincronizando Leads...</p>
              </div>
            ) : (
              <>
                {currentView === 'dashboard' && (
                  <Dashboard leads={leads} onNavigate={setCurrentView} />
                )}
                {currentView === 'kanban' && (
                  <KanbanBoard 
                    leads={leads} 
                    onUpdateLead={handleSaveLead}
                    onOpenLeadModal={(lead) => {
                      setSelectedLead(lead);
                      setIsModalOpen(true);
                    }}
                    onAddNewLead={handleAddNewLead}
                  />
                )}
                {currentView === 'hunter' && (
                  <NexusHunter onImportLeads={handleImportLeads} />
                )}
                 {currentView === 'personas' && (
                  <BuyerPersonas />
                )}
                {currentView === 'playbook' && (
                  <MentorshipPlaybook />
                )}
                {currentView === 'settings' && (
                  <SettingsView />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modal para Ver / Editar Lead */}
      {isModalOpen && selectedLead && (
        <LeadModal 
          lead={selectedLead}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLead(null);
          }}
          onSaveLead={handleSaveLead}
          onDeleteLead={handleDeleteLead}
        />
      )}

    </div>
  );
}
