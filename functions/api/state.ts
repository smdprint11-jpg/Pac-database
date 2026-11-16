import { PagesContext, STATE_KEYS, CORS_HEADERS } from './types.ts';

async function ensureD1Tables(env: PagesContext['env']) {
  if (!env.PAC_D1) return;
  await env.PAC_D1
    .prepare(
      `CREATE TABLE IF NOT EXISTS app_state_collections (
        collection_key TEXT PRIMARY KEY,
        data_json TEXT NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
      )`
    )
    .run();

  await env.PAC_D1
    .prepare(
      `CREATE TABLE IF NOT EXISTS pac_officers (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        nia TEXT,
        position TEXT NOT NULL,
        department TEXT,
        organization TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        photo_url TEXT,
        period TEXT,
        status TEXT DEFAULT 'Aktif',
        unit_id TEXT,
        unit_name TEXT,
        order_index INTEGER DEFAULT 1,
        bio TEXT,
        updated_at TEXT DEFAULT (datetime('now'))
      )`
    )
    .run();
}

async function syncOfficersToD1(env: PagesContext['env'], officersData: unknown) {
  if (!env.PAC_D1 || !Array.isArray(officersData)) return;
  const statements = [];
  for (const off of officersData) {
    if (off && off.id && off.fullName) {
      statements.push(
        env.PAC_D1
          .prepare(
            `INSERT INTO pac_officers (
              id, full_name, nia, position, department, organization,
              phone, email, photo_url, period, status, unit_id, unit_name,
              order_index, bio, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(id) DO UPDATE SET
              full_name = excluded.full_name,
              nia = excluded.nia,
              position = excluded.position,
              department = excluded.department,
              organization = excluded.organization,
              phone = excluded.phone,
              email = excluded.email,
              photo_url = excluded.photo_url,
              period = excluded.period,
              status = excluded.status,
              unit_id = excluded.unit_id,
              unit_name = excluded.unit_name,
              order_index = excluded.order_index,
              bio = excluded.bio,
              updated_at = datetime('now')`
          )
          .bind(
            String(off.id),
            String(off.fullName),
            off.nia ? String(off.nia) : null,
            String(off.position || 'Pengurus'),
            off.department ? String(off.department) : null,
            String(off.organization || 'IPNU'),
            off.phone ? String(off.phone) : null,
            off.email ? String(off.email) : null,
            off.photoUrl || off.avatar ? String(off.photoUrl || off.avatar) : null,
            off.period ? String(off.period) : null,
            off.status ? String(off.status) : 'Aktif',
            off.unitId ? String(off.unitId) : null,
            off.unitName ? String(off.unitName) : null,
            typeof off.orderIndex === 'number' ? off.orderIndex : 1,
            off.bio || off.description ? String(off.bio || off.description) : null
          )
      );
    }
  }
  if (statements.length > 0) {
    await env.PAC_D1.batch(statements);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context: PagesContext) {
  const { env } = context;
  const collections: Record<string, unknown> = {};
  let sqlOfficers: unknown[] = [];

  try {
    await ensureD1Tables(env);

    // 1. Read from Cloudflare D1 if bound
    if (env.PAC_D1) {
      const { results } = await env.PAC_D1
        .prepare('SELECT collection_key, data_json FROM app_state_collections')
        .all<{ collection_key: string; data_json: string }>();

      for (const row of results || []) {
        try {
          collections[row.collection_key] = JSON.parse(row.data_json);
        } catch {
          // ignore malformed JSON
        }
      }

      const offRes = await env.PAC_D1
        .prepare('SELECT * FROM pac_officers ORDER BY order_index ASC')
        .all();
      sqlOfficers = offRes.results || [];
    }

    // 2. Read/merge from Cloudflare KV if bound
    if (env.PAC_KV) {
      for (const key of STATE_KEYS) {
        if (collections[key] === undefined) {
          const kvVal = await env.PAC_KV.get(`pac_state:${key}`, { type: 'json' });
          if (kvVal !== null && kvVal !== undefined) {
            collections[key] = kvVal;
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        collections,
        sqlOfficers,
        engine: 'cloudflare-pages-kv-d1',
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to load state from KV/D1' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestPost(context: PagesContext) {
  const { request, env } = context;
  try {
    await ensureD1Tables(env);
    const body = (await request.json()) as {
      collectionKey?: string;
      data?: unknown;
      collections?: Record<string, unknown>;
    };

    const savePair = async (key: string, val: unknown) => {
      const serialized = JSON.stringify(val);

      // Write to Cloudflare KV
      if (env.PAC_KV) {
        await env.PAC_KV.put(`pac_state:${key}`, serialized);
      }

      // Write to Cloudflare D1
      if (env.PAC_D1) {
        await env.PAC_D1
          .prepare(
            `INSERT INTO app_state_collections (collection_key, data_json, updated_at)
             VALUES (?, ?, datetime('now'))
             ON CONFLICT(collection_key) DO UPDATE SET
               data_json = excluded.data_json,
               updated_at = datetime('now')`
          )
          .bind(key, serialized)
          .run();
      }

      if (key === 'officers') {
        await syncOfficersToD1(env, val);
      }
    };

    if (body.collections && typeof body.collections === 'object') {
      for (const [k, v] of Object.entries(body.collections)) {
        await savePair(k, v);
      }
      return new Response(
        JSON.stringify({ ok: true, updatedAt: new Date().toISOString() }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    if (!body.collectionKey || body.data === undefined) {
      return new Response(
        JSON.stringify({ error: 'collectionKey and data are required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    await savePair(body.collectionKey, body.data);

    return new Response(
      JSON.stringify({
        ok: true,
        collectionKey: body.collectionKey,
        updatedAt: new Date().toISOString(),
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to save state to KV/D1' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
