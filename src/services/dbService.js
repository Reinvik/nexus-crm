import { supabase } from './supabaseClient';

// Datos semilla de prueba basados en el Excel del usuario
const DEFAULT_LEADS = [
  {
    id: "lead-1",
    name: "LUBRICENTRO Y VULCANIZACIÓN GUERRERO",
    commune: "Ñuñoa",
    address: "Av. Grecia 3510, Ñuñoa",
    phone: "56987654001",
    website: "",
    email: "contacto@lubricentroguerrero.cl",
    emailType: "No tiene",
    priority: "Alta",
    stage: "demo",
    pain: "Descontrol de stock en lubricantes y vulcanización manual.",
    pitch: "Hola Lubricentro Guerrero. Vimos que tienen excelente atención pero no cuentan con web. Con Nexus Garage pueden automatizar las órdenes de trabajo y control de stock directo en WhatsApp.",
    value: 45000,
    lastVisited: "2026-06-13",
    visitStatus: "Hecha",
    interest: "Interesado",
    nextVisitDate: "2026-06-15",
    nextVisitTime: "09:00",
    notes: "Visita realizada exitosamente. Interesados en una demo formal del sistema de inventarios."
  },
  {
    id: "lead-2",
    name: "LUBRICANTES YURETIC",
    commune: "Ñuñoa",
    address: "Av. Irarrázaval 4210, Ñuñoa",
    phone: "56987654002",
    website: "",
    email: "contacto@lubricantesyuretic.cl",
    emailType: "No tiene",
    priority: "Alta",
    stage: "contacto",
    pain: "Pérdida de ventas por cotización lenta de filtros y aceites.",
    pitch: "Hola Lubricantes Yuretic. ¿Les gustaría automatizar su cotización de aceites? En Nexus Garage digitalizamos el stock para que respondan al instante por WhatsApp.",
    value: 45000,
    lastVisited: "2026-06-13",
    visitStatus: "Hecha",
    interest: "Interesado",
    nextVisitDate: "2026-06-17",
    nextVisitTime: "14:00",
    notes: "Solicitaron reagendar la visita presencial para revisar costos y planes de arriendo."
  },
  {
    id: "lead-3",
    name: "Cheos Garage",
    commune: "Santiago (Centro)",
    address: "Cheos Garage, Santiago Centro",
    phone: "56987654003",
    website: "",
    email: "",
    emailType: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Tiempos muertos por mecánicos sin tareas asignadas digitalmente.",
    pitch: "Hola Cheos Garage. ¿Siguen usando pizarras para asignar las tareas a sus mecánicos? Con Nexus Garage pueden asignar trabajos con solo 2 clics desde el celular.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Prospecto inicial obtenido de la captura de pantalla del Excel. Falta contactar."
  },
  {
    id: "lead-4",
    name: "Taller Farias",
    commune: "Santiago (Centro)",
    address: "Taller Farias, Santiago Centro",
    phone: "56987654004",
    website: "",
    email: "",
    emailType: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Garantías de clientes difíciles de rastrear por uso de papel.",
    pitch: "Hola Taller Farias. Con Nexus Garage pueden almacenar todo el historial de reparaciones y repuestos de cada auto de forma digital e infalible.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Falta contacto telefónico inicial."
  },
  {
    id: "lead-5",
    name: "Automotriz Jmp",
    commune: "Santiago (Centro)",
    address: "Automotriz Jmp, Santiago Centro",
    phone: "56987654005",
    website: "",
    email: "",
    emailType: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Descuadre de caja chica por cobros de mano de obra no registrados.",
    pitch: "Hola equipo de Automotriz Jmp. Con Nexus Garage aseguran que toda mano de obra se registre en el presupuesto digital antes de entregar el vehículo.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Añadido desde Excel."
  },
  {
    id: "lead-6",
    name: "TALLER FLORES LEYTON HNOS LTDA",
    commune: "Santiago (Centro)",
    address: "Taller Flores Leyton Hnos, Santiago Centro",
    phone: "56987654006",
    website: "",
    email: "",
    emailType: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Desorganización en entrega y recepción de vehículos de clientes corporativos.",
    pitch: "Hola Taller Flores Leyton. ¿Cómo controlan el estado de recepción de los autos? Con Nexus Garage envían actas de entrega digitales con fotos directo a sus clientes.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Prospecto corporativo de Santiago Centro."
  },
  {
    id: "lead-7",
    name: "Automotriz Gonzalo Tirado K y cia Ltda",
    commune: "Santiago (Centro)",
    address: "Automotriz Gonzalo Tirado, Santiago Centro",
    phone: "56987654007",
    website: "",
    email: "",
    emailType: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Fugas de dinero por repuestos no cargados a la cotización del cliente.",
    pitch: "Hola Automotriz Gonzalo Tirado. Con nuestro software Nexus Garage, repuesto que sale del pañol es repuesto que se cobra automáticamente en la orden final.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Taller multimarca."
  },
  {
    id: "lead-8",
    name: "Boxes Car Center",
    commune: "Ñuñoa",
    address: "Av. Salvador 2350, Ñuñoa",
    phone: "56987654008",
    website: "https://boxescarcenter.cl/",
    email: "contacto@boxescarcenter.cl",
    emailType: "Corporativo (Formal)",
    priority: "Media",
    stage: "lead",
    pain: "Comunicación ineficiente entre recepción y mecánicos del taller.",
    pitch: "Hola Boxes Car Center. Felicitaciones por su web. ¿Cómo controlan los tiempos de sus mecánicos? Con Nexus Garage ordenan el flujo operativo con tableros digitales.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Tiene sitio web activo. Buena prioridad comercial."
  },
  {
    id: "lead-9",
    name: "R Fernández",
    commune: "Ñuñoa",
    address: "R Fernández, Ñuñoa",
    phone: "56987654009",
    website: "",
    email: "",
    emailType: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Pérdida de historial de mantención de clientes recurrentes.",
    pitch: "Hola taller R Fernández. ¿Siguen usando papel para registrar el historial de los autos? Con Nexus Garage guardan la ficha técnica completa en la nube.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Taller residencial en Ñuñoa."
  },
  {
    id: "lead-10",
    name: "FRENOS BARRIO ITALIA",
    commune: "Ñuñoa",
    address: "Av. Italia 1230, Ñuñoa",
    phone: "56987654010",
    website: "https://www.frenosbarrioitalia.cl/",
    email: "contacto@frenosbarrioitalia.cl",
    emailType: "Corporativo (Formal)",
    priority: "Media",
    stage: "lead",
    pain: "Dificultad para calcular comisiones a mecánicos por trabajos realizados.",
    pitch: "Hola Frenos Barrio Italia. ¿Les gustaría automatizar su cálculo de comisiones? En Nexus Garage medimos la productividad de cada mecánico en tiempo real.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Especialistas en frenos. Web activa."
  },
  {
    id: "lead-11",
    name: "Arvi 4 X 4",
    commune: "Ñuñoa",
    address: "Av. José Pedro Alessandri 890, Ñuñoa",
    phone: "56987654011",
    website: "http://www.arvi4x4.cl/contacto.php",
    email: "contacto@arvi4x4.cl",
    emailType: "Corporativo (Formal)",
    priority: "Media",
    stage: "lead",
    pain: "Seguimiento de compras y repuestos especiales importados.",
    pitch: "Hola equipo de Arvi 4x4. Excelente sitio web. ¿Cómo gestionan el inventario de repuestos especiales? Con Nexus Garage tienen trazabilidad de stock al 100%.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Taller especializado 4x4."
  },
  {
    id: "lead-12",
    name: "Automotriz ServiSucre",
    commune: "Ñuñoa",
    address: "Sucre 1450, Ñuñoa",
    phone: "56987654012",
    website: "",
    email: "",
    emailType: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Desorden en presupuestos escritos a mano y pérdida de confianza.",
    pitch: "Hola Automotriz ServiSucre. ¿Quieren entregar presupuestos digitales formales por WhatsApp en segundos? Con Nexus Garage modernizan su taller al instante.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Falta contacto inicial."
  },
  {
    id: "lead-13",
    name: "Larraguibel mecánica automotriz, Radiadores y Calefacciones",
    commune: "Ñuñoa",
    address: "Larraguibel mecánica, Ñuñoa",
    phone: "56987654013",
    website: "",
    email: "",
    emailType: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Cotizaciones lentas que hacen que el cliente de barrio cotice en otro lado.",
    pitch: "Hola Larraguibel Mecánica. ¿Tardan en cotizar sus servicios? Con Nexus Garage generan y envían la cotización en menos de 5 minutos directo a WhatsApp.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Especialistas en radiadores."
  },
  {
    id: "lead-14",
    name: "Garage Argentino - Cardozo Automotriz SpA",
    commune: "Santiago (Centro)",
    address: "https://maps.app.goo.gl/nYv3GoLfT6j4PUaf9",
    phone: "56987654014",
    website: "https://www.garageargentino.cl/",
    email: "contacto@garageargentino.cl",
    emailType: "Corporativo (Formal)",
    priority: "Media",
    stage: "lead",
    pain: "Administración paralela del stock y repuestos para múltiples mecánicos.",
    pitch: "Hola Garage Argentino. Felicitaciones por su marca. ¿Cómo auditan las salidas de su bodega? Con Nexus Garage cada repuesto se asocia obligatoriamente a una patente.",
    value: 45000,
    lastVisited: "",
    visitStatus: "Ninguna",
    interest: "Indeciso",
    nextVisitDate: "",
    nextVisitTime: "",
    notes: "Excelente prospecto multimarca en Santiago Centro."
  }
];

// Claves de LocalStorage
const LOCAL_LEADS_KEY = 'nexus_crm_leads';
const LOCAL_ACTIVITIES_KEY = 'nexus_crm_activities';

// Inicializar almacenamiento local si no existe
if (!localStorage.getItem(LOCAL_LEADS_KEY)) {
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(DEFAULT_LEADS));
}
if (!localStorage.getItem(LOCAL_ACTIVITIES_KEY)) {
  localStorage.setItem(LOCAL_ACTIVITIES_KEY, JSON.stringify([]));
}

const mapDbToLead = (dbLead) => {
  if (!dbLead) return null;
  return {
    id: dbLead.id,
    name: dbLead.name,
    commune: dbLead.commune,
    address: dbLead.address,
    phone: dbLead.phone,
    website: dbLead.website,
    email: dbLead.email,
    emailType: dbLead.email_type || dbLead.emailType || 'No tiene',
    priority: dbLead.priority,
    stage: dbLead.stage,
    pain: dbLead.pain,
    pitch: dbLead.pitch,
    value: dbLead.value,
    lastVisited: dbLead.last_visited || dbLead.lastVisited || '',
    visitStatus: dbLead.visit_status || dbLead.visitStatus || 'Ninguna',
    interest: dbLead.interest,
    nextVisitDate: dbLead.next_visit_date || dbLead.nextVisitDate || '',
    nextVisitTime: dbLead.next_visit_time || dbLead.nextVisitTime || '',
    notes: dbLead.notes,
    buyerPersona: dbLead.buyer_persona || dbLead.buyerPersona || '',
    openWeekends: dbLead.open_weekends !== undefined ? dbLead.open_weekends : (dbLead.openWeekends || false),
    aptitudeCommitment: dbLead.aptitude_commitment !== undefined ? dbLead.aptitude_commitment : (dbLead.aptitudeCommitment || 3),
    aptitudeDigital: dbLead.aptitude_digital !== undefined ? dbLead.aptitude_digital : (dbLead.aptitudeDigital || 3),
    aptitudeLeadership: dbLead.aptitude_leadership !== undefined ? dbLead.aptitude_leadership : (dbLead.aptitudeLeadership || 3),
    updatedAt: dbLead.updated_at || dbLead.updatedAt
  };
};

export const dbService = {
  // === GESTIÓN DE LEADS (PROSPECTOS) ===
  async getLeads() {
    if (supabase) {
      try {
        let allData = [];
        let from = 0;
        let to = 999;
        let keepFetching = true;

        while (keepFetching) {
          const { data, error } = await supabase
            .from('crm_leads')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, to);

          if (error) {
            console.warn('Error fetching leads range:', error);
            throw error;
          }

          if (data && data.length > 0) {
            allData = [...allData, ...data];
            if (data.length < 1000) {
              keepFetching = false;
            } else {
              from += 1000;
              to += 1000;
            }
          } else {
            keepFetching = false;
          }
        }

        return allData.map(mapDbToLead);
      } catch (err) {
        console.warn('Fallback a localStorage debido a error en Supabase:', err);
      }
    }
    return JSON.parse(localStorage.getItem(LOCAL_LEADS_KEY) || '[]').map(mapDbToLead);
  },

  async saveLead(lead) {
    const isNew = !lead.id;
    const finalLead = {
      ...lead,
      id: lead.id || `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      openWeekends: lead.openWeekends || false,
      aptitudeCommitment: lead.aptitudeCommitment !== undefined ? Number(lead.aptitudeCommitment) : 3,
      aptitudeDigital: lead.aptitudeDigital !== undefined ? Number(lead.aptitudeDigital) : 3,
      aptitudeLeadership: lead.aptitudeLeadership !== undefined ? Number(lead.aptitudeLeadership) : 3,
      updatedAt: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_leads')
          .upsert({
            id: finalLead.id,
            name: finalLead.name,
            commune: finalLead.commune,
            address: finalLead.address,
            phone: finalLead.phone,
            website: finalLead.website,
            email: finalLead.email,
            email_type: finalLead.emailType,
            priority: finalLead.priority,
            stage: finalLead.stage,
            pain: finalLead.pain,
            pitch: finalLead.pitch,
            value: finalLead.value,
            last_visited: finalLead.lastVisited,
            visit_status: finalLead.visitStatus,
            interest: finalLead.interest,
            next_visit_date: finalLead.nextVisitDate,
            next_visit_time: finalLead.nextVisitTime,
            notes: finalLead.notes,
            buyer_persona: finalLead.buyerPersona,
            open_weekends: finalLead.openWeekends,
            aptitude_commitment: finalLead.aptitudeCommitment,
            aptitude_digital: finalLead.aptitudeDigital,
            aptitude_leadership: finalLead.aptitudeLeadership,
            updated_at: finalLead.updatedAt
          })
          .select();

        if (!error) return mapDbToLead(data[0]);
        console.warn('Fallback a localStorage por error en Supabase upsert:', error);
      } catch (err) {
        console.warn('Fallback a localStorage por excepción en Supabase upsert:', err);
      }
    }

    // Guardar en localStorage
    const leads = JSON.parse(localStorage.getItem(LOCAL_LEADS_KEY) || '[]').map(mapDbToLead);
    if (isNew) {
      leads.push(finalLead);
    } else {
      const idx = leads.findIndex(l => l.id === finalLead.id);
      if (idx !== -1) leads[idx] = finalLead;
    }
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(leads));
    return finalLead;
  },

  async deleteLead(id) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('crm_leads')
          .delete()
          .eq('id', id);
        if (!error) return true;
        console.warn('Fallback a localStorage por error en Supabase delete:', error);
      } catch (err) {
        console.warn('Fallback a localStorage por excepción en Supabase delete:', err);
      }
    }

    const leads = JSON.parse(localStorage.getItem(LOCAL_LEADS_KEY) || '[]');
    const filtered = leads.filter(l => l.id !== id);
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(filtered));
    return true;
  },

  // === GESTIÓN DE ACTIVIDADES / SEGUIMIENTOS ===
  async getActivities(leadId = null) {
    if (supabase) {
      try {
        let query = supabase.from('crm_activities').select('*');
        if (leadId) query = query.eq('lead_id', leadId);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error) return data;
      } catch (err) {
        console.warn('Fallback a localStorage para actividades:', err);
      }
    }

    const activities = JSON.parse(localStorage.getItem(LOCAL_ACTIVITIES_KEY) || '[]');
    if (leadId) {
      return activities.filter(a => a.leadId === leadId);
    }
    return activities;
  },

  async saveActivity(activity) {
    const finalActivity = {
      ...activity,
      id: activity.id || `act-${Date.now()}`,
      createdAt: activity.createdAt || new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_activities')
          .upsert({
            id: finalActivity.id,
            lead_id: finalActivity.leadId,
            type: finalActivity.type, // llamada, visita, mail, nota
            description: finalActivity.description,
            created_at: finalActivity.createdAt
          })
          .select();
        if (!error) return data[0];
      } catch (err) {
        console.warn('Fallback a localStorage para guardar actividad:', err);
      }
    }

    const activities = JSON.parse(localStorage.getItem(LOCAL_ACTIVITIES_KEY) || '[]');
    const idx = activities.findIndex(a => a.id === finalActivity.id);
    if (idx !== -1) {
      activities[idx] = finalActivity;
    } else {
      activities.push(finalActivity);
    }
    localStorage.setItem(LOCAL_ACTIVITIES_KEY, JSON.stringify(activities));
    return finalActivity;
  },

  // === GESTIÓN DE PATIO DE CAMIONES ===
  async getTruckTickets() {
    // Retorna los tickets del patio guardados localmente
    const tickets = JSON.parse(localStorage.getItem('nexus_crm_truck_tickets') || '[]');
    return tickets.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));
  },

  async saveTruckTicket(ticket) {
    const tickets = JSON.parse(localStorage.getItem('nexus_crm_truck_tickets') || '[]');
    const isNew = !ticket.id;
    const finalTicket = {
      ...ticket,
      id: ticket.id || `truck-${Date.now()}`,
      entryTime: ticket.entryTime || new Date().toISOString()
    };

    if (isNew) {
      tickets.push(finalTicket);
    } else {
      const idx = tickets.findIndex(t => t.id === finalTicket.id);
      if (idx !== -1) {
        tickets[idx] = finalTicket;
      }
    }
    localStorage.setItem('nexus_crm_truck_tickets', JSON.stringify(tickets));
    return finalTicket;
  },

  async deleteTruckTicket(id) {
    const tickets = JSON.parse(localStorage.getItem('nexus_crm_truck_tickets') || '[]');
    const filtered = tickets.filter(t => t.id !== id);
    localStorage.setItem('nexus_crm_truck_tickets', JSON.stringify(filtered));
    return true;
  },

  // === GESTIÓN DE RUTAS (PERSISTENCIA COMPARTIDA EN BD) ===
  async getRoutes() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_routes')
          .select('*');
        if (!error) return data;
        console.warn('Fallback a localStorage para obtener rutas por error:', error);
      } catch (err) {
        console.warn('Fallback a localStorage para obtener rutas por excepción:', err);
      }
    }
    // Fallback local
    const savedDays = JSON.parse(localStorage.getItem('nexus_crm_routes_by_day') || '{}');
    const savedTemplates = JSON.parse(localStorage.getItem('nexus_crm_route_templates') || '[]');
    
    const dbFormatRoutes = [];
    
    // Rutas por día
    Object.keys(savedDays).forEach(day => {
      dbFormatRoutes.push({
        id: `day-${day.toLowerCase()}`,
        name: day,
        type: 'day',
        items: savedDays[day] || []
      });
    });
    
    // Plantillas
    savedTemplates.forEach(tpl => {
      dbFormatRoutes.push({
        id: tpl.id,
        name: tpl.name,
        type: 'template',
        items: tpl.items || []
      });
    });
    
    return dbFormatRoutes;
  },

  async saveRoute(route) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_routes')
          .upsert({
            id: route.id,
            name: route.name,
            type: route.type,
            items: route.items,
            updated_at: new Date().toISOString()
          })
          .select();
        if (!error) return data[0];
        console.warn('Fallback a localStorage al guardar ruta por error:', error);
      } catch (err) {
        console.warn('Fallback a localStorage al guardar ruta por excepción:', err);
      }
    }

    // Guardar localmente
    if (route.type === 'day') {
      const savedDays = JSON.parse(localStorage.getItem('nexus_crm_routes_by_day') || '{}');
      savedDays[route.name] = route.items;
      localStorage.setItem('nexus_crm_routes_by_day', JSON.stringify(savedDays));
    } else {
      const savedTemplates = JSON.parse(localStorage.getItem('nexus_crm_route_templates') || '[]');
      const idx = savedTemplates.findIndex(t => t.id === route.id);
      if (idx !== -1) {
        savedTemplates[idx] = {
          id: route.id,
          name: route.name,
          items: route.items,
          created_at: new Date().toISOString()
        };
      } else {
        savedTemplates.push({
          id: route.id,
          name: route.name,
          items: route.items,
          created_at: new Date().toISOString()
        });
      }
      localStorage.setItem('nexus_crm_route_templates', JSON.stringify(savedTemplates));
    }
    return route;
  },

  async deleteRoute(id, type, name) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('crm_routes')
          .delete()
          .eq('id', id);
        if (!error) return true;
        console.warn('Fallback a localStorage al borrar ruta por error:', error);
      } catch (err) {
        console.warn('Fallback a localStorage al borrar ruta por excepción:', err);
      }
    }

    // Borrado local
    if (type === 'day') {
      const savedDays = JSON.parse(localStorage.getItem('nexus_crm_routes_by_day') || '{}');
      delete savedDays[name];
      localStorage.setItem('nexus_crm_routes_by_day', JSON.stringify(savedDays));
    } else {
      const savedTemplates = JSON.parse(localStorage.getItem('nexus_crm_route_templates') || '[]');
      const filtered = savedTemplates.filter(t => t.id !== id);
      localStorage.setItem('nexus_crm_route_templates', JSON.stringify(filtered));
    }
    return true;
  },

  // ==========================================
  // MÓDULO DE CLIENTES & ADDONS (NK-126 & NK-128)
  // ==========================================
  async getCustomers() {
    const DEFAULT_CUSTOMERS = [
      {
        id: "cust-1",
        name: "Carlos Mora",
        company: "Taller Mecánico San Cristóbal",
        rut: "76.452.910-K",
        phone: "+56987654001",
        email: "carlos@tallersancristobal.cl",
        address: "Av. Recoleta 1420",
        commune: "Recoleta",
        city: "Santiago",
        status: "active",
        plan: "basico",
        plan_name: "Nexus Garage - Básico",
        base_fee: 45000,
        billing_day: 5,
        payment_method: "transferencia",
        additional_services: [
          {
            id: "addon-1",
            name: "Manejo Web & Redes Sociales",
            category: "marketing",
            price: 35000,
            recurrence: "mensual",
            notes: "Gestión de perfil Google Business y publicaciones mensuales"
          }
        ],
        notes: "Cliente pionero. Muy satisfecho con el módulo de órdenes de trabajo."
      },
      {
        id: "cust-2",
        name: "Roberto Guerrero",
        company: "Lubricentro Guerrero",
        rut: "77.104.882-3",
        phone: "+56987654002",
        email: "contacto@lubricentroguerrero.cl",
        address: "Av. Grecia 3510",
        commune: "Ñuñoa",
        city: "Santiago",
        status: "active",
        plan: "pro",
        plan_name: "Nexus Garage - Pro",
        base_fee: 75000,
        billing_day: 15,
        payment_method: "transferencia",
        additional_services: [
          {
            id: "addon-2",
            name: "Campaña Meta Ads (Captación de Clientes)",
            category: "publicidad",
            price: 45000,
            recurrence: "mensual",
            notes: "Presupuesto de gestión para anuncios de cambio de aceite"
          },
          {
            id: "addon-3",
            name: "Integración WhatsApp Notificaciones",
            category: "integracion",
            price: 20000,
            recurrence: "mensual",
            notes: "Avisos automáticos de vehículo listo"
          }
        ],
        notes: "Usa activamente el control de stock de lubricantes y filtros."
      },
      {
        id: "cust-3",
        name: "José Sepúlveda",
        company: "Cheos Garage",
        rut: "76.882.115-4",
        phone: "+56987654003",
        email: "cheos.garage@gmail.com",
        address: "San Diego 1840",
        commune: "Santiago (Centro)",
        city: "Santiago",
        status: "active",
        plan: "basico",
        plan_name: "Nexus Garage - Básico",
        base_fee: 45000,
        billing_day: 1,
        payment_method: "transferencia",
        additional_services: [],
        notes: "Pagos siempre puntuales el día 1 de cada mes."
      },
      {
        id: "cust-4",
        name: "Juan Pablo Morales",
        company: "Automotriz JMP",
        rut: "76.993.412-8",
        phone: "+56987654005",
        email: "contacto@automotrizjmp.cl",
        address: "Portugal 620",
        commune: "Santiago (Centro)",
        city: "Santiago",
        status: "active",
        plan: "custom",
        plan_name: "Nexus Garage - Plan Personalizado",
        base_fee: 110000,
        billing_day: 20,
        payment_method: "transferencia",
        additional_services: [
          {
            id: "addon-4",
            name: "Soporte Prioritario & Capacitación 1 a 1",
            category: "soporte",
            price: 30000,
            recurrence: "mensual",
            notes: "Llamada mensual de optimización de procesos"
          }
        ],
        notes: "Taller grande con 4 mecánicos y área de pintura."
      }
    ];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_customers')
          .select('*')
          .order('name');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Fallback a localStorage en getCustomers:', err);
      }
    }

    const localData = localStorage.getItem('nexus_crm_customers');
    if (!localData) {
      localStorage.setItem('nexus_crm_customers', JSON.stringify(DEFAULT_CUSTOMERS));
      return DEFAULT_CUSTOMERS;
    }
    
    // NK-139: Sanitizar registros previos en localStorage para evitar IDs vacíos que colisionen
    let parsed = [];
    try {
      parsed = JSON.parse(localData);
    } catch {
      parsed = DEFAULT_CUSTOMERS;
    }

    let hasRepaired = false;
    const sanitized = parsed.map((c, idx) => {
      if (!c.id || String(c.id).trim() === '') {
        hasRepaired = true;
        return { ...c, id: `cust-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}` };
      }
      return c;
    });

    if (hasRepaired) {
      localStorage.setItem('nexus_crm_customers', JSON.stringify(sanitized));
    }

    return sanitized;
  },

  async saveCustomer(customer) {
    // NK-139: Asegurar ID único estricto siempre antes de guardar
    const customerId = (customer.id && String(customer.id).trim() !== '')
      ? String(customer.id).trim()
      : `cust-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const customerToSave = {
      ...customer,
      id: customerId,
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_customers')
          .upsert(customerToSave)
          .select();
        if (!error && data && data.length > 0) return data[0];
        if (error) {
          console.warn('Fallback a localStorage en saveCustomer (Supabase):', error.message);
        }
      } catch (err) {
        console.warn('Fallback a localStorage en saveCustomer por excepción:', err);
      }
    }

    const localCustomers = JSON.parse(localStorage.getItem('nexus_crm_customers') || '[]');
    const idx = localCustomers.findIndex(c => String(c.id) === String(customerToSave.id));
    let finalCustomer;
    if (idx !== -1) {
      finalCustomer = { ...localCustomers[idx], ...customerToSave };
      localCustomers[idx] = finalCustomer;
    } else {
      finalCustomer = {
        ...customerToSave,
        created_at: customerToSave.created_at || new Date().toISOString()
      };
      localCustomers.unshift(finalCustomer);
    }
    localStorage.setItem('nexus_crm_customers', JSON.stringify(localCustomers));
    return finalCustomer;
  },

  async deleteCustomer(id) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('crm_customers')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Fallback a localStorage en deleteCustomer:', err);
      }
    }

    const localCustomers = JSON.parse(localStorage.getItem('nexus_crm_customers') || '[]');
    const filtered = localCustomers.filter(c => String(c.id) !== String(id));
    localStorage.setItem('nexus_crm_customers', JSON.stringify(filtered));
    return true;
  },

  // ==========================================
  // MÓDULO DE AGENDAMIENTO & CITAS (NK-125)
  // ==========================================
  async getAgendaEvents() {
    const today = new Date().toISOString().split('T')[0];
    const DEFAULT_EVENTS = [
      {
        id: "evt-1",
        title: "Demostración Sistema de Inventario & WhatsApp",
        type: "demo",
        date: today,
        time: "10:00",
        endTime: "11:30",
        lead_or_customer_id: "lead-1",
        contact_name: "Roberto Guerrero (Lubricentro Guerrero)",
        phone: "+56987654001",
        location: "Av. Grecia 3510, Ñuñoa",
        status: "pendiente",
        notes: "Mostrar catálogo de filtros y cómo enviar el comprobante por WhatsApp."
      },
      {
        id: "evt-2",
        title: "Seguimiento de Satisfacción & Nuevos Addons",
        type: "seguimiento",
        date: today,
        time: "15:00",
        endTime: "15:45",
        lead_or_customer_id: "cust-1",
        contact_name: "Carlos Mora (Taller San Cristóbal)",
        phone: "+56987654001",
        location: "Llamada Telefónica / Google Meet",
        status: "pendiente",
        notes: "Consultar si necesitan incorporar módulo de cotizaciones rápidas."
      },
      {
        id: "evt-3",
        title: "Visita en Terreno: Revisión de Flujo Mecánicos",
        type: "visita",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: "11:00",
        endTime: "12:30",
        lead_or_customer_id: "cust-4",
        contact_name: "Juan Pablo Morales (Automotriz JMP)",
        phone: "+56987654005",
        location: "Portugal 620, Santiago Centro",
        status: "pendiente",
        notes: "Revisión presencial para coordinar nueva capacitación del equipo."
      }
    ];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_agenda_events')
          .select('*')
          .order('date', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Fallback a localStorage en getAgendaEvents:', err);
      }
    }

    const localData = localStorage.getItem('nexus_crm_agenda_events');
    if (!localData) {
      localStorage.setItem('nexus_crm_agenda_events', JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }
    return JSON.parse(localData);
  },

  async saveAgendaEvent(event) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_agenda_events')
          .upsert(event)
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Fallback a localStorage en saveAgendaEvent:', err);
      }
    }

    const localEvents = JSON.parse(localStorage.getItem('nexus_crm_agenda_events') || '[]');
    const idx = localEvents.findIndex(e => e.id === event.id);
    if (idx !== -1) {
      localEvents[idx] = { ...event, updated_at: new Date().toISOString() };
    } else {
      localEvents.unshift({ ...event, id: event.id || `evt-${Date.now()}`, created_at: new Date().toISOString() });
    }
    localStorage.setItem('nexus_crm_agenda_events', JSON.stringify(localEvents));
    return event;
  },

  async deleteAgendaEvent(id) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('crm_agenda_events')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Fallback a localStorage en deleteAgendaEvent:', err);
      }
    }

    const localEvents = JSON.parse(localStorage.getItem('nexus_crm_agenda_events') || '[]');
    const filtered = localEvents.filter(e => e.id !== id);
    localStorage.setItem('nexus_crm_agenda_events', JSON.stringify(filtered));
    return true;
  },

  // ==========================================
  // MÓDULO DE FINANZAS & GASTOS (NK-127)
  // ==========================================
  async getExpenses() {
    const today = new Date().toISOString().split('T')[0];
    const DEFAULT_EXPENSES = [
      {
        id: "exp-1",
        title: "Supabase Database Pro Tier",
        category: "servidores",
        category_label: "Servidores & Infraestructura",
        amount: 25000,
        currency: "CLP",
        date: today,
        vendor: "Supabase Inc.",
        payment_method: "tarjeta",
        notes: "Base de datos cloud PostgreSQL para Nexus CRM y Nexus Garage."
      },
      {
        id: "exp-2",
        title: "OpenAI API Usage (GPT-4o & Embeddings)",
        category: "ia_apis",
        category_label: "APIs & Modelos de IA",
        amount: 19500,
        currency: "CLP",
        date: today,
        vendor: "OpenAI",
        payment_method: "tarjeta",
        notes: "Consumo de API para generación inteligente de pitch y resúmenes."
      },
      {
        id: "exp-3",
        title: "Google Gemini 2.5 Pro & Flash Tokens",
        category: "ia_apis",
        category_label: "APIs & Modelos de IA",
        amount: 14000,
        currency: "CLP",
        date: today,
        vendor: "Google Cloud Platform",
        payment_method: "tarjeta",
        notes: "Clasificación de prospectos y análisis contextual de talleres."
      },
      {
        id: "exp-4",
        title: "Vercel Pro Team Hosting",
        category: "servidores",
        category_label: "Servidores & Infraestructura",
        amount: 20000,
        currency: "CLP",
        date: today,
        vendor: "Vercel Inc.",
        payment_method: "tarjeta",
        notes: "Deploy y CDN para aplicaciones Next.js y React."
      },
      {
        id: "exp-5",
        title: "Meta Ads Campaña Captación Talleres Mecánicos",
        category: "marketing",
        category_label: "Publicidad & Marketing",
        amount: 45000,
        currency: "CLP",
        date: today,
        vendor: "Meta Platforms",
        payment_method: "tarjeta",
        notes: "Anuncios dirigidos a dueños de talleres en Santiago y Región Metropolitana."
      },
      {
        id: "exp-6",
        title: "Combustible Visitas en Terreno (Rutas Santiago)",
        category: "traslados",
        category_label: "Traslados & Visitas Terreno",
        amount: 25000,
        currency: "CLP",
        date: today,
        vendor: "Copec",
        payment_method: "tarjeta",
        notes: "Recorridos presenciales comunas Ñuñoa, Recoleta y Santiago Centro."
      },
      {
        id: "exp-7",
        title: "TAG & Peajes Autopistas Central y Vespucio",
        category: "traslados",
        category_label: "Traslados & Visitas Terreno",
        amount: 9500,
        currency: "CLP",
        date: today,
        vendor: "Autopista Central",
        payment_method: "transferencia",
        notes: "Pase diario y telepeajes de rutas comerciales de la semana."
      }
    ];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_expenses')
          .select('*')
          .order('date', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Fallback a localStorage en getExpenses:', err);
      }
    }

    const localData = localStorage.getItem('nexus_crm_expenses');
    if (!localData) {
      localStorage.setItem('nexus_crm_expenses', JSON.stringify(DEFAULT_EXPENSES));
      return DEFAULT_EXPENSES;
    }
    return JSON.parse(localData);
  },

  async saveExpense(expense) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_expenses')
          .upsert(expense)
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Fallback a localStorage en saveExpense:', err);
      }
    }

    const localExpenses = JSON.parse(localStorage.getItem('nexus_crm_expenses') || '[]');
    const idx = localExpenses.findIndex(e => e.id === expense.id);
    if (idx !== -1) {
      localExpenses[idx] = { ...expense, updated_at: new Date().toISOString() };
    } else {
      localExpenses.unshift({ ...expense, id: expense.id || `exp-${Date.now()}`, created_at: new Date().toISOString() });
    }
    localStorage.setItem('nexus_crm_expenses', JSON.stringify(localExpenses));
    return expense;
  },

  async deleteExpense(id) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('crm_expenses')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Fallback a localStorage en deleteExpense:', err);
      }
    }

    const localExpenses = JSON.parse(localStorage.getItem('nexus_crm_expenses') || '[]');
    const filtered = localExpenses.filter(e => e.id !== id);
    localStorage.setItem('nexus_crm_expenses', JSON.stringify(filtered));
    return true;
  }
};
