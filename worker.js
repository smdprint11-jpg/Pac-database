export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Endpoint Sinkronisasi Login Google OAuth
    if (url.pathname === "/api/auth/sync" && request.method === "POST") {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Endpoint Utama State Aplikasi (GET & POST untuk /api/state dan /api/protected/state)
    if (url.pathname === "/api/state" || url.pathname === "/api/protected/state") {
      // AMBIL SEMUA DATA SAAT HALAMAN DIMUAT (GET)
      if (request.method === "GET") {
        try {
          const list = await env.SETTINGS_KV.list({ prefix: "col:" });
          const collections = {};

          for (const keyObj of list.keys) {
            const colName = keyObj.name.replace("col:", "");
            const val = await env.SETTINGS_KV.get(keyObj.name);
            if (val) {
              collections[colName] = JSON.parse(val);
            }
          }

          return new Response(JSON.stringify({ collections }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // SIMPAN PERUBAHAN LOGO, HEADER, ATAU DATABASE ANGGOTA (POST)
      if (request.method === "POST") {
        try {
          const body = await request.json();

          // Kasus A: Inisialisasi awal seluruh collections sekaligus
          if (body.collections && typeof body.collections === "object") {
            for (const [colKey, colData] of Object.entries(body.collections)) {
              await env.SETTINGS_KV.put(`col:${colKey}`, JSON.stringify(colData));
            }
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          // Kasus B: Update per koleksi (misal: collectionKey = "settings", "members", "units", dll.)
          if (body.collectionKey && body.data !== undefined) {
            await env.SETTINGS_KV.put(
              `col:${body.collectionKey}`,
              JSON.stringify(body.data)
            );

            // Cadangkan juga ke D1 jika tabel records tersedia
            if (env.DB) {
              try {
                await env.DB.prepare(
                  "INSERT OR REPLACE INTO records (id, payload) VALUES (?, ?)"
                )
                  .bind(body.collectionKey, JSON.stringify(body.data))
                  .run();
              } catch {
                // Abaikan jika tabel records belum dibuat, KV sudah tersimpan aman
              }
            }

            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Format payload tidak sesuai" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }

    // 3. Layani file frontend (HTML/JS/CSS) untuk semua rute lainnya
    return env.ASSETS.fetch(request);
  },
};
