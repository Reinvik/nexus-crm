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
    updatedAt: dbLead.updated_at || dbLead.updatedAt
  };
};

export const dbService = {
  // === GESTIÓN DE LEADS (PROSPECTOS) ===
  async getLeads() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('crm_leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error) return data.map(mapDbToLead);
        console.warn('Fallback a localStorage debido a error en Supabase:', error);
      } catch (err) {
        console.warn('Fallback a localStorage por excepción:', err);
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
  }
};
