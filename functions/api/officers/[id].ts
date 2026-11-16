import { PagesContext, CORS_HEADERS } from '../types.ts';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestDelete(context: PagesContext<'id'>) {
  const { env, params } = context;
  const id = String(params.id || '');
  try {
    if (env.PAC_D1 && id) {
      await env.PAC_D1.prepare('DELETE FROM pac_officers WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete officer from D1' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
