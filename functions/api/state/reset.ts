import { PagesContext, STATE_KEYS, CORS_HEADERS } from '../types.ts';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context: PagesContext) {
  const { env } = context;
  try {
    if (env.PAC_KV) {
      for (const key of STATE_KEYS) {
        await env.PAC_KV.delete(`pac_state:${key}`);
      }
    }

    if (env.PAC_D1) {
      await env.PAC_D1.prepare('DELETE FROM app_state_collections').run();
      await env.PAC_D1.prepare('DELETE FROM pac_officers').run();
    }

    return new Response(
      JSON.stringify({ ok: true, resetAt: new Date().toISOString() }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to reset KV/D1 state' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
