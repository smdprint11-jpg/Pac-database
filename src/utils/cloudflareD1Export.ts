import {
  WebsiteSettings,
  Officer,
  UnitOrganization,
  Member,
  SpDocument,
  Activity,
  Supervisor,
  Alumni,
} from '../types';

function escapeSql(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  return "'" + String(val).replace(/'/g, "''") + "'";
}

export function generateCloudflareD1Sql(params: {
  settings: WebsiteSettings;
  officers: Officer[];
  units: UnitOrganization[];
  members: Member[];
  spDocuments: SpDocument[];
  activities: Activity[];
  supervisors: Supervisor[];
  alumni: Alumni[];
}): string {
  const { settings, officers, units, members, spDocuments, activities, supervisors, alumni } = params;
  const now = new Date().toISOString();

  const lines: string[] = [
    `-- ============================================================================`,
    `-- CLOUDFLARE D1 (SQLite Serverless) & KV MIGRATION DUMP - PELAJAR NU DUKUN`,
    `-- Generated at: ${now}`,
    `-- Usage: npx wrangler d1 execute db_pelajar_nu_dukun --file=./schema.d1.sql`,
    `-- ============================================================================`,
    ``,
    `CREATE TABLE IF NOT EXISTS app_state_collections (`,
    `  collection_key TEXT PRIMARY KEY,`,
    `  data_json TEXT NOT NULL,`,
    `  updated_at TEXT DEFAULT (datetime('now'))`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS pac_officers (`,
    `  id TEXT PRIMARY KEY,`,
    `  full_name TEXT NOT NULL,`,
    `  nia TEXT,`,
    `  position TEXT NOT NULL,`,
    `  department TEXT,`,
    `  organization TEXT NOT NULL,`,
    `  phone TEXT,`,
    `  email TEXT,`,
    `  photo_url TEXT,`,
    `  period TEXT,`,
    `  status TEXT DEFAULT 'Aktif',`,
    `  unit_id TEXT,`,
    `  unit_name TEXT,`,
    `  order_index INTEGER DEFAULT 1,`,
    `  bio TEXT,`,
    `  updated_at TEXT DEFAULT (datetime('now'))`,
    `);`,
    ``,
  ];

  // Insert Officers into D1 pac_officers table
  for (const o of officers) {
    lines.push(
      `INSERT OR REPLACE INTO pac_officers (id, full_name, nia, position, department, organization, phone, email, photo_url, period, status, unit_id, unit_name, order_index, bio) VALUES (${escapeSql(
        o.id
      )}, ${escapeSql(o.fullName)}, ${escapeSql(o.nia || '')}, ${escapeSql(
        o.position
      )}, ${escapeSql(o.department || '')}, ${escapeSql(o.organization)}, ${escapeSql(
        o.phone || ''
      )}, ${escapeSql(o.email || '')}, ${escapeSql(
        o.photoUrl || o.avatar || ''
      )}, ${escapeSql(o.period || '')}, ${escapeSql(o.status || 'Aktif')}, ${escapeSql(
        o.unitId || null
      )}, ${escapeSql(o.unitName || null)}, ${escapeSql(
        o.orderIndex ?? o.displayOrder ?? 1
      )}, ${escapeSql(o.bio || o.description || '')});`
    );
  }

  lines.push(``);

  // Insert Collections into D1 app_state_collections table
  const collectionsMap: Record<string, unknown> = {
    settings,
    officers,
    units,
    members,
    spDocs: spDocuments,
    activities,
    supervisors,
    alumni,
  };

  for (const [key, data] of Object.entries(collectionsMap)) {
    lines.push(
      `INSERT OR REPLACE INTO app_state_collections (collection_key, data_json) VALUES (${escapeSql(
        key
      )}, ${escapeSql(JSON.stringify(data))});`
    );
  }

  return lines.join('\n');
}
