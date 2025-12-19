import { NextRequest } from "next/server";
import { db } from "@/db";
import { entities } from "@/db/schema/entities";
import { updateEntitySchema } from "@/db/schema/entity.schema";
import {getEntityViewById} from "@/queries/entityview.query";

import { eq, desc } from "drizzle-orm";

// PUT - Uppdatera entitet (id krävs)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const json = await req.json();
  const input = updateEntitySchema.parse(json);
  const entityId = parseInt(id);

  // Hämta senaste version
  const [latest] = await db
    .select({ 
      id: entities.id, 
      version: entities.version, 
      createdDateTime: entities.createdDateTime, 
      createdBy: entities.createdBy ,
      entityType: entities.entityType
    })
    .from(entities)
    .where(eq(entities.id, entityId))
    .orderBy(desc(entities.version))
    .limit(1);

  if (!latest) {
    return Response.json({ error: "Entity not found" }, { status: 404 });
  }

  // Arkivera tidigare version
  await db
    .update(entities)
    .set({
      status: "ARCHIVED",
      modifiedDateTime: new Date(),
      modifiedBy: "user@tratonfs.com",
    })
    .where(eq(entities.id, latest.id));

  // Skapa ny version
  await db.insert(entities).values({
    ...input,
    id: entityId,
    version: latest.version + 1,
    status: "ACTIVE",
    entityType: latest.entityType,
    createdDateTime: latest.createdDateTime,
    createdBy: latest.createdBy,
    modifiedDateTime: new Date(),
    modifiedBy: "user@tratonfs.com",
  });

  return Response.json({ ok: true });
}

// GET - Hämta entitet
/*
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entityId = parseInt(id);

  const [entity] = await db
    .select()
    .from(entities)
    .where(eq(entities.id, entityId))
    .orderBy(desc(entities.version))
    .limit(1);

  if (!entity) {
    return Response.json({ error: "Entity not found" }, { status: 404 });
  }

  return Response.json(entity);
}*/
export async function GET(
  _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {  
    const { id } = await params;
    const entityId = parseInt(id);

    const [entityView] = await getEntityViewById(entityId);

    if (!entityView) {
      return Response.json({ error: "Entity not found" }, { status: 404 });
    }

    return Response.json(entityView);
}