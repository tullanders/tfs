import { EntityBase } from './entity-base';
export type BoardEntity = EntityBase & {
    entityType: 'Board'; // Discriminator value

    // Board-specific fields
    boardTypeId: number;
    constitutedDate: Date;
    dissolvedDate?: Date | null;
    effectiveFrom: Date;
    effectiveUntil?: Date | null;
};

export type BoardEntityView = BoardEntity & {
    entityTypeName?: string;
    entityTypeEmoji?: string;
    boardTypeName?: string;
};