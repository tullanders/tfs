import { db } from '@/index';
import { entities, entityTypes } from '@/db/schema';
import { LegalEntityView } from '@/domain/entities/legal.entity';
import { eq } from 'drizzle-orm';
import { EntityRepository } from './entity.repository';
import { EntityTypeRepository } from './entity-type.repository';
import { CountryRepository } from './country.repository';
import { LegalTypeRepository } from './legal-type.repository';
import { LegalSetupRepository } from './legal-setup.repository';

export class LegalRepository {
  async getLegalEntityWithMetadata(id: number): Promise<LegalEntityView | null> {
    const entityRepository = new EntityRepository();
    const entityTypeRepository = new EntityTypeRepository();
    const countryRepository = new CountryRepository();
    const legalTypeRepository = new LegalTypeRepository();
    const legalSetupRepository = new LegalSetupRepository();

    // Hämta base entity
    const baseEntity = await entityRepository.getEntityById(id);
    if (!baseEntity) return null;

    // Parallelt hämta all metadata
    const [entityType, country, legalType, legalSetup] = await Promise.all([
      entityTypeRepository.getEntityTypeById(baseEntity.entityTypeId),
      baseEntity.countryAlpha3Code
        ? countryRepository.getCountryByCode(baseEntity.countryAlpha3Code)
        : Promise.resolve(null),
      baseEntity.legalTypeId
        ? legalTypeRepository.getLegalTypeById(baseEntity.legalTypeId)
        : Promise.resolve(null),
      baseEntity.legalSetupId
        ? legalSetupRepository.getLegalSetupById(baseEntity.legalSetupId)
        : Promise.resolve(null),
    ]);

    // Kombinera till LegalEntityView
    const legalEntityView: LegalEntityView = {
      ...baseEntity,
      entityType: 'Legal',
      entityTypeName: entityType?.name,
      entityTypeEmoji: entityType?.emoji,
      countryName: country?.name,
      countryEmoji: country?.emoji,
      legalTypeName: legalType?.name,
      legalSetupName: legalSetup?.name,
    };

    return legalEntityView;
  }
}