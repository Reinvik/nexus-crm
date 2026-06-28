import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:BNX6C1301708S@db.qtzpzgwyjptbnipvyjdu.supabase.co:5432/postgres";

const LEADS_DATA = [
  {
    id: "lead-1",
    name: "LUBRICENTRO Y VULCANIZACIÓN GUERRERO",
    commune: "Ñuñoa",
    address: "Av. Grecia 3510, Ñuñoa",
    phone: "56987654001",
    website: "",
    email: "contacto@lubricentroguerrero.cl",
    email_type: "No tiene",
    priority: "Alta",
    stage: "demo",
    pain: "Descontrol de stock en lubricantes y vulcanización manual.",
    pitch: "Hola Lubricentro Guerrero. Vimos que tienen excelente atención pero no cuentan con web. Con Nexus Garage pueden automatizar las órdenes de trabajo y control de stock directo en WhatsApp.",
    value: 45000,
    last_visited: "2026-06-13",
    visit_status: "Hecha",
    interest: "Interesado",
    next_visit_date: "2026-06-15",
    next_visit_time: "09:00",
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
    email_type: "No tiene",
    priority: "Alta",
    stage: "contacto",
    pain: "Pérdida de ventas por cotización lenta de filtros y aceites.",
    pitch: "Hola Lubricantes Yuretic. ¿Les gustaría automatizar su cotización de aceites? En Nexus Garage digitalizamos el stock para que respondan al instante por WhatsApp.",
    value: 45000,
    last_visited: "2026-06-13",
    visit_status: "Hecha",
    interest: "Interesado",
    next_visit_date: "2026-06-17",
    next_visit_time: "14:00",
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
    email_type: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Tiempos muertos por mecánicos sin tareas asignadas digitalmente.",
    pitch: "Hola Cheos Garage. ¿Siguen usando pizarras para asignar las tareas a sus mecánicos? Con Nexus Garage pueden asignar trabajos con solo 2 clics desde el celular.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Garantías de clientes difíciles de rastrear por uso de papel.",
    pitch: "Hola Taller Farias. Con Nexus Garage pueden almacenar todo el historial de reparaciones y repuestos de cada auto de forma digital e infalible.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Descuadre de caja chica por cobros de mano de obra no registrados.",
    pitch: "Hola equipo de Automotriz Jmp. Con Nexus Garage aseguran que toda mano de obra se registre en el presupuesto digital antes de entregar el vehículo.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Desorganización en entrega y recepción de vehículos de clientes corporativos.",
    pitch: "Hola Taller Flores Leyton. ¿Cómo controlan el estado de recepción de los autos? Con Nexus Garage envían actas de entrega digitales con fotos directo a sus clientes.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Fugas de dinero por repuestos no cargados a la cotización del cliente.",
    pitch: "Hola Automotriz Gonzalo Tirado. Con nuestro software Nexus Garage, repuesto que sale del pañol es repuesto que se cobra automáticamente en la orden final.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "Corporativo (Formal)",
    priority: "Media",
    stage: "lead",
    pain: "Comunicación ineficiente entre recepción y mecánicos del taller.",
    pitch: "Hola Boxes Car Center. Felicitaciones por su web. ¿Cómo controlan los tiempos de sus mecánicos? Con Nexus Garage ordenan el flujo operativo con tableros digitales.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Pérdida de historial de mantención de clientes recurrentes.",
    pitch: "Hola taller R Fernández. ¿Siguen usando papel para registrar el historial de los autos? Con Nexus Garage guardan la ficha técnica completa en la nube.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "Corporativo (Formal)",
    priority: "Media",
    stage: "lead",
    pain: "Dificultad para calcular comisiones a mecánicos por trabajos realizados.",
    pitch: "Hola Frenos Barrio Italia. ¿Les gustaría automatizar su cálculo de comisiones? En Nexus Garage medimos la productividad de cada mecánico en tiempo real.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "Corporativo (Formal)",
    priority: "Media",
    stage: "lead",
    pain: "Seguimiento de compras y repuestos especiales importados.",
    pitch: "Hola equipo de Arvi 4x4. Excelente sitio web. ¿Cómo gestionan el inventario de repuestos especiales? Con Nexus Garage tienen trazabilidad de stock al 100%.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Desorden en presupuestos escritos a mano y pérdida de confianza.",
    pitch: "Hola Automotriz ServiSucre. ¿Quieren entregar presupuestos digitales formales por WhatsApp en segundos? Con Nexus Garage modernizan su taller al instante.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "No tiene",
    priority: "Alta",
    stage: "lead",
    pain: "Cotizaciones lentas que hacen que el cliente de barrio cotice en otro lado.",
    pitch: "Hola Larraguibel Mecánica. ¿Tardan en cotizar sus servicios? Con Nexus Garage generan y envían la cotización en menos de 5 minutos directo a WhatsApp.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
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
    email_type: "Corporativo (Formal)",
    priority: "Media",
    stage: "lead",
    pain: "Administración paralela del stock y repuestos para múltiples mecánicos.",
    pitch: "Hola Garage Argentino. Felicitaciones por su marca. ¿Cómo auditan las salidas de su bodega? Con Nexus Garage cada repuesto se asocia obligatoriamente a una patente.",
    value: 45000,
    last_visited: "",
    visit_status: "Ninguna",
    interest: "Indeciso",
    next_visit_date: "",
    next_visit_time: "",
    notes: "Excelente prospecto multimarca en Santiago Centro."
  }
];

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🔌 Conectado a la base de datos para poblar Leads...");
    
    // Limpiar tabla antes para evitar duplicidad de ids de pruebas antiguos
    await client.query("DELETE FROM crm_leads");
    console.log("🧹 Tabla crm_leads limpiada.");

    for (const lead of LEADS_DATA) {
      const query = `
        INSERT INTO crm_leads (
          id, name, commune, address, phone, website, email, email_type, 
          priority, stage, pain, pitch, value, last_visited, visit_status, 
          interest, next_visit_date, next_visit_time, notes, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW()
        )
      `;
      
      const values = [
        lead.id, lead.name, lead.commune, lead.address, lead.phone, lead.website, lead.email, lead.email_type,
        lead.priority, lead.stage, lead.pain, lead.pitch, lead.value, lead.last_visited, lead.visit_status,
        lead.interest, lead.next_visit_date, lead.next_visit_time, lead.notes
      ];

      await client.query(query, values);
    }
    
    console.log(`✅ ${LEADS_DATA.length} leads reales insertados con éxito en la base de datos de producción.`);
  } catch (err) {
    console.error("❌ Error al insertar leads reales:", err);
  } finally {
    await client.end();
  }
}

run();
