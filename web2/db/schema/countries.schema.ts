// schemas/entity.schema.ts
import { createInsertSchema } from "drizzle-zod";
import { countries } from "@/db/schema/entities";
import { z } from "zod";


export type CountriesInput = z.infer<typeof countries>;
