// schemas/entity.schema.ts
import { createInsertSchema } from "drizzle-zod";
import { entities } from "@/db/schema/entities";
import { z } from "zod";

const entityFields = {
  id: z.number(),
  entityType: z.enum(['LEGAL','BUSINESS','BOARD','REPORTING_UNIT']), // Discriminator handled in backend
  displayName: z.string(),
  version: z.number(),
  status: z.number(),
  createdDateTime: z.iso.datetime(),
  createdBy: z.iso.datetime(),
  modifiedDateTime: z.iso.datetime(),
  modifiedBy: z.iso.datetime(),
  localId: z.string().optional(),
  localIdSource: z.string().optional(),

  // legal entity specific fields
  hasEmployees: z.boolean().optional(),
  numberOfEmployees: z.number().optional(),
  countryAlpha3Code: z.string().min(3).max(3).optional(),
  legalTypeId: z.number().optional(),
  legalSetupId: z.number().optional(),
  originalOfficialName: z.string().optional(),
  originalOfficialNameValidFrom: z.coerce.date().optional(),
  currentOfficialName: z.string().optional(),
  currentOfficialNameValidFrom: z.coerce.date().optional(),
  upcomingOfficialName: z.string().optional(),
  upcomingOfficialNameValidFrom: z.coerce.date().optional(),
  localOfficialRegistrationNumber: z.string().optional(),

  // board specific fields
  boardTypeId: z.number().optional(),
  //constitutedDate: z.iso.datetime().optional(),
  constitutedDate: z.coerce.date().optional(),
  dissolvedDate: z.coerce.date().optional(),
  effectiveFrom: z.coerce.date().optional(),
  effectiveUntil: z.coerce.date().optional()  
}

// ===== CREATE SCHEMA (POST - ny entitet) =====
export const createEntitySchema = createInsertSchema(entities, entityFields).omit({
  id: true,
  version: true,
  status: true,
  createdDateTime: true,
  createdBy: true,
  modifiedDateTime: true,
  modifiedBy: true,
});
export type CreateEntityInput = z.infer<typeof createEntitySchema>;

// ===== UPDATE SCHEMA (PUT/PATCH - uppdatera entitet) =====
export const updateEntitySchema = createInsertSchema(entities, entityFields).omit({
  version: true,
  status: true,
  entityType: true,
  createdDateTime: true,
  createdBy: true,
  modifiedDateTime: true,
  modifiedBy: true,
});
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;