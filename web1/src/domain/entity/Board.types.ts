import { EntityBase } from "./EntityBase";

export interface BoardSpecific {
    //entityType: "BOARD"; // Discriminator
    boardTypeId?: number | null; // FK
    constitutedDate?: Date | null;
    dissolvedDate?: Date | null;    
    effectiveFrom?: Date | null;
    effectiveUntil?: Date | null;
}

export type BoardEntity = EntityBase & BoardSpecific;

export type BoardEntityView = BoardEntity & {
    entityTypeName?: string;
    entityTypeEmoji?: string;
    boardTypeName?: string;
};