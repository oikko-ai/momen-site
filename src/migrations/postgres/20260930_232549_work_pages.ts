import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_sections_gallery_cover" AS ENUM('voice', 'grid', 'doc', 'stream', 'market', 'graph', 'ledger', 'fusion');
  CREATE TYPE "public"."enum_projects_sections_gallery_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum_projects_device" AS ENUM('phone', 'tablet', 'laptop', 'none');
  CREATE TABLE "projects_sections_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cover" "enum_projects_sections_gallery_cover" DEFAULT 'graph',
  	"caption" varchar,
  	"width" "enum_projects_sections_gallery_width" DEFAULT 'full'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer
  );
  
  CREATE TABLE "clients_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "people_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_colophon_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"work_title" varchar NOT NULL,
  	"work_intro" varchar,
  	"work_next_label" varchar DEFAULT 'Next project',
  	"notes_title" varchar NOT NULL,
  	"notes_intro" varchar,
  	"notes_empty_text" varchar,
  	"notes_signup_title" varchar,
  	"notes_signup_text" varchar,
  	"photos_title" varchar NOT NULL,
  	"photos_intro" varchar,
  	"clients_title" varchar NOT NULL,
  	"clients_intro" varchar,
  	"people_title" varchar NOT NULL,
  	"people_intro" varchar,
  	"colophon_title" varchar NOT NULL,
  	"colophon_intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "clients_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "people_tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "clients_tags" CASCADE;
  DROP TABLE "people_tags" CASCADE;
  ALTER TABLE "projects_sections" DROP CONSTRAINT "projects_sections_image_id_media_id_fk";
  
  DROP INDEX "projects_sections_image_idx";
  ALTER TABLE "projects" ADD COLUMN "device" "enum_projects_device" DEFAULT 'phone';
  ALTER TABLE "projects" ADD COLUMN "credit" varchar;
  ALTER TABLE "projects_sections_gallery" ADD CONSTRAINT "projects_sections_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_sections_gallery" ADD CONSTRAINT "projects_sections_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_texts" ADD CONSTRAINT "clients_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_texts" ADD CONSTRAINT "people_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_colophon_rows" ADD CONSTRAINT "pages_colophon_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_sections_gallery_order_idx" ON "projects_sections_gallery" USING btree ("_order");
  CREATE INDEX "projects_sections_gallery_parent_id_idx" ON "projects_sections_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_sections_gallery_image_idx" ON "projects_sections_gallery" USING btree ("image_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_people_id_idx" ON "projects_rels" USING btree ("people_id");
  CREATE INDEX "clients_texts_order_parent" ON "clients_texts" USING btree ("order","parent_id");
  CREATE INDEX "people_texts_order_parent" ON "people_texts" USING btree ("order","parent_id");
  CREATE INDEX "pages_colophon_rows_order_idx" ON "pages_colophon_rows" USING btree ("_order");
  CREATE INDEX "pages_colophon_rows_parent_id_idx" ON "pages_colophon_rows" USING btree ("_parent_id");
  ALTER TABLE "projects_sections" DROP COLUMN "image_id";
  ALTER TABLE "projects_sections" DROP COLUMN "cover";
  DROP TYPE "public"."enum_projects_sections_cover";
  DROP TYPE "public"."enum_clients_tags";
  DROP TYPE "public"."enum_people_tags";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_sections_cover" AS ENUM('voice', 'grid', 'doc', 'stream', 'market', 'graph', 'ledger', 'fusion');
  CREATE TYPE "public"."enum_clients_tags" AS ENUM('AI', 'Enterprise', 'Legal', 'Commerce', 'Marketplace');
  CREATE TYPE "public"."enum_people_tags" AS ENUM('Oikko AI', 'Engineering', 'Product');
  CREATE TABLE "clients_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_clients_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "people_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_people_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "projects_sections_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clients_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "people_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_colophon_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_sections_gallery" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "clients_texts" CASCADE;
  DROP TABLE "people_texts" CASCADE;
  DROP TABLE "pages_colophon_rows" CASCADE;
  DROP TABLE "pages" CASCADE;
  ALTER TABLE "projects_sections" ADD COLUMN "image_id" integer;
  ALTER TABLE "projects_sections" ADD COLUMN "cover" "enum_projects_sections_cover" DEFAULT 'graph';
  ALTER TABLE "clients_tags" ADD CONSTRAINT "clients_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_tags" ADD CONSTRAINT "people_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clients_tags_order_idx" ON "clients_tags" USING btree ("order");
  CREATE INDEX "clients_tags_parent_idx" ON "clients_tags" USING btree ("parent_id");
  CREATE INDEX "people_tags_order_idx" ON "people_tags" USING btree ("order");
  CREATE INDEX "people_tags_parent_idx" ON "people_tags" USING btree ("parent_id");
  ALTER TABLE "projects_sections" ADD CONSTRAINT "projects_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_sections_image_idx" ON "projects_sections" USING btree ("image_id");
  ALTER TABLE "projects" DROP COLUMN "device";
  ALTER TABLE "projects" DROP COLUMN "credit";
  DROP TYPE "public"."enum_projects_sections_gallery_cover";
  DROP TYPE "public"."enum_projects_sections_gallery_width";
  DROP TYPE "public"."enum_projects_device";`)
}
