CREATE TABLE "countries" (
	"alpha3_code" varchar(3) PRIMARY KEY NOT NULL,
	"alpha2_code" varchar(2) NOT NULL,
	"name" varchar(255) NOT NULL,
	"emoji" varchar(2)
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"entity_type" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"status" integer DEFAULT 1 NOT NULL,
	"valid_from" timestamp,
	"valid_to" timestamp,
	"country_alpha3_code" varchar(3),
	"created_date_time" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"modified_date_time" timestamp DEFAULT now() NOT NULL,
	"modified_by" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entity_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"emoji" varchar(2),
	"description" text,
	CONSTRAINT "entity_types_name_unique" UNIQUE("name")
);
