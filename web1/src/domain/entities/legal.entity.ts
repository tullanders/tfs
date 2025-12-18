import { EntityBase } from './entity-base';
export type LegalEntity = EntityBase & {
  entityType: 'Legal'; // Discriminator value

  // Legal-specific fields
  localId?: string | null;
  localIdSource?: string | null;
  hasEmployees?: boolean;
  numberOfEmployees?: number | null;

  countryAlpha3Code?: string;  // FK
  legalTypeId?: number | null;   // FK
  legalSetupId?: number | null;  // FK
};

export type LegalEntityView = LegalEntity & {
  entityTypeName?: string;
  entityTypeEmoji?: string;
  countryName?: string;
  countryEmoji?: string;
  legalTypeName?: string;
  legalSetupName?: string;
};