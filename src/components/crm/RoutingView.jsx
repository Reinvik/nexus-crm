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
  Info
} from 'lucide-react';
import L from 'leaflet';

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

export default function RoutingView({ leads }) {
  const [selectedCommune, setSelectedCommune] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [routeItems, setRouteItems] = useState([]);
  const [geocodedLeads, setGeocodedLeads] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Refs de Leaflet
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const polylineLayerRef = useRef(null);

  // Obtener comunas para filtrar
  const communes = ['all', ...new Set(leads.map(l => l.commune).filter(Boolean))];

  // Filtrar los leads activos
  const filteredLeads = leads.filter(lead => {
    const matchesCommune = selectedCommune === 'all' || lead.commune === selectedCommune;
    const matchesStage = selectedStage === 'all' || lead.stage === selectedStage;
    const matchesPriority = selectedPriority === 'all' || lead.priority === selectedPriority;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCommune && matchesStage && matchesPriority && matchesSearch;
  });

  // Efecto para geocodificar la sublista filtrada de leads
  useEffect(() => {
    const geocodeFilteredLeads = async () => {
      setIsGeocoding(true);
      
      // Cache en localStorage para evitar re-peticiones a Nominatim
      const cachedCoordsStr = localStorage.getItem('nexus_crm_geocoded_coords') || '{}';
      const cachedCoords = JSON.parse(cachedCoordsStr);
      let updatedCache = false;

      // Limitamos a procesar un máximo de 40 leads simultáneos para no saturar
      const leadsToProcess = filteredLeads.slice(0, 40);

      const processed = [];
      for (const lead of leadsToProcess) {
        const cacheKey = `${lead.name}_${lead.address}`.toLowerCase();
        let lat, lon;

        if (cachedCoords[cacheKey]) {
          lat = cachedCoords[cacheKey].lat;
          lon = cachedCoords[cacheKey].lon;
        } else {
          // Intentar geocodificación Nominatim aproximada
          try {
            // Buscamos con formato dirección, comuna, Santiago, Chile
            const queryUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${lead.address}, ${lead.commune}, Santiago, Chile`)}&limit=1`;
            
            // Añadir un pequeño sleep para evitar Rate Limit 429
            await new Promise(resolve => setTimeout(resolve, 350));
            const response = await fetch(queryUrl, {
              headers: { 'User-Agent': 'NexusCRM-Geocoding-System/1.0' }
            });

            if (response.ok) {
              const results = await response.json();
              if (results && results.length > 0) {
                lat = parseFloat(results[0].lat);
                lon = parseFloat(results[0].lon);
                cachedCoords[cacheKey] = { lat, lon };
                updatedCache = true;
              }
            }
          } catch (e) {
            console.warn("Geocodificación fallida para:", lead.name);
          }

          // Fallback si falla Nominatim: usar centro de comuna con pequeña dispersión aleatoria
          if (!lat || !lon) {
            const base = getCommuneCoords(lead.commune);
            // Pequeña dispersión aleatoria (0.015) para que no se encimen los marcadores
            const randomOffsetLat = (Math.random() - 0.5) * 0.015;
            const randomOffsetLon = (Math.random() - 0.5) * 0.015;
            lat = base[0] + randomOffsetLat;
            lon = base[1] + randomOffsetLon;
          }
        }

        processed.push({
          ...lead,
          lat,
          lon
        });
      }

      if (updatedCache) {
        localStorage.setItem('nexus_crm_geocoded_coords', JSON.stringify(cachedCoords));
      }

      setGeocodedLeads(processed);
      setIsGeocoding(false);
    };

    geocodeFilteredLeads();
  }, [selectedCommune, selectedStage, selectedPriority, searchTerm, leads]);

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

    const bounds = L.latLngBounds();
    const routeCoords = [];

    // Icono por defecto de taller mecánico (Pin cian y oscuro)
    const defaultIcon = L.divIcon({
      html: `<div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
               <span class="text-xs font-black text-cyan-400">🔧</span>
             </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -10]
    });

    // Dibujar todos los leads geocodificados
    geocodedLeads.forEach(lead => {
      const isSelectedInRoute = routeItems.some(item => item.id === lead.id);
      
      // Icono alternativo si ya está en la ruta
      const icon = isSelectedInRoute
        ? L.divIcon({
            html: `<div class="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                     <span class="text-xs font-black text-white">${routeItems.findIndex(i => i.id === lead.id) + 1}</span>
                   </div>`,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -10]
          })
        : defaultIcon;

      const marker = L.marker([lead.lat, lead.lon], { icon }).addTo(markersLayer);
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
      // Buscar el lead geocodificado correspondiente
      const geo = geocodedLeads.find(l => l.id === item.id);
      if (geo) {
        routeCoords.push([geo.lat, geo.lon]);
      }
    });

    if (routeCoords.length > 1) {
      // Línea poligonal cian semi-transparente con sombra
      L.polyline(routeCoords, {
        color: '#06b6d4', // Cyan 500
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
        lineJoin: 'round'
      }).addTo(polylineLayer);
    }

    // Auto-ajustar vista del mapa si hay marcadores
    if (geocodedLeads.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [geocodedLeads, routeItems]);

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
    // Formato: https://www.google.com/maps/dir/lat1,lon1/lat2,lon2/lat3,lon3
    const base = 'https://www.google.com/maps/dir/';
    const coordsPath = routeItems.map(item => {
      const geo = geocodedLeads.find(l => l.id === item.id);
      return geo ? `${geo.lat},${geo.lon}` : encodeURIComponent(item.address);
    }).join('/');
    return base + coordsPath;
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros de Routing */}
      <div className="glass-panel py-2 px-4 rounded-xl bg-white border border-slate-100 flex flex-wrap gap-4 items-center justify-between shadow-sm text-xs">
        
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
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter size={12} />
            <select
              value={selectedCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-slate-700"
            >
              <option value="all">Todas las Comunas ({communes.length - 1})</option>
              {communes.filter(c => c !== 'all').map(commune => (
                <option key={commune} value={commune}>{commune}</option>
              ))}
            </select>
          </div>

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
            
            {geocodedLeads.map(lead => {
              const inRoute = routeItems.some(i => i.id === lead.id);
              return (
                <div 
                  key={lead.id}
                  className={`p-2.5 rounded-xl border border-slate-100 transition-all text-xs bg-slate-50/50 hover:bg-slate-50 flex justify-between items-start gap-2 ${
                    inRoute ? 'border-cyan-300 bg-cyan-50/10' : ''
                  }`}
                >
                  <div className="space-y-0.5 truncate flex-1">
                    <h5 className="font-extrabold text-slate-800 tracking-tight leading-tight truncate">{lead.name}</h5>
                    <p className="text-[10px] text-slate-400 truncate">{lead.address}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{lead.commune}</p>
                  </div>
                  <button
                    onClick={() => inRoute ? removeFromRoute(lead.id) : addToRoute(lead)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      inRoute 
                        ? 'bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-500 hover:text-white' 
                        : 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-500 hover:text-white'
                    }`}
                    title={inRoute ? "Quitar de mi Ruta" : "Agregar a mi Ruta"}
                  >
                    {inRoute ? <Trash2 size={12} /> : <Plus size={12} />}
                  </button>
                </div>
              );
            })}

            {geocodedLeads.length === 0 && !isGeocoding && (
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
          
          {/* Indicador de carga de geocodificación flotante */}
          {isGeocoding && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur shadow-md border border-slate-200 rounded-full px-3 py-1 text-[10px] font-bold text-slate-600 flex items-center gap-1.5 z-[1000] animate-pulse">
              <RefreshCw size={11} className="animate-spin text-cyan-500" />
              <span>Sanitizando mapa de ruta...</span>
            </div>
          )}
        </div>

        {/* Panel Derecho: Itinerario y Navegación GPS */}
        <div className="lg:col-span-1 flex flex-col bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden h-full">
          <div className="bg-cyan-500 border-b border-cyan-600 p-3 text-white flex justify-between items-center shrink-0">
            <h4 className="font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Navigation size={13} className="animate-pulse" /> Mi Itinerario de Visitas
            </h4>
            <span className="text-[10px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-full">
              {routeItems.length}
            </span>
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
                  Haz clic en el botón <b class="text-cyan-500">+</b> del listado o en los pines del mapa para planificar tus visitas de hoy.
                </p>
              </div>
            )}
          </div>

          {/* Botones de Navegación GPS (Footer) */}
          <div className="bg-slate-50 border-t border-slate-200/80 p-3 space-y-2 shrink-0">
            <a
              href={getGoogleMapsRouteLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-2 px-3 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
                routeItems.length === 0 
                  ? 'bg-slate-300 shadow-none pointer-events-none' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
              }`}
            >
              <ExternalLink size={13} /> Abrir GPS (Google Maps)
            </a>
            <p className="text-[8px] text-slate-400 text-center leading-normal">
              Abre el itinerario ordenado en tu teléfono móvil para navegar secuencialmente con Google Maps GPS en terreno.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
