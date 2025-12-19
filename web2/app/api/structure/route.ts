import { NextRequest } from "next/server";
import { structureWithEntity } from "@/queries/structure.query";

export async function GET(_req: NextRequest) {  
    const structures = await structureWithEntity();

    if (!structures || structures.length === 0) {
      return Response.json({ error: "No entities found" }, { status: 404 });
    }

    return Response.json(structures);
}
