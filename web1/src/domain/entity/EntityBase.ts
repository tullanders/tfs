import {EntityType} from "./EntityType";
export type EntityStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';
export interface EntityBase {
    id: number;
    displayName: string;
    entityTypeId: number;
    entityType: string;
    version: number;
    status: EntityStatus;
    createdDateTime: string;
    createdBy: string;
    modifiedDateTime: string;
    modifiedBy: string;
    localId?: string | null; // local id from e.g. HFM, LEMI...
    localIdSource?: string | null;  // local id source: HFM, LEMI...
}    