import { db } from '@/index';
import { boardTypes, entities, entityTypes } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

import type { BoardTypeVO } from '@/domain/value-objects/board-type.vo';
import type { EntityTypeVO } from '@/domain/value-objects/entity-type.vo';
import type { BoardEntity, BoardEntityView } from '@/domain/entity/Board.types';
import { EntityRepository } from './entity.repository';

export class BoardRepository {
    async getBoardWithMetadata(id: number): Promise<BoardEntityView | null> {
        const entityRepository = new EntityRepository();
        
        // Hämta board-entitet
        const board = await entityRepository.getEntityById(id);
        if (!board) return null;

        // Hämta entityType för att få namn och emoji
        const [entityTypeRow] = await db
            .select()
            .from(entityTypes)
            .where(eq(entityTypes.id, board.entityTypeId));
        
        let boardTypeName: any = undefined;
        if (board.boardTypeId !== undefined && board.boardTypeId !== null) {
            boardTypeName = await db
                .select()
                .from(boardTypes)
                .where(eq(boardTypes.id, board.boardTypeId))
                .limit(1);
        }

        // Kombinera till BoardEntityView
        const boardEntityView: BoardEntityView = {
            ...board,
            entityTypeName: entityTypeRow?.name,
            entityTypeEmoji: entityTypeRow?.emoji ?? undefined,
            boardTypeName: undefined, // TODO: hämta board type namn när det finns
        };

        return boardEntityView;
    }
}