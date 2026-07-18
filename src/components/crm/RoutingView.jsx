import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Phone, 
  Map, 
  Check, 
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Info,
  RefreshCw,
  Locate
} from 'lucide-react';
import L from 'leaflet';
import { dbService } from '../../services/dbService';

// Coordenadas centrales por comuna en Santiago (Fallback)
const COMMUNE_COORDS = {
  'santiago': [-33.4489, -70.6693],
  'maipu': [-33.5118, -70.7634],
  'la cisterna': [-33.5272, -70.6627],
  'san bernardo': [-33.5922, -70.7051],
  'penalolen': [-33.4839, -70.5599],
  'providencia': [-33.4312, -70.6121],
  'las condes': [-33.4125, -70.5284],
  'nunoa': [-33.4542, -70.5982],
  'macul': [-33.4848, -70.6033],
  'la florida': [-33.5227, -70.5983],
  'puente alto': [-33.6139, -70.5746],
  'recoleta': [-33.4067, -70.6433],
  'independencia': [-33.4144, -70.6622],
  'quinta normal': [-33.4289, -70.6978],
  'pudahuel': [-33.4455, -70.7588],
  'estacion central': [-33.4589, -70.7022],
  'cerrillos': [-33.5011, -70.7188],
  'pedro aguirre cerda': [-33.4889, -70.6722],
  'san miguel': [-33.4989, -70.6522],
  'san joaquin': [-33.4922, -70.6289],
  'la pintana': [-33.5822, -70.6322],
  'el bosque': [-33.5622, -70.6689],
  'lo espejo': [-33.5222, -70.6922],
  'cerro navia': [-33.4222, -70.7322],
  'lo prado': [-33.4422, -70.7322],
  'renca': [-33.4022, -70.7189],
  'conchali': [-33.3822, -70.6789],
  'quilicura': [-33.3622, -70.7289],
  'huechuraba': [-33.3722, -70.6289],
  'vitacura': [-33.3822, -70.5789],
  'lo barnechea': [-33.3522, -70.5089],
  'la reina': [-33.4422, -70.5522]
};

function getCommuneCoords(communeName) {
  if (!communeName) return [-33.4489, -70.6693];
  const normalized = communeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return COMMUNE_COORDS[normalized] || [-33.4489, -70.6693];
}

// Helper asíncrono para geocodificar un único taller
const geocodeSingleLead = async (lead, cachedCoords) => {
  const cacheKey = `${lead.name}_${lead.address}`.toLowerCase();
  
  if (cachedCoords[cacheKey]) {
    return { ...lead, lat: cachedCoords[cacheKey].lat, lon: cachedCoords[cacheKey].lon };
  }

  try {
    // 1. Quitar el código postal de 7 dígitos si viene en la dirección de Outscraper
    let cleanAddr = lead.address.replace(/\b\d{7}\b/g, '');
    // 2. Limpiar espacios extra
    cleanAddr = cleanAddr.replace(/\s+/g, ' ').trim();
    // 3. Evitar duplicación de comunas
    let queryText = cleanAddr;
    if (lead.commune && !cleanAddr.toLowerCase().includes(lead.commune.toLowerCase())) {
      queryText += `, ${lead.commune}`;
    }
    // 4. Agregar Santiago y Chile
    if (!queryText.toLowerCase().includes('santiago')) {
      queryText += `, Santiago`;
    }
    if (!queryText.toLowerCase().includes('chile')) {
      queryText += `, Chile`;
    }

    const queryUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryText)}&limit=1`;
    
    // Sleep para evitar Rate Limit 429
    await new Promise(resolve => setTimeout(resolve, 300));
    const response = await fetch(queryUrl, {
      headers: { 'User-Agent': 'NexusCRM-Geocoding-System/1.0' }
    });

    if (response.ok) {
      const results = await response.json();
      if (results && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        cachedCoords[cacheKey] = { lat, lon };
        return { ...lead, lat, lon, isNewGeocode: true };
      }
    }
  } catch (e) {
    console.warn("Geocodificación fallida para:", lead.name);
  }

  // Fallback a coordenadas de comuna
  const base = getCommuneCoords(lead.commune);
  const randomOffsetLat = (Math.random() - 0.5) * 0.012;
  const randomOffsetLon = (Math.random() - 0.5) * 0.012;
  
  return {
    ...lead,
    lat: base[0] + randomOffsetLat,
    lon: base[1] + randomOffsetLon
  };
};

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

export default function RoutingView({ leads, onDeleteLead }) {
  const [selectedCommunes, setSelectedCommunes] = useState([]);
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  
  // Estados para planificación semanal y plantillas
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDayIndex = new Date().getDay();
    return days[currentDayIndex] || 'Lunes';
  });

  const [routesByDay, setRoutesByDay] = useState({
    'Lunes': [], 'Martes': [], 'Miércoles': [], 'Jueves': [], 'Viernes': [], 'Sábado': [], 'Domingo': []
  });

  const [routeItems, setRouteItems] = useState([]);
  const [routeTemplates, setRouteTemplates] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  const [newTemplateName, setNewTemplateName] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const [geocodedLeads, setGeocodedLeads] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedLead, setFocusedLead] = useState(null);

  // Cargar las rutas desde la base de datos al iniciar o refrescar
  const loadAllRoutes = async (showNotification = false) => {
    setLoadingRoutes(true);
    try {
      const dbRoutes = await dbService.getRoutes();
      
      const daysMap = {
        'Lunes': [], 'Martes': [], 'Miércoles': [], 'Jueves': [], 'Viernes': [], 'Sábado': [], 'Domingo': []
      };
      const templates = [];

      dbRoutes.forEach(route => {
        if (route.type === 'day') {
          daysMap[route.name] = route.items || [];
        } else if (route.type === 'template') {
          templates.push({
            id: route.id,
            name: route.name,
            items: route.items || [],
            created_at: route.created_at || new Date().toISOString()
          });
        }
      });

      setRoutesByDay(daysMap);
      setRouteTemplates(templates);
      
      // Cargar el día seleccionado actual
      setRouteItems(daysMap[selectedDay] || []);
      if (showNotification) {
        alert('🔄 Rutas sincronizadas con la base de datos de producción.');
      }
    } catch (err) {
      console.error('Error al cargar rutas desde la DB:', err);
    } finally {
      setLoadingRoutes(false);
    }
  };

  useEffect(() => {
    loadAllRoutes();
  }, []);

  // Cambiar de día guardando la ruta actual
  const handleDayChange = async (newDay) => {
    const currentRouteObj = {
      id: `day-${selectedDay.toLowerCase()}`,
      name: selectedDay,
      type: 'day',
      items: routeItems
    };
    
    // Guardado optimista local
    const updatedRoutes = {
      ...routesByDay,
      [selectedDay]: routeItems
    };
    setRoutesByDay(updatedRoutes);
    setSelectedDay(newDay);
    setRouteItems(updatedRoutes[newDay] || []);

    try {
      await dbService.saveRoute(currentRouteObj);
    } catch (err) {
      console.error('Error al guardar ruta al cambiar de día:', err);
    }
  };

  // Efecto para autoguardar routeItems en el día seleccionado
  useEffect(() => {
    if (!loadingRoutes && selectedDay) {
      const saveRouteAsync = async () => {
        try {
          await dbService.saveRoute({
            id: `day-${selectedDay.toLowerCase()}`,
            name: selectedDay,
            type: 'day',
            items: routeItems
          });
        } catch (err) {
          console.error('Error al autoguardar ruta en DB:', err);
        }
      };

      setRoutesByDay(prev => ({
        ...prev,
        [selectedDay]: routeItems
      }));

      saveRouteAsync();
    }
  }, [routeItems, selectedDay, loadingRoutes]);

  const saveAsTemplate = async () => {
    if (!newTemplateName.trim()) return;
    if (routeItems.length === 0) {
      alert('No puedes guardar una ruta vacía como plantilla.');
      return;
    }
    
    const newTemplate = {
      id: crypto.randomUUID(),
      name: newTemplateName.trim(),
      type: 'template',
      items: routeItems
    };

    setRouteTemplates(prev => [
      {
        id: newTemplate.id,
        name: newTemplate.name,
        items: newTemplate.items,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);
    setNewTemplateName('');
    setShowTemplates(false);

    try {
      await dbService.saveRoute(newTemplate);
      alert(`Plantilla "${newTemplate.name}" guardada con éxito.`);
    } catch (err) {
      console.error('Error al guardar plantilla en DB:', err);
    }
  };

  const loadTemplate = (template) => {
    if (confirm(`¿Deseas cargar la plantilla "${template.name}"? Esto reemplazará tu ruta actual de los ${selectedDay}.`)) {
      setRouteItems(template.items);
      setShowTemplates(false);
    }
  };

  const deleteTemplate = async (id, name) => {
    if (confirm(`¿Deseas eliminar la plantilla "${name}"?`)) {
      setRouteTemplates(prev => prev.filter(t => t.id !== id));
      try {
        await dbService.deleteRoute(id, 'template', name);
      } catch (err) {
        console.error('Error al eliminar plantilla de la DB:', err);
      }
    }
  };

  const clearCurrentRoute = () => {
    if (confirm(`¿Seguro que deseas vaciar el itinerario de los ${selectedDay}?`)) {
      setRouteItems([]);
    }
  };

  // Refs de Leaflet
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const polylineLayerRef = useRef(null);
  const markersMapRef = useRef({}); // leadId -> L.marker

  // Obtener comunas para filtrar
  const communes = ['all', ...new Set(leads.map(l => l.commune).filter(Boolean))].sort();

  // Filtrar los leads activos
  const filteredLeads = leads.filter(lead => {
    const searchNormalized = normalizeText(searchTerm);
    const matchesSearch = !searchTerm || 
                          normalizeText(lead.name).includes(searchNormalized) || 
                          normalizeText(lead.commune).includes(searchNormalized) ||
                          normalizeText(lead.address).includes(searchNormalized);
                          
    const matchesCommune = selectedCommunes.length === 0 || selectedCommunes.includes(lead.commune);
    const matchesStage = selectedStage === 'all' || lead.stage === selectedStage;
    const matchesPriority = selectedPriority === 'all' || lead.priority === selectedPriority;
    return matchesCommune && matchesStage && matchesPriority && matchesSearch;
  });

  // Efecto para geocodificar la sublista de leads en base a la comuna
  useEffect(() => {
    const geocodeFilteredLeads = async () => {
      setIsGeocoding(true);
      
      const cachedCoordsStr = localStorage.getItem('nexus_crm_geocoded_coords_v2') || '{}';
      const cachedCoords = JSON.parse(cachedCoordsStr);
      let updatedCache = false;

      // Determinar qué leads geocodificar
      let leadsToProcess = [];

      // Si hay alguna comuna seleccionada, procesamos los talleres de esa comuna (máximo 40)
      if (selectedCommunes.length > 0) {
        leadsToProcess = [...filteredLeads.slice(0, 40)];
      }

      // Siempre incluimos los items de la ruta activa para que no desaparezcan
      routeItems.forEach(item => {
        if (!leadsToProcess.some(l => l.id === item.id)) {
          leadsToProcess.push(item);
        }
      });

      // Siempre incluimos el lead enfocado
      if (focusedLead && !leadsToProcess.some(l => l.id === focusedLead.id)) {
        leadsToProcess.push(focusedLead);
      }

      const processed = [];
      for (const lead of leadsToProcess) {
        const res = await geocodeSingleLead(lead, cachedCoords);
        if (res.isNewGeocode) {
          updatedCache = true;
        }
        processed.push(res);
      }

      if (updatedCache) {
        localStorage.setItem('nexus_crm_geocoded_coords_v2', JSON.stringify(cachedCoords));
      }

      setGeocodedLeads(processed);
      setIsGeocoding(false);
    };

    geocodeFilteredLeads();
  }, [selectedCommunes, selectedStage, selectedPriority, searchTerm, leads, routeItems, focusedLead]);

  // Inicializar Mapa Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Crear el mapa
    const santiagoCenter = [-33.4489, -70.6693];
    const map = L.map(mapContainerRef.current, {
      center: santiagoCenter,
      zoom: 11,
      zoomControl: false
    });

    // Agregar control de zoom abajo a la derecha
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Capa de OpenStreetMap (Estilo CartoDB Positron, muy premium y minimalista)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Crear capas de marcadores y rutas poligonales
    const markersLayer = L.layerGroup().addTo(map);
    const polylineLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersLayerRef.current = markersLayer;
    polylineLayerRef.current = polylineLayer;

    return () => {
      map.remove();
    };
  }, []);

  // Dibujar Marcadores e Itinerario en el mapa cada vez que cambien los datos
  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    const polylineLayer = polylineLayerRef.current;

    if (!map || !markersLayer || !polylineLayer) return;

    // Limpiar marcadores y rutas anteriores
    markersLayer.clearLayers();
    polylineLayer.clearLayers();
    markersMapRef.current = {};

    const bounds = L.latLngBounds();
    const routeCoords = [];

    // Icono por defecto de taller mecánico (Pin cian y oscuro)
    const defaultIcon = L.divIcon({
      html: `<div class="w-7 h-7 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
               <span class="text-[10px] font-black text-cyan-400">🔧</span>
             </div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -10]
    });

    // Dibujar todos los leads geocodificados
    geocodedLeads.forEach(lead => {
      const isSelectedInRoute = routeItems.some(item => item.id === lead.id);
      const isFocused = focusedLead && focusedLead.id === lead.id;
      
      // Icono alternativo si ya está en la ruta o está en foco
      let icon = defaultIcon;
      if (isSelectedInRoute) {
        icon = L.divIcon({
          html: `<div class="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                   <span class="text-xs font-black text-white">${routeItems.findIndex(i => i.id === lead.id) + 1}</span>
                 </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -10]
        });
      } else if (isFocused) {
        icon = L.divIcon({
          html: `<div class="w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center shadow-lg animate-pulse scale-110">
                   <span class="text-xs font-black text-slate-950">📍</span>
                 </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -10]
        });
      }

      const marker = L.marker([lead.lat, lead.lon], { icon }).addTo(markersLayer);
      markersMapRef.current[lead.id] = marker;
      bounds.extend([lead.lat, lead.lon]);

      // Pop-up con info del Lead
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 text-slate-800 text-xs font-sans max-w-[200px]';
      popupContent.innerHTML = `
        <h5 class="font-extrabold text-sm text-slate-900 tracking-tight leading-tight">${lead.name}</h5>
        <p class="text-[10px] text-slate-500 mt-1"><b class="text-slate-700">📍 Dir:</b> ${lead.address}</p>
        <p class="text-[10px] text-slate-500 mt-0.5"><b class="text-slate-700">📞 Tel:</b> ${lead.phone || 'Sin teléfono'}</p>
        <div class="mt-2.5 flex gap-1.5 justify-end">
          ${isSelectedInRoute 
            ? `<button id="pop-btn-rm-${lead.id}" class="px-2 py-1 bg-rose-500 text-white rounded text-[10px] font-bold cursor-pointer hover:bg-rose-600 transition-colors">Quitar Ruta</button>`
            : `<button id="pop-btn-add-${lead.id}" class="px-2 py-1 bg-cyan-500 text-white rounded text-[10px] font-bold cursor-pointer hover:bg-cyan-600 transition-colors">Añadir Ruta</button>`
          }
        </div>
      `;

      marker.bindPopup(popupContent);

      // Eventos del Popup interactivos
      marker.on('popupopen', () => {
        const addBtn = document.getElementById(`pop-btn-add-${lead.id}`);
        const rmBtn = document.getElementById(`pop-btn-rm-${lead.id}`);
        
        if (addBtn) {
          addBtn.onclick = () => {
            addToRoute(lead);
            marker.closePopup();
          };
        }
        if (rmBtn) {
          rmBtn.onclick = () => {
            removeFromRoute(lead.id);
            marker.closePopup();
          };
        }
      });
    });

    // Dibujar la línea de itinerario
    routeItems.forEach(item => {
      const geo = geocodedLeads.find(l => l.id === item.id);
      if (geo) {
        routeCoords.push([geo.lat, geo.lon]);
      }
    });

    if (routeCoords.length > 1) {
      L.polyline(routeCoords, {
        color: '#06b6d4',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
        lineJoin: 'round'
      }).addTo(polylineLayer);
    }

    // Auto-ajustar vista del mapa si hay marcadores y estamos en una comuna específica
    if (geocodedLeads.length > 0 && selectedCommunes.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [geocodedLeads, routeItems, focusedLead, selectedCommunes]);

  // Enfocar un lead específico de la lista lateral en el mapa
  const handleFocusLead = async (lead) => {
    setFocusedLead(lead);
    
    // Si ya está geocodificado, centramos el mapa de inmediato
    const geo = geocodedLeads.find(l => l.id === lead.id);
    if (geo && mapRef.current) {
      mapRef.current.setView([geo.lat, geo.lon], 16, { animate: true });
      setTimeout(() => {
        const marker = markersMapRef.current[lead.id];
        if (marker) {
          marker.openPopup();
        }
      }, 350);
    } else {
      // Si no estaba geocodificado (ej: comuna es 'all'), el useEffect lo procesará al actualizar focusedLead
      // Centraremos en la coordenada tan pronto como esté disponible
      const cachedCoordsStr = localStorage.getItem('nexus_crm_geocoded_coords_v2') || '{}';
      const cachedCoords = JSON.parse(cachedCoordsStr);
      
      const res = await geocodeSingleLead(lead, cachedCoords);
      if (mapRef.current) {
        mapRef.current.setView([res.lat, res.lon], 16, { animate: true });
        
        // Agregar temporalmente al listado de geocoded para que dibuje el marcador
        setGeocodedLeads(prev => {
          if (prev.some(p => p.id === res.id)) return prev;
          return [...prev, res];
        });

        setTimeout(() => {
          const marker = markersMapRef.current[lead.id];
          if (marker) {
            marker.openPopup();
          }
        }, 400);
      }
    }
  };

  // Agregar lead al itinerario
  const addToRoute = (lead) => {
    if (routeItems.some(i => i.id === lead.id)) return;
    setRouteItems(prev => [...prev, lead]);
  };

  // Quitar lead del itinerario
  const removeFromRoute = (id) => {
    setRouteItems(prev => prev.filter(i => i.id !== id));
  };

  // Cambiar orden en la secuencia del itinerario
  const moveItem = (index, direction) => {
    const updated = [...routeItems];
    const temp = updated[index];
    if (direction === 'up' && index > 0) {
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
    } else if (direction === 'down' && index < updated.length - 1) {
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
    }
    setRouteItems(updated);
  };

  // Generar enlace a Google Maps Navigation Multi-punto
  const getGoogleMapsRouteLink = () => {
    if (routeItems.length === 0) return '';
    const base = 'https://www.google.com/maps/dir/';
    const coordsPath = routeItems.map(item => {
      const geo = geocodedLeads.find(l => l.id === item.id);
      return geo ? `${geo.lat},${geo.lon}` : encodeURIComponent(item.address);
    }).join('/');
    return base + coordsPath;
  };

  // Generar enlace a Google Maps para un único punto
  const getGoogleMapsSingleLink = (item) => {
    const geo = geocodedLeads.find(l => l.id === item.id);
    if (geo) {
      return `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lon}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ', ' + item.address)}`;
  };

  // Generar enlace a Waze para un único punto
  const getWazeSingleLink = (item) => {
    const geo = geocodedLeads.find(l => l.id === item.id);
    if (geo) {
      return `https://waze.com/ul?ll=${geo.lat},${geo.lon}&navigate=yes`;
    }
    return `https://waze.com/ul?q=${encodeURIComponent(item.name + ' ' + item.address)}`;
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros de Routing */}
      <div className="glass-panel py-2 px-4 rounded-xl bg-white border border-slate-100 flex flex-wrap gap-4 items-center justify-between shadow-sm text-xs relative z-[1001]">
        
        {/* Buscador */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar taller por nombre o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-slate-50/50 font-semibold"
          />
        </div>

        {/* selectores */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Comuna */}
          <MultiSelectCommunes
            communes={communes}
            selectedCommunes={selectedCommunes}
            onChange={(val) => {
              setSelectedCommunes(val);
              setFocusedLead(null); // Limpiar foco
            }}
            leads={leads}
          />

          {/* Etapa */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-slate-600"
          >
            <option value="all">Todas las Etapas</option>
            <option value="lead">Taller Identificado</option>
            <option value="contacto">Por Agendar Mentoría</option>
            <option value="demo">Mentoría Diagnóstica</option>
            <option value="negociacion">Propuesta de Valor</option>
          </select>

          {/* Prioridad */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-slate-600"
          >
            <option value="all">Todas las Prioridades</option>
            <option value="Alta">Prioridad Alta</option>
            <option value="Media">Prioridad Media</option>
            <option value="Baja">Prioridad Baja</option>
          </select>
        </div>
      </div>

      {/* Grid del Mapa y Ruta */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-175px)]">
        
        {/* Panel Izquierdo: Prospectos Filtrados */}
        <div className="lg:col-span-1 flex flex-col bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden h-full">
          <div className="bg-slate-50 border-b border-slate-200/80 p-3 flex justify-between items-center shrink-0">
            <h4 className="font-black text-[11px] uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <MapPin size={13} className="text-cyan-500" /> Talleres Encontrados
            </h4>
            <span className="text-[10px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded-full">
              {filteredLeads.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
            {isGeocoding && (
              <div className="py-8 text-center text-xs font-semibold text-slate-400 flex flex-col items-center justify-center gap-2">
                <RefreshCw size={18} className="animate-spin text-cyan-500" />
                <span>Geocodificando direcciones...</span>
              </div>
            )}
            
            {filteredLeads.map(lead => {
              const inRoute = routeItems.some(i => i.id === lead.id);
              const isFocused = focusedLead && focusedLead.id === lead.id;
              
              return (
                <div 
                  key={lead.id}
                  onClick={() => handleFocusLead(lead)}
                  className={`p-2.5 rounded-xl border border-slate-100 transition-all text-xs bg-slate-50/50 hover:bg-slate-50 flex justify-between items-start gap-2 cursor-pointer ${
                    isFocused ? 'border-amber-400 bg-amber-50/5' : 
                    inRoute ? 'border-cyan-300 bg-cyan-50/5' : ''
                  }`}
                >
                  <div className="space-y-0.5 truncate flex-1">
                    <h5 className="font-extrabold text-slate-800 tracking-tight leading-tight truncate group-hover:text-cyan-600">{lead.name}</h5>
                    <p className="text-[10px] text-slate-400 truncate">{lead.address}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-200/80 text-slate-600 rounded uppercase tracking-wider">{lead.commune}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                        lead.priority === 'Alta' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                      }`}>{lead.priority}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        inRoute ? removeFromRoute(lead.id) : addToRoute(lead);
                      }}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        inRoute 
                          ? 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-500 hover:text-white' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-cyan-500 hover:text-white'
                      }`}
                      title={inRoute ? "Quitar de mi Ruta" : "Agregar a mi Ruta"}
                    >
                      {inRoute ? <Check size={12} /> : <Plus size={12} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`¿Estás seguro de eliminar permanentemente a "${lead.name}" del CRM?`)) {
                          onDeleteLead(lead.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                      title="Eliminar Lead Permanentemente"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredLeads.length === 0 && !isGeocoding && (
              <div className="py-12 text-center text-slate-400 text-[11px] font-semibold space-y-1">
                <Info size={16} className="mx-auto text-slate-300" />
                <p>No se encontraron prospectos.</p>
                <p className="text-[9px]">Prueba cambiando los filtros superiores.</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Central: Mapa Interactivo Leaflet */}
        <div className="lg:col-span-2 bg-slate-100 border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden h-full relative">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          
          {/* Overlay informativo cuando no hay comuna seleccionada */}
          {selectedCommunes.length === 0 && !focusedLead && (
            <div className="absolute inset-x-0 bottom-6 mx-auto w-11/12 md:w-3/4 bg-slate-900/90 backdrop-blur text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 z-[1000] text-center space-y-1">
              <p className="text-xs font-black tracking-tight text-cyan-400 flex items-center justify-center gap-1.5">
                <Locate size={14} className="animate-pulse" /> Vista de Santiago Centro
              </p>
              <p className="text-[10px] text-slate-300 leading-normal">
                Para evitar saturación de pantalla, selecciona una o más **Comunas** en el filtro superior o haz clic en cualquier taller de la lista lateral para ubicarlo exactamente en el mapa.
              </p>
            </div>
          )}

          {/* Indicador de carga de geocodificación flotante */}
          {isGeocoding && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur shadow-md border border-slate-200 rounded-full px-3 py-1 text-[10px] font-bold text-slate-600 flex items-center gap-1.5 z-[1000] animate-pulse">
              <RefreshCw size={11} className="animate-spin text-cyan-500" />
              <span>Calculando rutas y coordenadas...</span>
            </div>
          )}
        </div>

        {/* Panel Derecho: Itinerario y Navegación GPS */}
        <div className="lg:col-span-1 flex flex-col bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden h-full">
          <div className="bg-cyan-500 border-b border-cyan-600 p-3 text-white flex justify-between items-center shrink-0">
            <h4 className="font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Navigation size={13} className="animate-pulse" /> Mi Itinerario
            </h4>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => loadAllRoutes(true)}
                disabled={loadingRoutes}
                className="p-1 hover:bg-white/20 text-white rounded transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
                title="Sincronizar Rutas con la BD"
              >
                <RefreshCw size={12} className={loadingRoutes ? "animate-spin" : ""} />
              </button>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-[9px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-all cursor-pointer"
                title="Plantillas y Rutas Guardadas"
              >
                📁 Plantillas
              </button>
              <span className="text-[10px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-full">
                {routeItems.length}
              </span>
            </div>
          </div>

          {/* Sub-Panel de Configuración de Día de la Semana y Autoguardado */}
          <div className="bg-slate-50 border-b border-slate-200/80 p-2.5 space-y-2 shrink-0 text-xs">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Planificar Día:</span>
              <select
                value={selectedDay}
                onChange={(e) => handleDayChange(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] font-black text-cyan-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer h-6"
              >
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Modal/Dropdown interno de Plantillas */}
            {showTemplates && (
              <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2.5 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Plantillas de Ruta</span>
                  <button 
                    onClick={() => setShowTemplates(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Cerrar
                  </button>
                </div>
                
                {/* Formulario para guardar plantilla */}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Nombre de plantilla... (ej: Ruta Sur)"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="flex-1 px-2 py-0.5 border border-slate-200 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold bg-slate-50/50"
                  />
                  <button
                    onClick={saveAsTemplate}
                    className="px-2.5 py-0.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-[10px] font-black transition-all cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>

                {/* Listado de plantillas */}
                <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
                  {routeTemplates.map(tpl => (
                    <div key={tpl.id} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded border border-slate-100 text-[10px] font-semibold text-slate-700">
                      <span className="truncate pr-2">{tpl.name} ({tpl.items.length} paradas)</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => loadTemplate(tpl)}
                          className="px-1.5 py-0.5 bg-slate-100 hover:bg-cyan-500 hover:text-white rounded text-[9px] font-bold cursor-pointer transition-all"
                        >
                          Cargar
                        </button>
                        <button
                          onClick={() => deleteTemplate(tpl.id, tpl.name)}
                          className="p-0.5 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {routeTemplates.length === 0 && (
                    <p className="text-center text-slate-400 text-[9px] py-2">No tienes plantillas guardadas.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Lista Secuencial del Itinerario */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
            {routeItems.map((item, index) => (
              <div 
                key={item.id}
                className="p-2.5 rounded-xl border border-slate-200/80 bg-white shadow-sm flex items-start gap-2 relative group"
              >
                {/* Indicador Numérico de Parada */}
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5 select-none">
                  {index + 1}
                </div>

                <div className="flex-1 space-y-0.5 min-w-0 pr-6">
                  <h5 className="font-extrabold text-slate-800 text-[11px] tracking-tight leading-tight truncate">{item.name}</h5>
                  <p className="text-[9px] text-slate-400 truncate">{item.address}</p>
                  
                  {/* Navegación individual Punto a Punto (Waze y Google Maps) */}
                  <div className="flex items-center gap-1.5 pt-1.5">
                    <a
                      href={getGoogleMapsSingleLink(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[8px] font-black uppercase tracking-wider text-slate-400 hover:text-cyan-600 flex items-center gap-0.5 transition-colors border border-slate-100 px-1.5 py-0.5 rounded hover:bg-slate-50 bg-white"
                      title="Navegar con Google Maps"
                    >
                      <MapPin size={8} /> G. Maps
                    </a>
                    <a
                      href={getWazeSingleLink(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[8px] font-black uppercase tracking-wider text-slate-400 hover:text-sky-500 flex items-center gap-0.5 transition-colors border border-slate-100 px-1.5 py-0.5 rounded hover:bg-slate-50 bg-white"
                      title="Navegar con Waze"
                    >
                      🚗 Waze
                    </a>
                  </div>
                </div>

                {/* Controles de Ordenación y Remoción */}
                <div className="absolute right-2 top-2 flex flex-col gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button 
                      onClick={() => moveItem(index, 'up')}
                      className="p-0.5 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                      title="Subir parada"
                    >
                      <ArrowUp size={10} />
                    </button>
                  )}
                  {index < routeItems.length - 1 && (
                    <button 
                      onClick={() => moveItem(index, 'down')}
                      className="p-0.5 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                      title="Bajar parada"
                    >
                      <ArrowDown size={10} />
                    </button>
                  )}
                  <button 
                    onClick={() => removeFromRoute(item.id)}
                    className="p-0.5 hover:bg-rose-50 text-rose-500 rounded cursor-pointer mt-0.5"
                    title="Eliminar del itinerario"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}

            {routeItems.length === 0 && (
              <div className="py-16 text-center text-slate-400 text-[11px] font-semibold space-y-2">
                <Map size={24} className="mx-auto text-slate-200 animate-bounce" />
                <p>Tu ruta está vacía.</p>
                <p className="text-[9px] text-slate-400 px-4 leading-normal">
                  Haz clic en el botón <b className="text-cyan-500">+</b> del listado o en los pines del mapa para planificar tus visitas para el **{selectedDay}**.
                </p>
              </div>
            )}
          </div>

          {/* Botones de Navegación GPS (Footer) */}
          <div className="bg-slate-50 border-t border-slate-200/80 p-3 space-y-2 shrink-0">
            <div className="flex gap-2">
              <a
                href={getGoogleMapsRouteLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 py-2 px-3 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
                  routeItems.length === 0 
                    ? 'bg-slate-300 shadow-none pointer-events-none' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
                }`}
              >
                <ExternalLink size={13} /> Abrir GPS (Google Maps)
              </a>
              {routeItems.length > 0 && (
                <button
                  onClick={clearCurrentRoute}
                  className="px-3 py-2 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 rounded-xl text-slate-500 transition-all cursor-pointer"
                  title="Vaciar itinerario de hoy"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <p className="text-[8px] text-slate-400 text-center leading-normal">
              Abre el itinerario ordenado del **{selectedDay}** en tu teléfono móvil para navegar secuencialmente con Google Maps GPS en terreno.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
