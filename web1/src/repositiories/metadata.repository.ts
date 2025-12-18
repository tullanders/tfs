import { db } from '@/index';
import { CountryRepository} from '@/repositiories/country.repository';
import { LegalSetupRepository} from '@/repositiories/legal-setup.repository';
import { LegalTypeRepository} from '@/repositiories/legal-type.repository';
import { BoardTypeRepository} from '@/repositiories/board-type.repository';
import { EntityTypeRepository} from '@/repositiories/entity-type.repository';
import { countries } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

import type { metadataTypeVO } from '@/domain/value-objects/all.vo';

export class MetadataRepository {
    async getCreateMetadata(): Promise<metadataTypeVO> {
        const countryRepository = new CountryRepository();
        const legalSetupRepository = new LegalSetupRepository();
        const legalTypeRepository = new LegalTypeRepository();
        const entityTypeRepository = new EntityTypeRepository();
        const boardTypeRepository = new BoardTypeRepository();

        const [
          entityTypesRaw,
          legalTypesRaw,
          legalSetupsRaw,
          countriesRaw,
          boardTypesRaw
        ] = await Promise.all([
          entityTypeRepository.getEntityTypes(),
          legalTypeRepository.getLegalTypes(),
          legalSetupRepository.getLegalSetups(),
          countryRepository.getCountries(),
          boardTypeRepository.getBoardTypes(),
        ]);
        return {
          entityTypes: entityTypesRaw ?? [],
          legalTypes: legalTypesRaw ?? [],
          legalSetups: legalSetupsRaw ?? [],
          countries: countriesRaw ?? [],
          boardTypes: boardTypesRaw ?? []
        };
    }

}