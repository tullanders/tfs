export type EntityBase = {
  id: number;
  displayName: string;
  entityTypeId: number;
  version: number;
  status: number;
  validFrom: string;
  validTo?: string;
  createdDateTime: string;
  createdBy: string;
  modifiedDateTime: string;
  modifiedBy: string;
};