import React, { useState } from 'react';
import { 
  Save, 
  Key, 
  Database, 
  Info, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function SettingsView() {
  const [geminiKey, setGeminiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // Guardar en sessionStorage o localStorage para que persista en el cliente
    // (Puesto que en un cliente Vite el archivo .env es de compilación, guardarlas en el navegador permite reconfigurarlas en caliente).
    localStorage.setItem('nexus_crm_user_gemini_key', geminiKey);
    localStorage.setItem('nexus_crm_user_supabase_url', supabaseUrl);
    localStorage.setItem('nexus_crm_user_supabase_key', supabaseKey);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Opcionalmente recargar la página para re-inicializar el servicio de DB y Gemini con las nuevas credenciales ingresadas.
    if (confirm('Configuración guardada en el navegador. ¿Deseas recargar la aplicación para aplicar los cambios de inmediato?')) {
      window.location.reload();
    }
  };

  const isSupabaseConnected = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Formulario */}
      <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 space-y-6 shadow-sm">
        
        {/* Cabecera */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
            <Key size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Credenciales y API Keys</h3>
            <p className="text-slate-400 text-xs font-semibold">Configura las llaves de inteligencia artificial y persistencia.</p>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
          <Info size={16} className="text-cyan-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-500 leading-relaxed font-medium">
            <p>
              Por defecto, Nexus CRM ya viene pre-configurado con las llaves de desarrollo de tu entorno local (Vault). Si necesitas usar tus propias credenciales o cambiarlas, puedes ingresarlas en este formulario. Las llaves se guardarán de forma segura en tu navegador.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          
          {/* Gemini Key */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Google Gemini API Key</label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-1 focus:ring-cyan-500 focus:outline-none bg-slate-50/20"
              placeholder="AIzaSy..."
            />
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Se utiliza para analizar y calificar los prospectos subidos por CSV o autogenerados.</p>
          </div>

          {/* Supabase URL */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Supabase Project URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-1 focus:ring-cyan-500 focus:outline-none bg-slate-50/20"
              placeholder="https://your-project.supabase.co"
            />
          </div>

          {/* Supabase Anon Key */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Supabase Anon Key</label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-1 focus:ring-cyan-500 focus:outline-none bg-slate-50/20"
              placeholder="eyJhbGciOi..."
            />
          </div>

        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Database size={14} className="text-cyan-500" />
            <span>Estado: </span>
            {isSupabaseConnected ? (
              <span className="text-green-600 flex items-center gap-0.5">
                <CheckCircle size={12} /> Supabase Conectado
              </span>
            ) : (
              <span className="text-amber-600">Almacenamiento Local (localStorage)</span>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
          >
            <Save size={14} /> Guardar Configuración
          </button>
        </div>

      </form>

      {/* Tarjeta 2: Ayuda e Integración */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 space-y-4 shadow-sm">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Integración con Odoo y Excel</h4>
        <div className="text-xs text-slate-500 leading-relaxed font-medium space-y-2">
          <p>
            **1. Exportar desde Google Maps**: Puedes usar extensiones como *Instant Data Scraper* o *Maps Scraper* para extraer los talleres y lubricentros de cualquier comuna y exportar un CSV.
          </p>
          <p>
            **2. Mapeo Flexible**: El importador de Nexus Hunter reconoce automáticamente cabeceras en español e inglés como: `Nombre Taller`, `Teléfono`, `Comuna`, `Sitio Web` y `Dirección`.
          </p>
          <p>
            **3. WhatsApp Web**: El enlace de WhatsApp abre `web.whatsapp.com` directamente en tu computador con el texto redactado por Gemini, optimizando el tiempo de prospección a un solo clic.
          </p>
        </div>
      </div>

    </div>
  );
}
