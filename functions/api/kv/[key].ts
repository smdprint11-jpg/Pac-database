import { PagesContext, CORS_HEADERS } from '../types.ts';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context: PagesContext<'key'>) {
  const { env, params } = context;
  const key = String(params.key || '');
  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key' }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  try {
    if (env.PAC_KV) {
      const value = await env.PAC_KV.get(`pac_state:${key}`, { type: 'json' });
      if (value !== null && value !== undefined) {
        return new Response(JSON.stringify({ key, value, source: 'KV' }), {
          status: 200,
          headers: CORS_HEADERS,
        });
      }
    }

    if (env.PAC_D1) {
      const row = await env.PAC_D1
        .prepare('SELECT data_json, updated_at FROM app_state_collections WHERE collection_key = ?')
        .bind(key)
        .first<{ data_json: string; updated_at: string }>();

      if (row) {
        return new Response(
          JSON.stringify({
            key,
            value: JSON.parse(row.data_json),
            updatedAt: row.updated_at,
            source: 'D1',
          }),
          { status: 200, headers: CORS_HEADERS }
        );
      }
    }

    return new Response(JSON.stringify({ key, value: null }), {
      status: 404,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to read KV key' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestPut(context: PagesContext<'key'>) {
  const { request, env, params } = context;
  const key = String(params.key || '');
  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key' }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  try {
    const body = (await request.json()) as any;
    const value = body?.value !== undefined ? body.value : body;
    const serialized = JSON.stringify(value);

    if (env.PAC_KV) {
      await env.PAC_KV.put(`pac_state:${key}`, serialized);
    }

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

    return new Response(
      JSON.stringify({ ok: true, key, updatedAt: new Date().toISOString() }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to write KV key' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestDelete(context: PagesContext<'key'>) {
  const { env, params } = context;
  const key = String(params.key || '');
  try {
    if (env.PAC_KV) {
      await env.PAC_KV.delete(`pac_state:${key}`);
    }
    if (env.PAC_D1) {
      await env.PAC_D1
        .prepare('DELETE FROM app_state_collections WHERE collection_key = ?')
        .bind(key)
        .run();
    }
    return new Response(JSON.stringify({ ok: true, key }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete KV key' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
