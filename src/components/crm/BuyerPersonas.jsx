import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Target, 
  AlertCircle, 
  Smile, 
  BookmarkCheck, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

const PERSONAS_DATA = [
  {
    id: 'marcelo',
    name: 'Marcelo "El Pragmático"',
    avatarBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    tagColor: 'bg-blue-100 text-blue-800',
    title: 'Dueño y Administrador de Taller Integral',
    demographics: {
      role: 'Propietario / Administrador único',
      age: '40 - 55 años',
      location: 'Zonas de alto flujo (10 de Julio, Barrio Brasil, polos industriales RM)',
      techLevel: 'Básico/Intermedio (WhatsApp Web, Excel propio, portales bancarios)'
    },
    gemba: 'Marcelo levantó su taller a pulso. Conoce de mecánica, pero hoy su rol es 80% administrativo y de atención. Su negocio ha crecido (maneja de 5 a 10 bahías y repuestos), pero apaga incendios todo el día: discute con proveedores, calma clientes e interroga mecánicos. Está agotado del desorden.',
    pains: [
      { title: 'Fugas de Inventario', desc: 'Los repuestos "desaparecen" o se usan en autos sin registrarse en la orden de cobro final.' },
      { title: 'Tiempos Muertos', desc: 'Los mecánicos pierden tiempo caminando a la oficina para preguntar qué hacer o pedir repuestos.' },
      { title: 'Falta de Trazabilidad', desc: 'Buscar el historial de un auto de hace 3 meses en archivadores de papel es una pesadilla.' },
      { title: 'Dependencia Absoluta', desc: 'Siente que si él no está en el taller la operación colapsa. No tiene métricas en tiempo real.' }
    ],
    goals: [
      { title: 'Control y Tranquilidad', desc: 'Estandarizar procesos para irse a su casa a las 18:00 sabiendo que no se perdió nada.' },
      { title: 'Profesionalismo', desc: 'Enviar cotizaciones formales por WhatsApp rápidamente en lugar de mensajes informales.' },
      { title: 'Rentabilidad Oculta', desc: 'Identificar qué servicios y mecánicos le dejan margen real y cuáles le generan pérdidas.' }
    ],
    objections: [
      { obj: '"Los sistemas son enredados, mis maestros no querrán usar eso."', reb: 'Demostrar que la app del mecánico requiere solo 3 clics desde cualquier celular.' },
      { obj: '"Ya pagué por un programa que no funcionó y me dejaron botado."', reb: 'Enfatizar el modelo de acompañamiento y ordenamiento de procesos previo a encender el software.' },
      { obj: '"No quiero pagar mensualidades eternas, prefiero un pago único."', reb: 'Explicar el SaaS como un servicio de mejora continua e innovación que se paga solo recuperando 1 repuesto perdido al mes.' }
    ],
    nexusValue: 'Enfoque en el Gemba (pensado desde el flujo real del taller, no del escritorio) + Cruce de stock automático + Modelo de acompañamiento de mejora continua.',
    mentorship: {
      focus: "Auditoría de repuestos y reducción de tiempos muertos.",
      hook: "Ofrecerle un Gemba Walk (recorrido) de 15 minutos en su taller para mapear dónde se pierde el stock físico y cómo ordenarlo."
    }
  },
  {
    id: 'sebastian',
    name: 'Sebastián "El Tecno-Heredero"',
    avatarBg: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    tagColor: 'bg-cyan-100 text-cyan-800',
    title: 'Hijo del Fundador y Sucesor del Taller',
    demographics: {
      role: 'Administrador / Socio Minoritario',
      age: '25 - 35 años',
      location: 'Zonas residenciales consolidadas o sucursales en crecimiento',
      techLevel: 'Avanzado (Domina redes sociales, apps de delivery, busca automatizar todo)'
    },
    gemba: 'Sebastián se está haciendo cargo del taller fundado por su padre. Quiere dar el salto a la modernización y rentabilizar el negocio familiar. Es dinámico y enfocado en la marca digital, pero choca constantemente con la vieja escuela: su padre (que prefiere el papel) y los mecánicos antiguos reacios a cambiar sus hábitos.',
    pains: [
      { title: 'Resistencia al Cambio', desc: 'Mecánicos experimentados sabotean o evitan usar herramientas digitales.' },
      { title: 'Falta de Reputación Online', desc: 'Le cuesta atraer clientes jóvenes que exigen agendamiento web y transparencia.' },
      { title: 'Pérdida de Clientes por Espera', desc: 'Clientes se van si el presupuesto no les llega en menos de 20 minutos por celular.' }
    ],
    goals: [
      { title: 'Escalabilidad del Taller', desc: 'Crear procesos repetibles para abrir una segunda sucursal sin perder el control.' },
      { title: 'Digitalización Completa', desc: 'Lograr una operación cero papel y agendamientos web automáticos.' },
      { title: 'Transparencia de Cara al Cliente', desc: 'Enviar reportes con fotos del daño mecánico para justificar el cobro.' }
    ],
    objections: [
      { obj: '"Mi papá dice que el papel nunca falla y que para qué gastar en esto."', reb: 'Mostrar números reales de cuánto se pierde al mes por retrasos en repuestos y cotizaciones lentas.' },
      { obj: '"Tengo miedo de que los mecánicos antiguos renuncien si los obligo."', reb: 'Capacitación uno a uno amigable. Mostrarles que el sistema les ayuda a documentar su trabajo y recibir incentivos.' }
    ],
    nexusValue: 'Agendamiento Web Integrado + Envío de Presupuestos Digitales con fotos + Fichas de mecánicos para medir incentivos por productividad.',
    mentorship: {
      focus: "Mitigación de la resistencia al cambio del equipo y marketing digital.",
      hook: "Analizar cómo estructurar incentivos para que sus mecánicos quieran ingresar datos y cómo triplicar la velocidad de cotización."
    }
  },
  {
    id: 'hugo',
    name: 'Don Hugo "El Tradicionalista"',
    avatarBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    tagColor: 'bg-amber-100 text-amber-800',
    title: 'Dueño de Taller Mecánico Tradicional de Barrio',
    demographics: {
      role: 'Propietario y mecánico líder',
      age: '55+ años',
      location: 'Talleres tradicionales residenciales de comunas consolidadas',
      techLevel: 'Nulo/Mínimo (Solo llamadas, mensajes básicos de WhatsApp, desconfía de la nube)'
    },
    gemba: 'Don Hugo es una institución en su barrio. Repara autos con gran maestría, pero su oficina es una pila de cuadernos viejos, boletas sueltas y cajas de repuestos sin clasificar. Los clientes confían en él, pero está perdiendo autos nuevos porque sus cotizaciones tardan días y no tiene cómo dar seguimiento rápido.',
    pains: [
      { title: 'Olvidar Cobros e IVA', desc: 'Se le pasa cobrar horas de mano de obra adicionales o calcular correctamente el IVA.' },
      { title: 'Pérdida de Clientes Jóvenes', desc: 'Los conductores jóvenes no vuelven si el diagnóstico es verbal y no formal.' },
      { title: 'Problemas de Comunicación', desc: 'Pasa horas respondiendo el teléfono para dar avances a clientes en vez de trabajar en el elevador.' }
    ],
    goals: [
      { title: 'Mantener el Legado', desc: 'Evitar que el taller decaiga frente a cadenas modernas del retail automotriz.' },
      { title: 'Ordenar sus Cuentas', desc: 'Saber exactamente cuánto dinero le queda a fin de mes libre de deudas.' }
    ],
    objections: [
      { obj: '"A mi edad ya no estoy para andar aprendiendo programas de computadores."', reb: 'Nexus Garage es tan intuitivo que se maneja casi en su totalidad con WhatsApp.' },
      { obj: '"La gente me conoce a mí, no necesitan un sistema digital."', reb: 'Mostrarle que la imagen profesional de sus cotizaciones aumentará la confianza y le permitirá cobrar tarifas justas.' }
    ],
    nexusValue: 'Cotizador rápido de 2 pasos + Enlace automático a WhatsApp Web para enviar avances + Simplificación tributaria y financiera básica.',
    mentorship: {
      focus: "Cálculo de tarifas de mano de obra y retención de clientes.",
      hook: "Ayudarle a calcular el costo real de su hora de trabajo para que deje de regalar su mano de obra y configurar un WhatsApp rápido para cotizar."
    }
  },
  {
    id: 'socios',
    name: 'Consorcio "Socios Multi-Taller"',
    avatarBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    tagColor: 'bg-purple-100 text-purple-800',
    title: 'Sociedad Comercial con Múltiples Sucursales',
    demographics: {
      role: 'Socios Directores / Gerentes Generales',
      age: '35 - 50 años',
      location: 'Múltiples comunas de Santiago o regiones principales',
      techLevel: 'Intermedio/Avanzado (Exigen dashboards financieros, KPIs y control de auditoría)'
    },
    gemba: 'Dos o más socios que administran de 2 a 5 sucursales. Tienen un gerente o recepcionista en cada local. No están en el Gemba todos los días. Exigen un control férreo porque sospechan de mermas de inventario y caja chica en locales específicos. Necesitan comparar el rendimiento de las sucursales para tomar decisiones de expansión.',
    pains: [
      { title: 'Falta de Consolidación', desc: 'Deben juntar archivos Excel de cada taller a fin de mes para saber si ganaron dinero.' },
      { title: 'Desconfianza / Mermas', desc: 'Sospecha de robos de repuestos e ingresos no registrados por parte de los recepcionistas.' },
      { title: 'Inconsistencia Operativa', desc: 'Un local atiende excelente y el otro recibe reclamos constantes por retrasos en entregas.' }
    ],
    goals: [
      { title: 'Control Centralizado', desc: 'Ver en una sola pantalla las órdenes de trabajo activas y ventas de todas las sucursales.' },
      { title: 'Auditoría Total', desc: 'Trazar qué repuesto compró cada local y en qué vehículo se instaló de forma obligatoria.' },
      { title: 'Estandarización de Marca', desc: 'Garantizar que el cliente reciba la misma experiencia premium en cualquier sucursal.' }
    ],
    objections: [
      { obj: '"Es muy caro licenciar un sistema corporativo para cada local."', reb: 'Explicar que la rentabilidad recuperada al auditar el inventario amortiza la suscripción en el primer mes.' },
      { obj: '"Mis administradores de sucursal no quieren perder su autonomía."', reb: 'El sistema les ayuda a ellos a reportar más rápido y comisionar de forma clara por sus metas de sucursal.' }
    ],
    nexusValue: 'Dashboard Multitaller consolidado + Roles y permisos de usuario avanzados + Historial de auditoría de movimientos de bodega inter-sucursal.',
    mentorship: {
      focus: "Consolidación de sucursales y control de mermas inter-bodega.",
      hook: "Estructurar un reporte gerencial semanal express para auditar la caja chica y el inventario de todas sus sucursales en menos de 5 minutos."
    }
  }
];

export default function BuyerPersonas() {
  const [activeTab, setActiveTab] = useState('marcelo');

  const currentPersona = PERSONAS_DATA.find(p => p.id === activeTab);

  return (
    <div className="space-y-6">
      
      {/* Selector de Pestañas (Horizontal) */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {PERSONAS_DATA.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`
              px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer border
              ${activeTab === p.id 
                ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/15' 
                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'}
            `}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Ficha Detallada del Buyer Persona */}
      {currentPersona && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tarjeta de Perfil & Datos Demográficos */}
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100/80 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-black text-lg ${currentPersona.avatarBg}`}>
                  {currentPersona.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">
                    {currentPersona.name}
                  </h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${currentPersona.tagColor}`}>
                    {currentPersona.title}
                  </span>
                </div>
              </div>

              {/* Demográficos */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Perfil Comercial</h4>
                
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 block">Rol Decisor</span>
                    <span className="text-slate-700 font-semibold">{currentPersona.demographics.role}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Edad Promedio</span>
                    <span className="text-slate-700 font-semibold">{currentPersona.demographics.age}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Ubicación Clave</span>
                    <span className="text-slate-700 font-semibold">{currentPersona.demographics.location}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Nivel Digital</span>
                    <span className="text-slate-700 font-semibold">{currentPersona.demographics.techLevel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {/* Propuesta de Valor Clave */}
              <div className="pt-4 border-t border-slate-100 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 mb-2 text-cyan-600">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Gancho Nexus Garage</span>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                  {currentPersona.nexusValue}
                </p>
              </div>

              {/* Estrategia de Mentoría Gratis */}
              <div className="pt-4 border-t border-slate-100 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-1.5 mb-2 text-emerald-600">
                  <Smile size={14} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Entrada: Mentoría Gratis</span>
                </div>
                <div className="text-xs text-slate-650 leading-relaxed font-semibold space-y-1.5">
                  <p><span className="font-extrabold text-slate-800">Foco del Diagnóstico:</span> {currentPersona.mentorship.focus}</p>
                  <p><span className="font-extrabold text-slate-800">Gancho Comercial:</span> {currentPersona.mentorship.hook}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Gemba, Dolores y Metas */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* El Gemba (Día a Día) */}
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <BookOpen size={16} className="text-cyan-500" />
                <h4 className="text-xs font-black uppercase tracking-wider">El Gemba (Día a Día y Mentalidad)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {currentPersona.gemba}
              </p>
            </div>

            {/* Puntos de Dolor & Metas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Dolores */}
              <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertCircle size={16} />
                  <h4 className="text-xs font-black uppercase tracking-wider">Puntos de Dolor (Muda)</h4>
                </div>
                <div className="space-y-3">
                  {currentPersona.pains.map((p, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-extrabold text-slate-800 block">⚡ {p.title}</span>
                      <span className="text-slate-500 font-medium leading-normal mt-0.5 block">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metas */}
              <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Target size={16} />
                  <h4 className="text-xs font-black uppercase tracking-wider">Metas y Motivaciones</h4>
                </div>
                <div className="space-y-3">
                  {currentPersona.goals.map((g, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-extrabold text-slate-800 block">🎯 {g.title}</span>
                      <span className="text-slate-500 font-medium leading-normal mt-0.5 block">{g.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Objeciones y Cómo Rebatirlas */}
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-700">
                <BookmarkCheck size={16} className="text-cyan-500" />
                <h4 className="text-xs font-black uppercase tracking-wider">Manejo de Objeciones Comerciales</h4>
              </div>
              <div className="space-y-3">
                {currentPersona.objections.map((o, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="text-xs font-extrabold text-slate-750">
                      💬 <span className="italic">{o.obj}</span>
                    </div>
                    <div className="text-xs font-semibold text-cyan-700 flex items-start gap-1">
                      <ArrowRight size={12} className="shrink-0 mt-0.5" />
                      <p>💡 <span className="font-extrabold">Argumento:</span> {o.reb}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
