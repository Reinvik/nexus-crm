import React, { useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  MapPin, 
  Check, 
  AlertCircle, 
  FileSpreadsheet, 
  RefreshCw,
  Phone,
  Globe,
  Search
} from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { dbService } from '../../services/dbService';

export default function NexusHunter({ onImportLeads }) {
  // Estado Importar CSV
  const [csvFile, setCsvFile] = useState(null);
  const [parsedLeads, setParsedLeads] = useState([]);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [csvError, setCsvError] = useState('');

  // Estado Generador IA
  const [commune, setCommune] = useState('Ñuñoa');
  const [leadCount, setLeadCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  // Estado Búsqueda en Vivo IA
  const [liveQuery, setLiveQuery] = useState('');
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [liveError, setLiveError] = useState('');

  // 1. Procesador de CSV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setCsvFile(file);
    setCsvError('');
    setParsedLeads([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        
        if (lines.length < 2) {
          setCsvError('El archivo CSV está vacío o le faltan líneas.');
          return;
        }

        // Leer cabeceras
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
        
        // Mapeo flexible
        const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('nombre') || h.includes('taller'));
        const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('telefono') || h.includes('teléfono') || h.includes('cel'));
        const websiteIdx = headers.findIndex(h => h.includes('web') || h.includes('url') || h.includes('sitio') || h.includes('pagina'));
        const communeIdx = headers.findIndex(h => h.includes('comuna') || h.includes('city') || h.includes('ciudad') || h.includes('comun'));
        const addressIdx = headers.findIndex(h => h.includes('address') || h.includes('direccion') || h.includes('dirección') || h.includes('loc'));

        if (nameIdx === -1) {
          setCsvError('No se encontró una columna de Nombre o Taller en el CSV.');
          return;
        }

        const leads = [];
        for (let i = 1; i < lines.length; i++) {
          // Expresión regular para separar por comas respetando comillas
          const cols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
          const cleanCols = cols.map(c => c.replace(/"/g, '').trim());

          const name = cleanCols[nameIdx] || '';
          if (!name) continue;

          const phone = phoneIdx !== -1 ? cleanCols[phoneIdx] || '' : '';
          const websiteRaw = websiteIdx !== -1 ? cleanCols[websiteIdx] || '' : '';
          const website = websiteRaw.toLowerCase().includes('no tiene') || !websiteRaw ? '' : websiteRaw;
          const communeVal = communeIdx !== -1 ? cleanCols[communeIdx] || 'Santiago' : 'Santiago';
          const cleanCommune = communeVal.split(',')[0].trim();
          const address = addressIdx !== -1 ? cleanCols[addressIdx] || `${name}, ${cleanCommune}` : `${name}, ${cleanCommune}`;

          leads.push({
            id: `temp-${Date.now()}-${i}`,
            name,
            phone: phone || 'Sin teléfono',
            website: website,
            commune: cleanCommune,
            address,
            priority: 'Media',
            stage: 'lead',
            value: 45000,
            pain: 'No analizado aún',
            pitch: 'No analizado aún'
          });
        }

        if (leads.length === 0) {
          setCsvError('No se pudieron procesar filas válidas en el CSV.');
        } else {
          setParsedLeads(leads);
        }
      } catch (err) {
        console.error(err);
        setCsvError('Error al procesar el archivo. Asegúrate de que sea un CSV válido.');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Calificar leads de CSV e importarlos
  const handleQualifyAndImport = async () => {
    if (parsedLeads.length === 0) return;
    setIsProcessingCsv(true);
    
    const imported = [];
    // Procesar los primeros 8 leads máximo para no exceder cuotas de IA
    const leadsToProcess = parsedLeads.slice(0, 8);

    for (let lead of leadsToProcess) {
      try {
        const rating = '4.0';
        const analysis = await geminiService.qualifyLead(lead.name, 'Taller Mecánico', lead.website, lead.address, rating);
        
        imported.push({
          ...lead,
          id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          priority: analysis.prioridad || 'Media',
          pain: analysis.dolor_probable || 'Descontrol de OTs e inventarios.',
          pitch: analysis.pitch_whatsapp || 'Hola, vi tu taller...',
          interest: 'Indeciso',
          visitStatus: 'Pendiente',
          nextVisitDate: new Date().toISOString().split('T')[0] // Visita hoy
        });
      } catch (e) {
        // En caso de error, insertar con los datos por defecto
        imported.push({
          ...lead,
          id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          priority: 'Media',
          pain: 'Gestión operacional desorganizada.',
          pitch: `Hola ${lead.name}, nos gustaría presentarte Nexus Garage.`
        });
      }
    }

    onImportLeads(imported);
    // Limpiar
    setCsvFile(null);
    setParsedLeads([]);
    setIsProcessingCsv(false);
    alert(`🎉 ¡Se han calificado e importado ${imported.length} talleres al Kanban con éxito!`);
  };

  // 2. Generador de Prospectos por IA (Google Maps Scraper virtual con Gemini)
  const handleGenerateWithIA = async () => {
    if (!commune.trim()) return;
    setIsGenerating(true);
    setGenError('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
      setGenError('Se necesita una VITE_GEMINI_API_KEY en la configuración para autogenerar prospectos reales con IA.');
      setIsGenerating(false);
      return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `Eres un agente de extracción e inteligencia comercial (Nexus Hunter).
Tu objetivo es entregar una lista de exactamente ${leadCount} talleres mecánicos, servicios técnicos automotrices o lubricentros chilenos 100% REALES que existan físicamente en la comuna de ${commune}, Santiago de Chile.
IMPORTANTE: Debes asegurarte de que los nombres y las direcciones físicas sean completamente reales y exactas (tal como aparecen en Google Maps). No inventes números de calles, nombres de locales ni aproximes ubicaciones. Si dudas de la existencia real de un taller o de su dirección física exacta, NO lo incluyas en la lista. Es preferible que entregues menos prospectos de los solicitados (por ejemplo, 3 o 4 en lugar de ${leadCount}), pero con la garantía absoluta de que si el usuario busca ese nombre y dirección en Google Maps, encontrará el local físico y sus fotos de forma exacta.

Para cada taller, necesitamos:
1. Nombre comercial REAL del negocio tal como figura en Google Maps (ej. "Taller Cycles Jara", "Mecánica Jara", "Bosch Car Service Irarrázaval", "Lubricentro Ñuñoa", etc.).
2. Dirección física REAL, exacta y completa en la comuna de ${commune} (calle, número y comuna).
3. Teléfono de contacto chileno real (celular de 9 dígitos sin espacios, ej: 56987654321 o número de red fija del taller).
4. Sitio web REAL (por ejemplo, el dominio real del taller. Si no tiene sitio web o no está registrado, responde "NO TIENE" o déjalo vacío). Al menos 2 talleres deben tener sitio web real, y el resto debe ser sin web.
5. Calificación/Rating estimado en Google Maps (de 1.0 a 5.0).
6. Prioridad comercial: "Alta" si no tiene web o tiene mala calificación (desorden comercial), "Media" o "Baja".
7. El dolor operacional probable del taller según su tamaño y reputación.
8. Mensaje de WhatsApp (pitch) personalizado en español de Chile, profesional, cercano, mencionando a Nexus Garage.

Responde ÚNICAMENTE con una lista en formato JSON puro (sin bloques de código \`\`\`json ni texto adicional) con esta estructura:
[
  {
    "name": "Nombre Comercial Real",
    "commune": "${commune}",
    "address": "Dirección Real Completa, ${commune}",
    "phone": "569XXXXXXXX",
    "website": "URL_real_o_vacio",
    "rating": "4.2",
    "priority": "Alta/Media/Baja",
    "pain": "dolor probable en la gestión",
    "pitch": "mensaje de WhatsApp redactado con emojis y saltos de línea"
  }
]`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const textResponse = result.candidates[0].content.parts[0].text;
        const leads = JSON.parse(textResponse.trim());

        // Adaptar al esquema
        const formattedLeads = leads.map((l, index) => ({
          id: `lead-gen-${Date.now()}-${index}`,
          name: l.name,
          commune: l.commune || commune,
          address: l.address,
          phone: l.phone.replace(/\D/g, ''),
          website: l.website && l.website.toLowerCase() !== 'no tiene' ? l.website : '',
          priority: l.priority || 'Media',
          stage: 'lead',
          value: 45000,
          pain: l.pain || 'Control manual de órdenes de trabajo.',
          pitch: l.pitch || 'Hola...',
          interest: 'Indeciso',
          visitStatus: 'Pendiente',
          nextVisitDate: new Date().toISOString().split('T')[0]
        }));

        onImportLeads(formattedLeads);
        alert(`🎯 Nexus Hunter ha prospectado y calificado ${formattedLeads.length} talleres en ${commune} exitosamente.`);
      } else {
        const errorText = await response.text();
        setGenError(`Error en el servicio de IA (${response.status}): ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      setGenError('Excepción al conectar con el servidor de prospección.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLiveSearchAndCreate = async () => {
    if (!liveQuery.trim()) return;
    setIsLiveSearching(true);
    setLiveError('');
    try {
      const result = await geminiService.searchAndStructureLead(liveQuery);
      if (result && result.name) {
        const newLead = {
          name: result.name,
          commune: result.commune || 'Santiago',
          address: result.address || `${result.name}, Chile`,
          phone: result.phone || '',
          website: result.website || '',
          priority: result.priority || 'Media',
          stage: 'lead',
          value: 45000,
          pain: result.pain || 'Control manual de órdenes de trabajo.',
          pitch: result.pitch || 'Hola...',
          interest: 'Indeciso',
          visitStatus: 'Ninguna',
          nextVisitDate: '',
          nextVisitTime: '',
          openWeekends: false,
          notes: 'Enriquecido automáticamente mediante búsqueda IA en vivo en internet.'
        };

        const saved = await dbService.saveLead(newLead);
        
        if (onImportLeads) {
          onImportLeads([saved]);
        }
        
        alert(`🎉 Taller "${result.name}" encontrado en internet e insertado con éxito en el Kanban.`);
        setLiveQuery('');
      } else {
        setLiveError('No pudimos extraer los datos del taller. Asegúrate de escribir el nombre completo o comuna.');
      }
    } catch (err) {
      console.error(err);
      setLiveError('Ocurrió un error al buscar y procesar el taller en internet.');
    } finally {
      setIsLiveSearching(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Tarjeta 1: Importador de CSV */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <FileSpreadsheet size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Procesar Rutas de Talleres (CSV)</h3>
          </div>
          <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
            Sube el archivo CSV exportado del mapa con tus talleres prospectados. El sistema leerá las columnas automáticamente, las calificará con inteligencia artificial y las agregará al Kanban.
          </p>

          {/* Zona de Arrastre/Carga */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-cyan-500 hover:bg-slate-50/50 transition-all relative">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload size={32} className="mx-auto text-slate-300 mb-2" />
            <span className="text-xs font-extrabold text-slate-600 block">
              {csvFile ? csvFile.name : 'Selecciona o arrastra tu archivo CSV'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">Soporta formato UTF-8 con comas</span>
          </div>

          {/* Error */}
          {csvError && (
            <div className="mt-3 p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-rose-100">
              <AlertCircle size={14} /> {csvError}
            </div>
          )}

          {/* Previsualización del CSV */}
          {parsedLeads.length > 0 && (
            <div className="mt-4 border border-slate-100 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Previsualización ({parsedLeads.length} leads)</span>
                <span className="text-cyan-600">Listo para procesar</span>
              </div>
              <div className="max-h-36 overflow-y-auto custom-scrollbar text-[11px]">
                {parsedLeads.slice(0, 4).map((l, idx) => (
                  <div key={idx} className="px-3 py-2 border-b border-slate-100 last:border-b-0 flex justify-between gap-4">
                    <span className="font-extrabold text-slate-800 truncate">{l.name}</span>
                    <div className="flex gap-2 text-slate-400 whitespace-nowrap font-medium items-center">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.name}, ${l.commune}, Chile`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                        title="Verificar en Google Maps"
                      >
                        <MapPin size={10} />
                        <span>{l.commune}</span>
                      </a>
                      <span>| 📞 {l.phone}</span>
                    </div>
                  </div>
                ))}
                {parsedLeads.length > 4 && (
                  <div className="px-3 py-1.5 text-center text-[9px] text-slate-400 bg-slate-50/50 font-bold border-t border-slate-100">
                    ... y {parsedLeads.length - 4} talleres más.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Acción */}
        {parsedLeads.length > 0 && (
          <button
            onClick={handleQualifyAndImport}
            disabled={isProcessingCsv}
            className="w-full mt-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 cursor-pointer disabled:opacity-50"
          >
            {isProcessingCsv ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Calificando con Gemini AI...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Calificar con IA e Importar
              </>
            )}
          </button>
        )}
      </div>

      {/* Tarjeta 2: Nexus Hunter por Comuna (IA) */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <Sparkles size={18} className="text-cyan-500 animate-pulse" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Buscar Prospectos con IA (Maps Virtual)</h3>
          </div>
          <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
            ¿No tienes un CSV a mano? Nexus Hunter puede rastrear Google Maps virtualmente con Gemini para encontrar talleres mecánicos reales en comunas específicas de Chile, pre-calificarlos y cargarlos automáticamente.
          </p>

          <div className="space-y-4">
            {/* Comuna */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Comuna de Búsqueda</label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                placeholder="Ej. Providencia, Huechuraba, Maipú"
              />
            </div>

            {/* Cantidad */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Cantidad a Prospectar</label>
              <select
                value={leadCount}
                onChange={(e) => setLeadCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none bg-white font-semibold"
              >
                <option value={3}>3 talleres mecánicos</option>
                <option value={5}>5 talleres mecánicos (Recomendado)</option>
                <option value={8}>8 talleres mecánicos</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {genError && (
            <div className="mt-4 p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-rose-100">
              <AlertCircle size={14} /> {genError}
            </div>
          )}
        </div>

        {/* Acción */}
        <button
          onClick={handleGenerateWithIA}
          disabled={isGenerating || !commune.trim()}
          className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Buscando y Calificando en Maps...
            </>
          ) : (
            <>
              <Sparkles size={14} className="text-cyan-400" />
              Ejecutar Nexus Hunter
            </>
          )}
        </button>
      </div>

      {/* Tarjeta 3: Enriquecer & Crear con IA en Vivo */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Search size={18} className="text-emerald-500" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Escanear y Crear con IA en Vivo</h3>
          </div>
          <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
            Escribe el nombre y comuna de cualquier taller. Gemini buscará en internet en tiempo real para extraer sus datos (dirección, teléfono, web y comuna) y creará su ticket automáticamente.
          </p>

          <div className="space-y-4">
            {/* Input de Búsqueda */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Nombre del Taller y Ubicación</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={liveQuery}
                  onChange={(e) => setLiveQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-550 focus:outline-none"
                  placeholder="Ej. Frenos AM Ñuñoa, Taller Farias Santiago"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {liveError && (
            <div className="mt-4 p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-rose-100">
              <AlertCircle size={14} /> {liveError}
            </div>
          )}
        </div>

        {/* Acción */}
        <button
          onClick={handleLiveSearchAndCreate}
          disabled={isLiveSearching || !liveQuery.trim()}
          className="w-full mt-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-650/10 cursor-pointer disabled:opacity-50"
        >
          {isLiveSearching ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Buscando e Investigando en la Web...
            </>
          ) : (
            <>
              <Sparkles size={14} className="text-emerald-300" />
              Escanear y Crear Ticket
            </>
          )}
        </button>
      </div>

    </div>
  );
}
