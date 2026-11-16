import { PagesContext, CORS_HEADERS } from '../types.ts';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context: PagesContext) {
  const { env } = context;
  try {
    if (!env.PAC_D1) {
      return new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: CORS_HEADERS,
      });
    }
    const { results } = await env.PAC_D1
      .prepare('SELECT * FROM pac_officers ORDER BY order_index ASC')
      .all();
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to query D1 officers' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestPost(context: PagesContext) {
  const { request, env } = context;
  try {
    if (!env.PAC_D1) {
      return new Response(JSON.stringify({ error: 'D1 binding PAC_D1 not configured' }), {
        status: 500,
        headers: CORS_HEADERS,
      });
    }
    const off = (await request.json()) as any;
    if (!off || !off.id || !off.fullName) {
      return new Response(JSON.stringify({ error: 'id and fullName are required' }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
    await env.PAC_D1
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
      .run();

    return new Response(JSON.stringify({ ok: true, id: off.id }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to save officer to D1' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
