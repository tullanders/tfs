
import { NextRequest, NextResponse } from 'next/server';
import { EntityTypeVO } from '@/domain/value-objects/entity-type.vo';
import { CountryRepository } from '@/repositiories/country.repository';
import { LegalSetupRepository } from '@/repositiories/legal-setup.repository';
import { LegalTypeRepository } from '@/repositiories/legal-type.repository';
import { EntityTypeRepository } from '@/repositiories/entity-type.repository';



async function getCreateMetadata() {
    const countryRepository = new CountryRepository();
    const legalSetupRepository = new LegalSetupRepository();
    const legalTypeRepository = new LegalTypeRepository();
    const entityTypeRepository = new EntityTypeRepository();

    const [entityTypes, legalTypes, legalSetups, countries] = await Promise.all([
    entityTypeRepository.getEntityTypes(),
    legalTypeRepository.getLegalTypes(),
    legalSetupRepository.getLegalSetups(),
    countryRepository.getCountries(),
    ]);
    return {
    entityTypes,
    legalTypes,
    legalSetups,
    countries,
    };
}
export async function GET() {
    return NextResponse.json(await getCreateMetadata());
}