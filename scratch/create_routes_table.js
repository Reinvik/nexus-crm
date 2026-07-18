import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:BNX6C1301708S@db.qtzpzgwyjptbnipvyjdu.supabase.co:5432/postgres";

const sql = `
-- En el esquema crm
CREATE TABLE IF NOT EXISTS crm.crm_routes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'day' o 'template'
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- En el esquema public
CREATE TABLE IF NOT EXISTS public.crm_routes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'day' o 'template'
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en crm.crm_routes
ALTER TABLE crm.crm_routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir select público crm_routes" ON crm.crm_routes;
CREATE POLICY "Permitir select público crm_routes" ON crm.crm_routes FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir insert público crm_routes" ON crm.crm_routes;
CREATE POLICY "Permitir insert público crm_routes" ON crm.crm_routes FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir update público crm_routes" ON crm.crm_routes;
CREATE POLICY "Permitir update público crm_routes" ON crm.crm_routes FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir delete público crm_routes" ON crm.crm_routes;
CREATE POLICY "Permitir delete público crm_routes" ON crm.crm_routes FOR DELETE TO public USING (true);

-- Habilitar RLS en public.crm_routes
ALTER TABLE public.crm_routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir select público crm_routes" ON public.crm_routes;
CREATE POLICY "Permitir select público crm_routes" ON public.crm_routes FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir insert público crm_routes" ON public.crm_routes;
CREATE POLICY "Permitir insert público crm_routes" ON public.crm_routes FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir update público crm_routes" ON public.crm_routes;
CREATE POLICY "Permitir update público crm_routes" ON public.crm_routes FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir delete público crm_routes" ON public.crm_routes;
CREATE POLICY "Permitir delete público crm_routes" ON public.crm_routes FOR DELETE TO public USING (true);
`;

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🔌 Conectado a la base de datos de producción de Supabase...");
    await client.query(sql);
    console.log("✅ Tablas crm_routes creadas y políticas RLS configuradas con éxito.");
  } catch (err) {
    console.error("❌ Error al ejecutar consultas SQL en la base de datos:", err);
  } finally {
    await client.end();
  }
}

run();
