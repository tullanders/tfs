import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { 
  entities, 
  structure, 
  entityTypes, 
  boardTypes, 
  legalSetups, 
  legalTypes, 
  countries 
} from "@/db/schema/entities";

export const getEntityViewById = (entityId: number) => {
  return db
    .select({
      // Entity fields
      id: entities.id,
      displayName: entities.displayName,
      entityType: entities.entityType,
      version: entities.version,
      status: entities.status,
      createdDateTime: entities.createdDateTime,
      createdBy: entities.createdBy,
      modifiedDateTime: entities.modifiedDateTime,
      modifiedBy: entities.modifiedBy,
      localId: entities.localId,
      localIdSource: entities.localIdSource,
      
      // Legal entity fields
      hasEmployees: entities.hasEmployees,
      numberOfEmployees: entities.numberOfEmployees,
      countryAlpha3Code: entities.countryAlpha3Code,
      legalTypeId: entities.legalTypeId,
      legalSetupId: entities.legalSetupId,
      originalOfficialName: entities.originalOfficialName,
      originalOfficialNameValidFrom: entities.originalOfficialNameValidFrom,
      currentOfficialName: entities.currentOfficialName,
      currentOfficialNameValidFrom: entities.currentOfficialNameValidFrom,
      upcomingOfficialName: entities.upcomingOfficialName,
      upcomingOfficialNameValidFrom: entities.upcomingOfficialNameValidFrom,
      localOfficialRegistrationNumber: entities.localOfficialRegistrationNumber,
      
      // Board entity fields
      boardTypeId: entities.boardTypeId,
      constitutedDate: entities.constitutedDate,
      dissolvedDate: entities.dissolvedDate,
      effectiveFrom: entities.effectiveFrom,
      effectiveUntil: entities.effectiveUntil,
      
      // Joined fields - names from related tables
      boardTypeName: boardTypes.name,
      entityTypeName: entityTypes.name,
      entityTypeEmoji: entityTypes.emoji,
      legalSetupName: legalSetups.name,
      legalTypeName: legalTypes.name,
      countryName: countries.name,
      countryEmoji: countries.emoji,
    })
    .from(entities)
    .leftJoin(boardTypes, eq(entities.boardTypeId, boardTypes.id))
    .leftJoin(entityTypes, sql`${entities.entityType}::text = ${entityTypes.id}`)
    .leftJoin(legalSetups, eq(entities.legalSetupId, legalSetups.id))
    .leftJoin(legalTypes, eq(entities.legalTypeId, legalTypes.id))
    .leftJoin(countries, eq(entities.countryAlpha3Code, countries.alpha3Code))
    .where(eq(entities.id, entityId))
    .limit(1);
};