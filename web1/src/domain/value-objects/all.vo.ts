import type { EntityTypeVO } from './entity-type.vo';
import type { CountryVO } from './country.vo';
import type { LegalSetupVO } from './legal-setup.vo';
import type { LegalTypeVO } from './legal-type.vo';
import type { BoardTypeVO } from './board-type.vo';

export type {
    EntityTypeVO,
    CountryVO,
    LegalSetupVO,
    LegalTypeVO,
    BoardTypeVO
}
export type metadataTypeVO = {
    entityTypes: EntityTypeVO[];
    countries: CountryVO[];
    legalSetups: LegalSetupVO[];
    legalTypes: LegalTypeVO[];
    boardTypes: BoardTypeVO[];
}