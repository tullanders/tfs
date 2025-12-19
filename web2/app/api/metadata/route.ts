import { NextRequest } from "next/server";
import { countries as countriesTable, legalSetups as legalSetupsTable, 
    legalTypes as legalTypesTable, boardTypes as boardTypesTable } from "@/db/schema/entities";
import { db } from "@/db";

export async function GET(_req: NextRequest)    {
  
    const countries = await db.select().from(countriesTable).orderBy(countriesTable.name);
    const legalSetups = await db.select().from(legalSetupsTable).orderBy(legalSetupsTable.name);
    const legalTypes = await db.select().from(legalTypesTable).orderBy(legalTypesTable.name);
    const boardTypes = await db.select().from(boardTypesTable).orderBy(boardTypesTable.name);

    return Response.json({
        countries,
        legalSetups,
        legalTypes,
        boardTypes
    });
  
}