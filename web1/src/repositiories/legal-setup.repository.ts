import { db } from '@/index';
import { legalSetups } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { LegalSetupVO } from '@/domain/value-objects/legal-setup.vo';

export class LegalSetupRepository {
  async getLegalSetups(): Promise<LegalSetupVO[] | null> {
    const result = await db
      .select()
      .from(legalSetups)
      .orderBy(asc(legalSetups.name));

    if (!result[0]) return null;

    return result.map((row) => ({
      id: row.id,
      name: row.name,
      emoji: row.emoji ?? undefined,
      description: row.description ?? undefined,
    }));
  }

 

  async createLegalSetup(legalSetup: Omit<LegalSetupVO, 'id'>): Promise<LegalSetupVO> {
    const [newLegalSetup] = await db
      .insert(legalSetups)
      .values({
        name: legalSetup.name,
      })
      .returning();

    return {
      id: newLegalSetup.id,
      name: newLegalSetup.name,
    };
  }

  async updateLegalSetup(id: number, updates: Partial<Omit<LegalSetupVO, 'id'>>): Promise<LegalSetupVO | null> {
    const [updated] = await db
      .update(legalSetups)
      .set({
        name: updates.name,
      })
      .where(eq(legalSetups.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
    };
  }

  async deleteLegalSetup(id: number): Promise<void> {
    await db
      .delete(legalSetups)
      .where(eq(legalSetups.id, id));
  }
}
