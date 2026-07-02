import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:BNX6C1301708S@db.qtzpzgwyjptbnipvyjdu.supabase.co:5432/postgres";

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🔌 Conectado a Postgres Supabase.");
    
    const res = await client.query(`
      SELECT commune, COUNT(*) 
      FROM crm_leads 
      WHERE commune LIKE '%,%' 
      GROUP BY commune 
      ORDER BY COUNT(*) DESC 
      LIMIT 30;
    `);
    console.log("Comunas con comas encontradas en la BD:");
    console.log(res.rows);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.end();
  }
}

run();
