export type EntityDb = {
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
  parentId?: number | null;
  entityType: 'Legal'; // Discriminator value

  // Legal-specific fields
  localId?: string | null;
  localIdSource?: string | null;
  
  originalOfficialName: string | null;,
  originalOfficialNameValidFrom: string | null;
  currentOfficialName: string | null;
  currentOfficialNameValidFrom: string | null;
  upcomingOfficialName: string | null;
  upcomingOfficialNameValidFrom: string | null;
  localOfficialRegistrationNumber: string | null;
  
  hasEmployees?: boolean;
  numberOfEmployees?: number | null;

  countryAlpha3Code?: string;  // FK
  legalTypeId?: number | null;   // FK
  legalSetupId?: number | null;  // FK  
};