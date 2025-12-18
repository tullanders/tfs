import { LegalEntity, LegalSpecific } from "./Legal.types";
import { BusinessEntity, BusinessSpecific } from "./Business.types";
import { BoardEntity, BoardSpecific } from "./Board.types";
import { ReportingUnitEntity, ReportingUnitSpecific } from "./ReportingUnit.types";

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

export type Entity = EntityBase & 
  (LegalSpecific & BusinessSpecific & BoardSpecific & ReportingUnitSpecific);

export type {
  LegalEntity,
  BusinessEntity,
  BoardEntity,
  ReportingUnitEntity
};

export type EntityView = Entity & {
    entityTypeName?: string;
    entityTypeEmoji?: string;

    // LegalEntity specific
    countryName?: string;
    countryEmoji?: string;
    legalTypeName?: string;
    legalSetupName?: string;

    // BoardEntity specific
    boardTypeName?: string;
};