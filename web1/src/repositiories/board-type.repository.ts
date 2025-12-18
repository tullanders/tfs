import { db } from '@/index';
import { boardTypes } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { BoardTypeVO } from '@/domain/value-objects/entity-type.vo';

export class BoardTypeRepository {
  async getBoardTypes(): Promise<BoardTypeVO[] | null> {
    const result = await db
      .select()
      .from(boardTypes)
      .orderBy(asc(boardTypes.name));
    if (!result[0]) return null;

    return result.map((row) => ({
      id: row.id,
      name: row.name,
      emoji: row.emoji ?? undefined,
      description: row.description ?? undefined,
    }));
  }

  async createBoardType(boardType: Omit<BoardTypeVO, 'id'>): Promise<BoardTypeVO> {
    const [newBoardType] = await db
      .insert(boardTypes)
      .values({
        name: boardType.name,
      })
      .returning();

    return {
      id: newBoardType.id,
      name: newBoardType.name,
    };
  }

  async updateBoardType(id: number, updates: Partial<Omit<BoardTypeVO, 'id'>>): Promise<BoardTypeVO | null> {
    const [updated] = await db
      .update(boardTypes)
      .set({
        name: updates.name,
      })
      .where(eq(boardTypes.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
    };
  }

  async deleteBoardType(id: number): Promise<void> {
    await db
      .delete(boardTypes)
      .where(eq(boardTypes.id, id));
  }
}
