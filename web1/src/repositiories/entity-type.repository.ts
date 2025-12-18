import { db } from '@/index';
import { entityTypes } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { EntityTypeVO } from '@/domain/value-objects/entity-type.vo';

export class EntityTypeRepository {
  async getEntityTypes(): Promise<EntityTypeVO[] | null> {
    const result = await db
      .select()
      .from(entityTypes)
      .orderBy(asc(entityTypes.name));

    if (!result[0]) return null;

    return result.map((row) => ({
      id: row.id,
      name: row.name,
      emoji: row.emoji ?? undefined,
      description: row.description ?? undefined,
    }));
  }

  async getEntityTypeById(id: number): Promise<EntityTypeVO | null> {
    const result = await db
      .select()
      .from(entityTypes)
      .where(eq(entityTypes.id, id));

    if (!result[0]) return null;

    const row = result[0];
    return {
      id: row.id,
      name: row.name,
      emoji: row.emoji ?? undefined,
      description: row.description ?? undefined,
    };
  }

  async createEntityType(entityType: Omit<EntityTypeVO, 'id'>): Promise<EntityTypeVO> {
    const [newEntityType] = await db
      .insert(entityTypes)
      .values({
        name: entityType.name,
        emoji: entityType.emoji ?? null,
        description: entityType.description ?? null,
      })
      .returning();

    return {
      id: newEntityType.id,
      name: newEntityType.name,
      emoji: newEntityType.emoji ?? undefined,
      description: newEntityType.description ?? undefined,
    };
  }

  async updateEntityType(id: number, updates: Partial<Omit<EntityTypeVO, 'id'>>): Promise<EntityTypeVO | null> {
    const [updated] = await db
      .update(entityTypes)
      .set({
        name: updates.name,
        emoji: updates.emoji ?? null,
        description: updates.description ?? null,
      })
      .where(eq(entityTypes.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
      emoji: updated.emoji ?? undefined
    };
  }

  async deleteEntityType(id: number): Promise<void> {
    await db
      .delete(entityTypes)
      .where(eq(entityTypes.id, id));
  }
}
