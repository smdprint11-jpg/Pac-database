import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateUser,
  getAllCollections,
  upsertCollection,
  getAllOfficersFromSql,
  upsertOfficerInSql,
  deleteOfficerFromSql,
} from './src/db/repository.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Authenticated Firebase user profile sync to SQL
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || 'user@pelajarnu.id';
      const name = req.user?.name || req.body?.fullName;
      if (!uid) {
        return res.status(400).json({ error: 'Missing user UID' });
      }
      const dbUser = await getOrCreateUser(uid, email, name);
      res.json({ user: dbUser });
    } catch (error: any) {
      console.error('Failed to sync user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Protected endpoint to save state collections with Firebase Auth
  app.post('/api/protected/state', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { collectionKey, data } = req.body;
      if (!collectionKey || data === undefined) {
        return res.status(400).json({ error: 'collectionKey and data are required' });
      }
      if (req.user?.uid && req.user?.email) {
        await getOrCreateUser(req.user.uid, req.user.email, req.user.name);
      }
      const saved = await upsertCollection(collectionKey, data, req.user?.uid);
      res.json({ ok: true, collectionKey: saved.collectionKey, updatedAt: saved.updatedAt });
    } catch (error: any) {
      console.error('Failed to save protected state:', error);
      res.status(500).json({ error: error.message || 'Failed to save state' });
    }
  });

  // Public/Internal state sync endpoint for real-time database persistence
  app.get('/api/state', async (_req, res) => {
    try {
      const rows = await getAllCollections();
      const sqlOfficers = await getAllOfficersFromSql();
      const collections: Record<string, unknown> = {};
      for (const row of rows) {
        try {
          collections[row.collectionKey] = JSON.parse(row.dataJson);
        } catch {
          // ignore malformed JSON
        }
      }
      res.json({ collections, sqlOfficers });
    } catch (error: any) {
      console.error('Failed to fetch state:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch state' });
    }
  });

  app.post('/api/state', async (req, res) => {
    try {
      const { collectionKey, data } = req.body;
      if (!collectionKey || data === undefined) {
        return res.status(400).json({ error: 'collectionKey and data are required' });
      }
      const saved = await upsertCollection(collectionKey, data);

      // If officers collection is updated, also sync rows into relational pac_officers table
      if (collectionKey === 'officers' && Array.isArray(data)) {
        for (const off of data) {
          if (off && off.id && off.fullName) {
            await upsertOfficerInSql({
              id: String(off.id),
              fullName: String(off.fullName),
              nia: off.nia ? String(off.nia) : undefined,
              position: String(off.position || 'Pengurus'),
              department: off.department ? String(off.department) : undefined,
              organization: String(off.organization || 'IPNU'),
              phone: off.phone ? String(off.phone) : undefined,
              email: off.email ? String(off.email) : undefined,
              photoUrl: off.photoUrl || off.avatar ? String(off.photoUrl || off.avatar) : undefined,
              period: off.period ? String(off.period) : undefined,
              status: off.status ? String(off.status) : 'Aktif',
              unitId: off.unitId ? String(off.unitId) : undefined,
              unitName: off.unitName ? String(off.unitName) : undefined,
              orderIndex: typeof off.orderIndex === 'number' ? off.orderIndex : 1,
              bio: off.bio || off.description ? String(off.bio || off.description) : undefined,
            });
          }
        }
      }

      res.json({ ok: true, collectionKey: saved.collectionKey, updatedAt: saved.updatedAt });
    } catch (error: any) {
      console.error('Failed to persist state:', error);
      res.status(500).json({ error: error.message || 'Failed to persist state' });
    }
  });

  app.delete('/api/officers/:id', async (req, res) => {
    try {
      await deleteOfficerFromSql(req.params.id);
      res.json({ ok: true });
    } catch (error: any) {
      console.error('Failed to delete officer:', error);
      res.status(500).json({ error: error.message || 'Failed to delete officer' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
