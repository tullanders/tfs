// app/api/entities/route.ts
import { NextRequest } from "next/server";
import { db } from "@/db";
import { entities } from "@/db/schema/entities";
import { createEntitySchema } from "@/db/schema/entity.schema";



// POST - Skapa ny entitet (ingen id krävs)
export async function POST(req: NextRequest) {
  const json = await req.json();
  console.log(JSON.stringify(json, null, 2));
  const input = createEntitySchema.parse(json);

  const [created] = await db.insert(entities).values({
    ...input,
    version: 1,
    status: "ACTIVE",
    createdDateTime: new Date(),
    createdBy: "user@tratonfs.com",
    modifiedDateTime: new Date(),
    modifiedBy: "user@tratonfs.com",
  }).returning();

  return Response.json({ ok: true, id: created.id });
}