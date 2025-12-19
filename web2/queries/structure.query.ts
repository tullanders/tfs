import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { entities, structure, entityTypes } from "@/db/schema/entities";

export const structureWithEntity = () => {
  return db
    .select({
      id: structure.id,
      parentEntityId: structure.parentEntityId,
      entityId: entities.id,
      displayName: entities.displayName,
      entityType: entities.entityType,
      entityTypeName: entityTypes.name,
      emoji: entityTypes.emoji,
    })
    .from(structure)
    .innerJoin(entities, eq(structure.entityId, entities.id))
    .leftJoin(entityTypes, sql`${entities.entityType}::text = ${entityTypes.id}`);
};

