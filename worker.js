export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Endpoint Pengaturan Logo & Header (Cloudflare KV)
    if (url.pathname === "/api/settings") {
      if (request.method === "GET") {
        const data = await env.SETTINGS_KV.get("site_config");
        return new Response(
          data || JSON.stringify({ logoUrl: "", headerTitle: "Judul Default" }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      if (request.method === "POST") {
        try {
          const body = await request.json();
          await env.SETTINGS_KV.put("site_config", JSON.stringify(body));
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }

    // 2. Endpoint Database Utama (Cloudflare D1)
    if (url.pathname === "/api/data") {
      if (request.method === "GET") {
        try {
          const { results } = await env.DB.prepare(
            "SELECT * FROM members ORDER BY id DESC"
          ).all();
          return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      if (request.method === "POST") {
        try {
          const body = await request.json();
          await env.DB.prepare(
            "INSERT INTO members (nama, nomor_anggota, jabatan) VALUES (?, ?, ?)"
          )
            .bind(body.nama || "", body.nomor_anggota || "", body.jabatan || "")
            .run();
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }

    // 3. Layani file tampilan website (HTML/JS/CSS) untuk semua rute lainnya
    return env.ASSETS.fetch(request);
  }
};
