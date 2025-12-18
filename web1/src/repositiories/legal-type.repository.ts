import { db } from '@/index';
import { legalTypes } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { LegalTypeVO } from '@/domain/value-objects/legal-type.vo';

export class LegalTypeRepository {
  async getLegalTypes(): Promise<LegalTypeVO[] | null> {
    const result = await db
      .select()
      .from(legalTypes)
      .orderBy(asc(legalTypes.name));

    if (!result[0]) return null;

    return result.map((row) => ({
      id: row.id,
      name: row.name
    }));
  }

  async getLegalTypeById(id: number): Promise<LegalTypeVO | null> {
    const result = await db
      .select()
      .from(legalTypes)
      .where(eq(legalTypes.id, id));

    if (!result[0]) return null;

    const row = result[0];
    return {
      id: row.id,
      name: row.name,
    };
  }

  async createLegalType(legalType: Omit<LegalTypeVO, 'id'>): Promise<LegalTypeVO> {
    const [newLegalType] = await db
      .insert(legalTypes)
      .values({
        name: legalType.name,
      })
      .returning();

    return {
      id: newLegalType.id,
      name: newLegalType.name,
    };
  }

  async updateLegalType(id: number, updates: Partial<Omit<LegalTypeVO, 'id'>>): Promise<LegalTypeVO | null> {
    const [updated] = await db
      .update(legalTypes)
      .set({
        name: updates.name
      })
      .where(eq(legalTypes.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
    };
  }

  async deleteLegalType(id: number): Promise<void> {
    await db
      .delete(legalTypes)
      .where(eq(legalTypes.id, id));
  }
}
