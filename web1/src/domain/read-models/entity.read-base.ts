import { EntityStatusVO } from '../value-objects/entity-status.vo';
import { EntityTypeVO } from '../value-objects/entity-type.vo';
export type EntityReadBase = {
  id: number;
  displayName: string;
  status: EntityStatusVO;
  entityType: EntityTypeVO;
  version: number;
  validFrom: string;
  validTo?: string;
  createdDateTime: string;
  createdBy: string;
  modifiedDateTime: string;
  modifiedBy: string;
};