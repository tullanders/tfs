CREATE TYPE "public"."entity_status" AS ENUM('ACTIVE', 'ARCHIVED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."entity_type_enum" AS ENUM('LEGAL', 'BUSINESS', 'BOARD', 'REPORTING_UNIT');--> statement-breakpoint
CREATE TABLE "board_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "board_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"alpha_3_code" varchar(3) PRIMARY KEY NOT NULL,
	"alpha_2_code" varchar(2) NOT NULL,
	"name" varchar(255) NOT NULL,
	"emoji" varchar(2)
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"entity_type" "entity_type_enum" NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"status" "entity_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_date_time" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"modified_date_time" timestamp DEFAULT now() NOT NULL,
	"modified_by" varchar(255) NOT NULL,
	"local_id" varchar(255),
	"local_id_source" varchar(255),
	"has_employees" boolean,
	"number_of_employees" integer,
	"country_alpha3_code" varchar(3),
	"legal_type_id" integer,
	"legal_setup_id" integer,
	"original_official_name" varchar(255),
	"original_official_name_valid_from" timestamp,
	"current_official_name" varchar(255),
	"current_official_name_valid_from" timestamp,
	"upcoming_official_name" varchar(255),
	"upcoming_official_name_valid_from" timestamp,
	"local_official_registration_number" varchar(255),
	"board_type_id" integer,
	"constituted_date" timestamp,
	"dissolved_date" timestamp,
	"effective_from" timestamp,
	"effective_until" timestamp
);
--> statement-breakpoint
CREATE TABLE "entity_types" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"emoji" varchar(2),
	CONSTRAINT "entity_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "legal_setups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "legal_setups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "legal_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "legal_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "structure" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_entity_id" integer,
	"entity_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "structure" ADD CONSTRAINT "structure_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;