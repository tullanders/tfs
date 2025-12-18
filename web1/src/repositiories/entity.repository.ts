import { db } from '@/index';
import { Entity, EntityView} from '@/domain/entity/Entity';
import { entities, entityTypes, countries, legalSetups, legalTypes, boardTypes, entityTypeEnum } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export class EntityRepository {
    async getEntityById(id: number): Promise<Entity | null> {
        const result = await db
            .select()
            .from(entities)
            .where(eq(entities.id, id));

        if (!result[0]) return null;

        const row = result[0];

        return {
            id: row.id,
            displayName: row.displayName,
            entityTypeId: row.entityTypeId,
            entityType: row.entityType,
            version: row.version,
            status: row.status as Entity['status'],
            createdDateTime: row.createdDateTime.toISOString(),
            createdBy: row.createdBy,
            modifiedDateTime: row.modifiedDateTime.toISOString(),
            modifiedBy: row.modifiedBy,
            
            localId: row.localId || null,
            localIdSource: row.localIdSource || null,
            //hasEmployees: row.hasEmployees || undefined,
            numberOfEmployees: row.numberOfEmployees || null,
            countryAlpha3Code: row.countryAlpha3Code || undefined,
            legalTypeId: row.legalTypeId || null,
            legalSetupId: row.legalSetupId || null,
        } as Entity;
    }

    async createEntity(entity: Partial<Entity>): Promise<Entity> {
        const [newEntity] = await db
            .insert(entities)
            .values({
                displayName: entity.displayName!,
                entityTypeId: entity.entityTypeId!,
                entityType: entity.entityType as keyof typeof entityTypeEnum,
                status: entity.status || 'ACTIVE',
                createdBy: entity.createdBy!,
                modifiedBy: entity.modifiedBy!,
                createdDateTime: entity.createdDateTime ? new Date(entity.createdDateTime) : new Date(),
                modifiedDateTime: entity.modifiedDateTime ? new Date(entity.modifiedDateTime) : new Date(),
                localId: entity.localId || null,
                localIdSource: entity.localIdSource || null,

                // LegalEntity specific fields
                hasEmployees: (entity as any).hasEmployees || null,
                numberOfEmployees: entity.numberOfEmployees || null,
                countryAlpha3Code: entity.countryAlpha3Code || null,
                legalTypeId: entity.legalTypeId || null,
                legalSetupId:  entity.legalSetupId || null,
                originalOfficialName: entity.originalOfficialName || null,
                originalOfficialNameValidFrom: entity.originalOfficialNameValidFrom ? new Date(entity.originalOfficialNameValidFrom) : null,
                currentOfficialName: entity.currentOfficialName || null,
                currentOfficialNameValidFrom: entity.currentOfficialNameValidFrom ? new Date(entity.currentOfficialNameValidFrom) : null,
                upcomingOfficialName: entity.upcomingOfficialName || null,
                upcomingOfficialNameValidFrom: entity.upcomingOfficialNameValidFrom ? new Date(entity.upcomingOfficialNameValidFrom) : null,
                localOfficialRegistrationNumber: entity.localOfficialRegistrationNumber || null,

                // BoardEntity specific fields to be added later
                boardTypeId: entity.boardTypeId || null,
                constitutedDate: entity.constitutedDate ? new Date(entity.constitutedDate) : null,
                dissolvedDate: entity.dissolvedDate ? new Date(entity.dissolvedDate) : null,
                effectiveFrom: entity.effectiveFrom ? new Date(entity.effectiveFrom) : null,
                effectiveUntil: entity.effectiveUntil ? new Date(entity.effectiveUntil) : null,


            })
            .returning();

        return {
            id: newEntity.id,
            displayName: newEntity.displayName,
            entityTypeId: newEntity.entityTypeId,
            entityType: newEntity.entityType,
            version: newEntity.version,
            status: newEntity.status as Entity['status'],
            createdDateTime: newEntity.createdDateTime.toISOString(),
            createdBy: newEntity.createdBy,
            modifiedDateTime: newEntity.modifiedDateTime.toISOString(),
            modifiedBy: newEntity.modifiedBy,
            
            // LegalEntity specific fields
            localId: newEntity.localId || null,
            localIdSource: newEntity.localIdSource || null,
            hasEmployees: newEntity.hasEmployees || undefined,
            numberOfEmployees: newEntity.numberOfEmployees || null,
            countryAlpha3Code: newEntity.countryAlpha3Code || undefined,
            legalTypeId: newEntity.legalTypeId || null,
            legalSetupId: newEntity.legalSetupId || null,

            // BoardEntity specific fields to be added later
            boardTypeId: newEntity.boardTypeId || null,
            constitutedDate: newEntity.constitutedDate ? new Date(newEntity.constitutedDate) : null,
            dissolvedDate: newEntity.dissolvedDate ? new Date(newEntity.dissolvedDate) : null,
            effectiveFrom: newEntity.effectiveFrom ? new Date(newEntity.effectiveFrom) : null,
            effectiveUntil: newEntity.effectiveUntil ? new Date(newEntity.effectiveUntil) : null,
        } as Entity;
    }

    async updateEntity(id: number, updates: Partial<Entity>): Promise<Entity | null> {
        const [updated] = await db
            .update(entities)
            .set({
                // Base Entity fields
                displayName: updates.displayName,
                entityTypeId: updates.entityTypeId,
                entityType: updates.entityType,
                status: updates.status,
                modifiedBy: updates.modifiedBy!,
                modifiedDateTime: new Date(),

                // LegalEntity specific fields
                localId: updates.localId || null,
                localIdSource: updates.localIdSource || null,
                hasEmployees: (updates as any).hasEmployees || null,
                numberOfEmployees: updates.numberOfEmployees || null,
                countryAlpha3Code: updates.countryAlpha3Code || null,
                legalTypeId: updates.legalTypeId || null,
                legalSetupId:  updates.legalSetupId || null,
                originalOfficialName: updates.originalOfficialName || null,
                originalOfficialNameValidFrom: updates.originalOfficialNameValidFrom ? new Date(updates.originalOfficialNameValidFrom) : null,
                currentOfficialName: updates.currentOfficialName || null,
                currentOfficialNameValidFrom: updates.currentOfficialNameValidFrom ? new Date(updates.currentOfficialNameValidFrom) : null,
                upcomingOfficialName: updates.upcomingOfficialName || null,
                upcomingOfficialNameValidFrom: updates.upcomingOfficialNameValidFrom ? new Date(updates.upcomingOfficialNameValidFrom) : null,
                localOfficialRegistrationNumber: updates.localOfficialRegistrationNumber || null,

                // BoardEntity specific fields to be added later
                boardTypeId: updates.boardTypeId || null,
                constitutedDate: updates.constitutedDate ? new Date(updates.constitutedDate) : null,
                dissolvedDate: updates.dissolvedDate ? new Date(updates.dissolvedDate) : null,
                effectiveFrom: updates.effectiveFrom ? new Date(updates.effectiveFrom) : null,
                effectiveUntil: updates.effectiveUntil ? new Date(updates.effectiveUntil) : null,

            })
            .where(eq(entities.id, id))
            .returning();

        if (!updated) return null;

        return {
            id: updated.id,
            displayName: updated.displayName,
            entityTypeId: updated.entityTypeId,
            entityType: updated.entityType,
            version: updated.version,
            status: updated.status as Entity['status'],
            createdDateTime: updated.createdDateTime.toISOString(),
            createdBy: updated.createdBy,
            modifiedDateTime: updated.modifiedDateTime.toISOString(),
            modifiedBy: updated.modifiedBy,
            
            localId: updated.localId || null,
            localIdSource: updated.localIdSource || null,
            //hasEmployees: updated.hasEmployees || undefined,
            numberOfEmployees: updated.numberOfEmployees || null,
            countryAlpha3Code: updated.countryAlpha3Code || undefined,
            legalTypeId: updated.legalTypeId || null,
            legalSetupId: updated.legalSetupId || null,
        } as Entity;
    }

async getEntityViewById(id: number): Promise<EntityView | null> {
  const result = await db
    .select({
      // Entity fields
      id: entities.id,
      displayName: entities.displayName,
      entityTypeId: entities.entityTypeId,
      entityType: entities.entityType,
      version: entities.version,
      status: entities.status,
      createdDateTime: entities.createdDateTime,
      createdBy: entities.createdBy,
      modifiedDateTime: entities.modifiedDateTime,
      modifiedBy: entities.modifiedBy,
      localId: entities.localId,
      localIdSource: entities.localIdSource,
      hasEmployees: entities.hasEmployees,
      numberOfEmployees: entities.numberOfEmployees,
      countryAlpha3Code: entities.countryAlpha3Code,
      legalTypeId: entities.legalTypeId,
      legalSetupId: entities.legalSetupId,
      
      // Related data
      entityTypeName: entityTypes.name,
      entityTypeEmoji: entityTypes.emoji,
      countryName: countries.name,
      countryEmoji: countries.emoji,
      legalTypeName: legalTypes.name,
      legalSetupName: legalSetups.name,
    })
    .from(entities)
    .leftJoin(entityTypes, eq(entities.entityTypeId, entityTypes.id))
    .leftJoin(countries, eq(entities.countryAlpha3Code, countries.alpha3Code))
    .leftJoin(legalTypes, eq(entities.legalTypeId, legalTypes.id))
    .leftJoin(legalSetups, eq(entities.legalSetupId, legalSetups.id))
    .where(eq(entities.id, id));

  if (!result[0]) return null;

  const row = result[0];

  const entityView: EntityView = {
    id: row.id,
    displayName: row.displayName,
    entityTypeId: row.entityTypeId,
    entityType: row.entityType,
    version: row.version,
    status: row.status as Entity['status'],
    createdDateTime: row.createdDateTime.toISOString(),
    createdBy: row.createdBy,
    modifiedDateTime: row.modifiedDateTime.toISOString(),
    modifiedBy: row.modifiedBy,
    
    localId: row.localId || null,
    localIdSource: row.localIdSource || null,
    hasEmployees: typeof row.hasEmployees === 'number' ? Boolean(row.hasEmployees) : undefined,
    numberOfEmployees: row.numberOfEmployees || null,
    countryAlpha3Code: row.countryAlpha3Code || undefined,
    legalTypeId: row.legalTypeId || null,
    legalSetupId: row.legalSetupId || null,
    entityTypeName: row.entityTypeName || undefined,
    entityTypeEmoji: row.entityTypeEmoji || undefined,
    countryName: row.countryName || undefined,
    countryEmoji: row.countryEmoji || undefined,
    legalTypeName: row.legalTypeName || undefined,
    legalSetupName: row.legalSetupName || undefined,
    originalOfficialName: row.originalOfficialName || null,
  };

  return entityView;
}
  
}