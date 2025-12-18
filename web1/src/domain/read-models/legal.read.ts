import { LegalTypeVO } from '../value-objects/legal-type.vo';
import { LegalSetupVO } from '../value-objects/legal-setup.vo';
import { EntityReadBase } from './entity.read-base';
import { CountryVO } from '../value-objects/country.vo';

export type LegalReadModel = EntityReadBase & {
  // Legal specific fields
  localId?: string | null;
  localIdSource?: string | null;
  hasEmployees?: boolean;
  numberOfEmployees?: number | null;

  // VOs for related entities
  country: CountryVO;
  legalType: LegalTypeVO;
  legalSetup: LegalSetupVO;
};