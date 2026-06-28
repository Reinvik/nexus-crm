const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Fallback local en caso de que no haya API key o falle la petición
const mockQualify = (name, category, website, address, rating) => {
  const hasWebsite = website && website.trim() !== '' && !website.toLowerCase().includes('no tiene');
  const painPoints = [
    'descontrol en la administración de repuestos y órdenes de trabajo',
    'falta de seguimiento a presupuestos enviados a clientes',
    'procesos manuales en papel para la recepción de vehículos',
    'falta de visibilidad digital y portal de agendamiento para clientes',
    'dificultad para calcular la rentabilidad real de cada mecánico'
  ];
  
  const randomPain = painPoints[Math.floor(Math.random() * painPoints.length)];
  const priority = !hasWebsite ? 'Alta' : (rating < 4 ? 'Media' : 'Baja');
  
  let pitch = '';
  if (!hasWebsite) {
    pitch = `Hola, vi el taller *${name}* en Google Maps. Noté que no tienen sitio web. Te escribo de SmartLean Chile; estamos ofreciendo una *mini mentoría de eficiencia operacional de 15 minutos 100% gratuita* para talleres. Revisamos cómo eliminar fugas de stock de repuestos y digitalizar la recepción sin papeleos. ¿Te tinca agendar una llamada breve esta semana?`;
  } else {
    pitch = `Hola, vi el taller *${name}* en Google Maps. ¡Felicitaciones por su sitio web! Te escribo de SmartLean Chile; estamos ofreciendo una *mini mentoría de eficiencia operacional de 15 minutos 100% gratuita* para coordinar mejor las órdenes de trabajo internas entre mecánicos y recepción. ¿Les interesa agendar una llamada breve esta semana?`;
  }

  return {
    califica: true,
    prioridad: priority,
    dolor_probable: `Probable ${randomPain} (calificado por simulador).`,
    pitch_whatsapp: pitch
  };
};

export const geminiService = {
  async qualifyLead(name, category = 'Taller Mecánico', website = '', address = '', rating = '') {
    if (!geminiApiKey) {
      console.warn('⚠️ VITE_GEMINI_API_KEY no configurada. Usando calificación simulada.');
      // Pequeño delay artificial para simular red
      await new Promise(r => setTimeout(r, 1000));
      return mockQualify(name, category, website, address, rating);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    
    const websiteInfo = website && website.trim() !== '' && !website.toLowerCase().includes('no tiene')
      ? website
      : 'No tiene (Excelente oportunidad de venta)';

    const prompt = `Eres un experto en prospección B2B y marketing digital para talleres mecánicos en Chile.
Analiza este prospecto de Google Maps:
- Taller: ${name}
- Categoría: ${category}
- Sitio Web: ${websiteInfo}
- Dirección: ${address}
- Calificación/Rating: ${rating || 'Sin calificación'}

Determina de forma realista:
1. Si califica como cliente potencial para "Nexus Garage" (SaaS de gestión de talleres en Chile).
2. Prioridad de prospección: "Alta" (por ejemplo, si se ve formal pero no tiene sitio web o tiene bajo rating por desorden), "Media", o "Baja".
3. Dolor operacional probable en el taller (ej. descontrol de stock, recepción lenta, pérdida de historial de clientes).
4. Redacta un mensaje de primer contacto por WhatsApp en español de Chile. Debe ser muy profesional, empático, directo y que mencione el dolor probable sin sonar invasivo.
   IMPORTANTE: La estrategia de entrada NO es vender el software directamente, sino ofrecerle una "Mini Mentoría de Eficiencia Operacional de 15 minutos 100% gratuita" (para revisar su flujo, stock o tiempos en el taller), de modo que tras ganarnos su confianza podamos proponerle Nexus Garage como la herramienta definitiva. Incluye un llamado a la acción claro para agendar esta sesión de mentoría gratis.

Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura (no agregues bloques de código \`\`\`json ni texto adicional, solo el JSON puro):
{
  "califica": true/false,
  "prioridad": "Alta"/"Media"/"Baja",
  "dolor_probable": "descripción muy breve",
  "pitch_whatsapp": "tu mensaje de WhatsApp aquí redactado con emojis profesionales y saltos de línea"
}`;

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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const textResponse = result.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse.trim());
      } else {
        const errorText = await response.text();
        console.error('❌ Error de API en Gemini:', response.status, errorText);
        return mockQualify(name, category, website, address, rating);
      }
    } catch (error) {
      console.error('❌ Excepción al llamar a Gemini:', error);
      return mockQualify(name, category, website, address, rating);
    }
  }
};
