import { pgTable, pgEnum, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const entityStatusEnum = pgEnum('entity_status', [
  'ACTIVE',
  'ARCHIVED',
  'DELETED',
]);

export const entityTypeEnum = pgEnum('entity_type_enum', [
  'LEGAL',
  'BUSINESS',
  'BOARD',
  'REPORTING_UNIT',
]);

// Placeholder schema - will be expanded
export const countries = pgTable('countries', {
  alpha3Code: varchar('alpha_3_code', { length: 3 }).primaryKey(),
  alpha2Code: varchar('alpha_2_code', { length: 2 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  emoji: varchar('emoji', { length: 2 }),
});

export const entityTypes = pgTable('entity_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  emoji: varchar('emoji', { length: 2 })
});

export const legalTypes = pgTable('legal_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique()
});

export const legalSetups = pgTable('legal_setups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique()
});

export const boardTypes = pgTable('board_types', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique()
});

export const entities = pgTable('entities', {
    // From EntityBase
    id: serial('id').primaryKey(),
    displayName: varchar('display_name', { length: 255 }).notNull(),
    entityTypeId: integer('entity_type_id').notNull(),
    entityType: varchar('entity_type', { length: 20 }).notNull(),
    version: integer('version').notNull().default(1),
    status: entityStatusEnum('status').notNull().default('ACTIVE'),
    createdDateTime: timestamp('created_date_time').notNull().defaultNow(),
    createdBy: varchar('created_by', { length: 255 }).notNull(),
    modifiedDateTime: timestamp('modified_date_time').notNull().defaultNow(),
    modifiedBy: varchar('modified_by', { length: 255 }).notNull(),
    localId: varchar('local_id', { length: 255 }),
    localIdSource: varchar('local_id_source', { length: 255 }),    

    // From LegalEntity
    hasEmployees: integer('has_employees'),
    numberOfEmployees: integer('number_of_employees'),
    countryAlpha3Code: varchar('country_alpha3_code', { length: 3 }),
    legalTypeId: integer('legal_type_id'),
    legalSetupId: integer('legal_setup_id'),
    originalOfficialName: varchar('original_official_name', { length: 255 }),
    originalOfficialNameValidFrom: timestamp('original_official_name_valid_from'),
    currentOfficialName: varchar('current_official_name', { length: 255 }),
    currentOfficialNameValidFrom: timestamp('current_official_name_valid_from'),
    upcomingOfficialName: varchar('upcoming_official_name', { length: 255 }),
    upcomingOfficialNameValidFrom: timestamp('upcoming_official_name_valid_from'),
    localOfficialRegistrationNumber: varchar('local_official_registration_number', { length: 255 }),
    
    // From BoardEntity
    boardTypeId: integer('board_type_id'),
    constitutedDate: timestamp('constituted_date'),
    dissolvedDate: timestamp('dissolved_date'),
    effectiveFrom: timestamp('effective_from'),
    effectiveUntil: timestamp('effective_until'),
});