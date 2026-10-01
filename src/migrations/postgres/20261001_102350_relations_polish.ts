import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_home_stats_count" AS ENUM('projects', 'clients', 'people', 'notes', 'papers', 'awards');
  CREATE TABLE "notes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar NOT NULL,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"read" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"client_id" integer,
  	"project_id" integer,
  	"avatar_id" integer,
  	"demo" boolean,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_home_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"count" "enum_pages_home_stats_count" NOT NULL,
  	"label" varchar NOT NULL
  );
  
  ALTER TABLE "projects" ADD COLUMN "client_id" integer;
  ALTER TABLE "clients" ADD COLUMN "logo_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "messages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "site" ADD COLUMN "available" boolean;
  ALTER TABLE "site" ADD COLUMN "available_text" varchar;
  ALTER TABLE "pages" ADD COLUMN "home_about_link" varchar;
  ALTER TABLE "pages" ADD COLUMN "home_approach_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "home_work_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "home_see_all_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "home_clients_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "home_testimonials_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "work_client_label" varchar DEFAULT 'Client';
  ALTER TABLE "pages" ADD COLUMN "work_related_notes_label" varchar DEFAULT 'Writing about this';
  ALTER TABLE "pages" ADD COLUMN "notes_related_label" varchar DEFAULT 'Related work';
  ALTER TABLE "pages" ADD COLUMN "clients_visit_label" varchar DEFAULT 'Visit';
  ALTER TABLE "pages" ADD COLUMN "people_projects_label" varchar DEFAULT 'Worked on';
  ALTER TABLE "notes_rels" ADD CONSTRAINT "notes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "notes_rels" ADD CONSTRAINT "notes_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_home_stats" ADD CONSTRAINT "pages_home_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "notes_rels_order_idx" ON "notes_rels" USING btree ("order");
  CREATE INDEX "notes_rels_parent_idx" ON "notes_rels" USING btree ("parent_id");
  CREATE INDEX "notes_rels_path_idx" ON "notes_rels" USING btree ("path");
  CREATE INDEX "notes_rels_projects_id_idx" ON "notes_rels" USING btree ("projects_id");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE INDEX "testimonials_client_idx" ON "testimonials" USING btree ("client_id");
  CREATE INDEX "testimonials_project_idx" ON "testimonials" USING btree ("project_id");
  CREATE INDEX "testimonials_avatar_idx" ON "testimonials" USING btree ("avatar_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "pages_home_stats_order_idx" ON "pages_home_stats" USING btree ("_order");
  CREATE INDEX "pages_home_stats_parent_id_idx" ON "pages_home_stats" USING btree ("_parent_id");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_client_idx" ON "projects" USING btree ("client_id");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "notes_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_home_stats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "notes_rels" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "pages_home_stats" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_client_id_clients_id_fk";
  
  ALTER TABLE "clients" DROP CONSTRAINT "clients_logo_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_messages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  DROP INDEX "projects_client_idx";
  DROP INDEX "clients_logo_idx";
  DROP INDEX "payload_locked_documents_rels_messages_id_idx";
  DROP INDEX "payload_locked_documents_rels_testimonials_id_idx";
  ALTER TABLE "projects" DROP COLUMN "client_id";
  ALTER TABLE "clients" DROP COLUMN "logo_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "messages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "site" DROP COLUMN "available";
  ALTER TABLE "site" DROP COLUMN "available_text";
  ALTER TABLE "pages" DROP COLUMN "home_about_link";
  ALTER TABLE "pages" DROP COLUMN "home_approach_title";
  ALTER TABLE "pages" DROP COLUMN "home_work_title";
  ALTER TABLE "pages" DROP COLUMN "home_see_all_label";
  ALTER TABLE "pages" DROP COLUMN "home_clients_title";
  ALTER TABLE "pages" DROP COLUMN "home_testimonials_title";
  ALTER TABLE "pages" DROP COLUMN "work_client_label";
  ALTER TABLE "pages" DROP COLUMN "work_related_notes_label";
  ALTER TABLE "pages" DROP COLUMN "notes_related_label";
  ALTER TABLE "pages" DROP COLUMN "clients_visit_label";
  ALTER TABLE "pages" DROP COLUMN "people_projects_label";
  DROP TYPE "public"."enum_pages_home_stats_count";`)
}
