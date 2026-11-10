import { db } from './index.ts';
import { users, appStateCollections, pacOfficers } from './schema.ts';
import { eq, asc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, fullName?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        fullName: fullName || email.split('@')[0],
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          fullName: fullName || email.split('@')[0],
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Failed to synchronize user profile.', { cause: error });
  }
}

export async function getAllCollections() {
  try {
    return await db.select().from(appStateCollections);
  } catch (error) {
    console.error('Database query failed in getAllCollections:', error);
    throw new Error('Failed to load application state from database.', { cause: error });
  }
}

export async function upsertCollection(collectionKey: string, data: unknown, updatedByUid?: string) {
  try {
    const dataJson = JSON.stringify(data);
    const result = await db
      .insert(appStateCollections)
      .values({
        collectionKey,
        dataJson,
        updatedByUid: updatedByUid || null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: appStateCollections.collectionKey,
        set: {
          dataJson,
          updatedByUid: updatedByUid || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error(`Database query failed in upsertCollection (${collectionKey}):`, error);
    throw new Error('Failed to persist collection data.', { cause: error });
  }
}

export async function getAllOfficersFromSql() {
  try {
    return await db.select().from(pacOfficers).orderBy(asc(pacOfficers.orderIndex));
  } catch (error) {
    console.error('Database query failed in getAllOfficersFromSql:', error);
    throw new Error('Failed to fetch officers from SQL database.', { cause: error });
  }
}

export async function upsertOfficerInSql(officer: {
  id: string;
  fullName: string;
  nia?: string;
  position: string;
  department?: string;
  organization: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  period?: string;
  status?: string;
  unitId?: string;
  unitName?: string;
  orderIndex?: number;
  bio?: string;
}) {
  try {
    const result = await db
      .insert(pacOfficers)
      .values({
        id: officer.id,
        fullName: officer.fullName,
        nia: officer.nia || null,
        position: officer.position,
        department: officer.department || null,
        organization: officer.organization,
        phone: officer.phone || null,
        email: officer.email || null,
        photoUrl: officer.photoUrl || null,
        period: officer.period || null,
        status: officer.status || 'Aktif',
        unitId: officer.unitId || null,
        unitName: officer.unitName || null,
        orderIndex: officer.orderIndex ?? 1,
        bio: officer.bio || null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: pacOfficers.id,
        set: {
          fullName: officer.fullName,
          nia: officer.nia || null,
          position: officer.position,
          department: officer.department || null,
          organization: officer.organization,
          phone: officer.phone || null,
          email: officer.email || null,
          photoUrl: officer.photoUrl || null,
          period: officer.period || null,
          status: officer.status || 'Aktif',
          unitId: officer.unitId || null,
          unitName: officer.unitName || null,
          orderIndex: officer.orderIndex ?? 1,
          bio: officer.bio || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in upsertOfficerInSql:', error);
    throw new Error('Failed to save officer to SQL database.', { cause: error });
  }
}

export async function deleteOfficerFromSql(id: string) {
  try {
    await db.delete(pacOfficers).where(eq(pacOfficers.id, id));
  } catch (error) {
    console.error('Database query failed in deleteOfficerFromSql:', error);
    throw new Error('Failed to delete officer from SQL database.', { cause: error });
  }
}
