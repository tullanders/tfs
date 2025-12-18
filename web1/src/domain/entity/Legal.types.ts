import { EntityBase } from "./EntityBase";

export interface LegalSpecific {
    //entityType: "LEGAL"; // Discriminator

    hasEmployees?: boolean;
    numberOfEmployees?: number | null;

    countryAlpha3Code?: string;  // FK
    legalTypeId?: number | null;   // FK
    legalSetupId?: number | null;  // FK

    originalOfficialName?: string;
    originalOfficialNameValidFrom?: Date | null;
    currentOfficialName?: string;
    currentOfficialNameValidFrom?: Date | null;
    upcomingOfficialName?: string;
    upcomingOfficialNameValidFrom?: Date | null;
    localOfficialRegistrationNumber?: string;
}

// Combined type for Legal Entity, used by repository and services
export type LegalEntity = EntityBase & LegalSpecific;

// View type with optional related names
export type LegalEntityView = LegalEntity & {
    entityTypeName?: string;
    entityTypeEmoji?: string;

    countryName?: string;
    legalTypeName?: string;
    legalSetupName?: string;
};