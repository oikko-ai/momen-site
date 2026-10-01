import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_knows_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar NOT NULL
  );
  
  CREATE TABLE "about_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "pages_credits_groups_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "pages_credits_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "pages_credits_thanks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"href" varchar
  );
  
  ALTER TABLE "pages" ALTER COLUMN "colophon_title" SET DEFAULT 'Colophon';
  ALTER TABLE "projects" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "projects" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "projects" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "projects" ADD COLUMN "seo_noindex" boolean;
  ALTER TABLE "notes" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "notes" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "notes" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "notes" ADD COLUMN "seo_noindex" boolean;
  ALTER TABLE "site" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "site" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "site" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "site" ADD COLUMN "seo_noindex" boolean;
  ALTER TABLE "site" ADD COLUMN "job_title" varchar;
  ALTER TABLE "site" ADD COLUMN "org_name" varchar;
  ALTER TABLE "site" ADD COLUMN "org_url" varchar;
  ALTER TABLE "site" ADD COLUMN "org_description" varchar;
  ALTER TABLE "about" ADD COLUMN "faq_title" varchar;
  ALTER TABLE "about" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "about" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "about" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "about" ADD COLUMN "seo_noindex" boolean;
  ALTER TABLE "pages" ADD COLUMN "work_seo_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "work_seo_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "work_seo_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "work_seo_noindex" boolean;
  ALTER TABLE "pages" ADD COLUMN "notes_seo_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "notes_seo_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "notes_seo_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "notes_seo_noindex" boolean;
  ALTER TABLE "pages" ADD COLUMN "photos_seo_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "photos_seo_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "photos_seo_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "photos_seo_noindex" boolean;
  ALTER TABLE "pages" ADD COLUMN "activity_seo_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_seo_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_seo_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "activity_seo_noindex" boolean;
  ALTER TABLE "pages" ADD COLUMN "clients_seo_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "clients_seo_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "clients_seo_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "clients_seo_noindex" boolean;
  ALTER TABLE "pages" ADD COLUMN "people_seo_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "people_seo_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "people_seo_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "people_seo_noindex" boolean;
  ALTER TABLE "pages" ADD COLUMN "credits_title" varchar DEFAULT 'Credits' NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "credits_intro" varchar;
  ALTER TABLE "pages" ADD COLUMN "credits_roll_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "credits_pause_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "credits_music_id" integer;
  ALTER TABLE "pages" ADD COLUMN "credits_thanks_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "credits_dedication_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "credits_dedication" varchar;
  ALTER TABLE "pages" ADD COLUMN "credits_seo_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "credits_seo_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "credits_seo_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "credits_seo_noindex" boolean;
  ALTER TABLE "chat" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "chat" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "chat" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "chat" ADD COLUMN "seo_noindex" boolean;
  ALTER TABLE "site_knows_about" ADD CONSTRAINT "site_knows_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_faq" ADD CONSTRAINT "about_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_credits_groups_rows" ADD CONSTRAINT "pages_credits_groups_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_credits_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_credits_groups" ADD CONSTRAINT "pages_credits_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_credits_thanks" ADD CONSTRAINT "pages_credits_thanks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_knows_about_order_idx" ON "site_knows_about" USING btree ("_order");
  CREATE INDEX "site_knows_about_parent_id_idx" ON "site_knows_about" USING btree ("_parent_id");
  CREATE INDEX "about_faq_order_idx" ON "about_faq" USING btree ("_order");
  CREATE INDEX "about_faq_parent_id_idx" ON "about_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_credits_groups_rows_order_idx" ON "pages_credits_groups_rows" USING btree ("_order");
  CREATE INDEX "pages_credits_groups_rows_parent_id_idx" ON "pages_credits_groups_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_credits_groups_order_idx" ON "pages_credits_groups" USING btree ("_order");
  CREATE INDEX "pages_credits_groups_parent_id_idx" ON "pages_credits_groups" USING btree ("_parent_id");
  CREATE INDEX "pages_credits_thanks_order_idx" ON "pages_credits_thanks" USING btree ("_order");
  CREATE INDEX "pages_credits_thanks_parent_id_idx" ON "pages_credits_thanks" USING btree ("_parent_id");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notes" ADD CONSTRAINT "notes_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_work_seo_image_id_media_id_fk" FOREIGN KEY ("work_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_notes_seo_image_id_media_id_fk" FOREIGN KEY ("notes_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_photos_seo_image_id_media_id_fk" FOREIGN KEY ("photos_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_activity_seo_image_id_media_id_fk" FOREIGN KEY ("activity_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_clients_seo_image_id_media_id_fk" FOREIGN KEY ("clients_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_people_seo_image_id_media_id_fk" FOREIGN KEY ("people_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_credits_music_id_media_id_fk" FOREIGN KEY ("credits_music_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_credits_seo_image_id_media_id_fk" FOREIGN KEY ("credits_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chat" ADD CONSTRAINT "chat_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_seo_seo_image_idx" ON "projects" USING btree ("seo_image_id");
  CREATE INDEX "notes_seo_seo_image_idx" ON "notes" USING btree ("seo_image_id");
  CREATE INDEX "site_seo_seo_image_idx" ON "site" USING btree ("seo_image_id");
  CREATE INDEX "about_seo_seo_image_idx" ON "about" USING btree ("seo_image_id");
  CREATE INDEX "pages_work_seo_work_seo_image_idx" ON "pages" USING btree ("work_seo_image_id");
  CREATE INDEX "pages_notes_seo_notes_seo_image_idx" ON "pages" USING btree ("notes_seo_image_id");
  CREATE INDEX "pages_photos_seo_photos_seo_image_idx" ON "pages" USING btree ("photos_seo_image_id");
  CREATE INDEX "pages_activity_seo_activity_seo_image_idx" ON "pages" USING btree ("activity_seo_image_id");
  CREATE INDEX "pages_clients_seo_clients_seo_image_idx" ON "pages" USING btree ("clients_seo_image_id");
  CREATE INDEX "pages_people_seo_people_seo_image_idx" ON "pages" USING btree ("people_seo_image_id");
  CREATE INDEX "pages_credits_credits_music_idx" ON "pages" USING btree ("credits_music_id");
  CREATE INDEX "pages_credits_seo_credits_seo_image_idx" ON "pages" USING btree ("credits_seo_image_id");
  CREATE INDEX "chat_seo_seo_image_idx" ON "chat" USING btree ("seo_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_knows_about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_credits_groups_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_credits_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_credits_thanks" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_knows_about" CASCADE;
  DROP TABLE "about_faq" CASCADE;
  DROP TABLE "pages_credits_groups_rows" CASCADE;
  DROP TABLE "pages_credits_groups" CASCADE;
  DROP TABLE "pages_credits_thanks" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_seo_image_id_media_id_fk";
  
  ALTER TABLE "notes" DROP CONSTRAINT "notes_seo_image_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_seo_image_id_media_id_fk";
  
  ALTER TABLE "about" DROP CONSTRAINT "about_seo_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_work_seo_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_notes_seo_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_photos_seo_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_activity_seo_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_clients_seo_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_people_seo_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_credits_music_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_credits_seo_image_id_media_id_fk";
  
  ALTER TABLE "chat" DROP CONSTRAINT "chat_seo_image_id_media_id_fk";
  
  DROP INDEX "projects_seo_seo_image_idx";
  DROP INDEX "notes_seo_seo_image_idx";
  DROP INDEX "site_seo_seo_image_idx";
  DROP INDEX "about_seo_seo_image_idx";
  DROP INDEX "pages_work_seo_work_seo_image_idx";
  DROP INDEX "pages_notes_seo_notes_seo_image_idx";
  DROP INDEX "pages_photos_seo_photos_seo_image_idx";
  DROP INDEX "pages_activity_seo_activity_seo_image_idx";
  DROP INDEX "pages_clients_seo_clients_seo_image_idx";
  DROP INDEX "pages_people_seo_people_seo_image_idx";
  DROP INDEX "pages_credits_credits_music_idx";
  DROP INDEX "pages_credits_seo_credits_seo_image_idx";
  DROP INDEX "chat_seo_seo_image_idx";
  ALTER TABLE "pages" ALTER COLUMN "colophon_title" DROP DEFAULT;
  ALTER TABLE "projects" DROP COLUMN "seo_title";
  ALTER TABLE "projects" DROP COLUMN "seo_description";
  ALTER TABLE "projects" DROP COLUMN "seo_image_id";
  ALTER TABLE "projects" DROP COLUMN "seo_noindex";
  ALTER TABLE "notes" DROP COLUMN "seo_title";
  ALTER TABLE "notes" DROP COLUMN "seo_description";
  ALTER TABLE "notes" DROP COLUMN "seo_image_id";
  ALTER TABLE "notes" DROP COLUMN "seo_noindex";
  ALTER TABLE "site" DROP COLUMN "seo_title";
  ALTER TABLE "site" DROP COLUMN "seo_description";
  ALTER TABLE "site" DROP COLUMN "seo_image_id";
  ALTER TABLE "site" DROP COLUMN "seo_noindex";
  ALTER TABLE "site" DROP COLUMN "job_title";
  ALTER TABLE "site" DROP COLUMN "org_name";
  ALTER TABLE "site" DROP COLUMN "org_url";
  ALTER TABLE "site" DROP COLUMN "org_description";
  ALTER TABLE "about" DROP COLUMN "faq_title";
  ALTER TABLE "about" DROP COLUMN "seo_title";
  ALTER TABLE "about" DROP COLUMN "seo_description";
  ALTER TABLE "about" DROP COLUMN "seo_image_id";
  ALTER TABLE "about" DROP COLUMN "seo_noindex";
  ALTER TABLE "pages" DROP COLUMN "work_seo_title";
  ALTER TABLE "pages" DROP COLUMN "work_seo_description";
  ALTER TABLE "pages" DROP COLUMN "work_seo_image_id";
  ALTER TABLE "pages" DROP COLUMN "work_seo_noindex";
  ALTER TABLE "pages" DROP COLUMN "notes_seo_title";
  ALTER TABLE "pages" DROP COLUMN "notes_seo_description";
  ALTER TABLE "pages" DROP COLUMN "notes_seo_image_id";
  ALTER TABLE "pages" DROP COLUMN "notes_seo_noindex";
  ALTER TABLE "pages" DROP COLUMN "photos_seo_title";
  ALTER TABLE "pages" DROP COLUMN "photos_seo_description";
  ALTER TABLE "pages" DROP COLUMN "photos_seo_image_id";
  ALTER TABLE "pages" DROP COLUMN "photos_seo_noindex";
  ALTER TABLE "pages" DROP COLUMN "activity_seo_title";
  ALTER TABLE "pages" DROP COLUMN "activity_seo_description";
  ALTER TABLE "pages" DROP COLUMN "activity_seo_image_id";
  ALTER TABLE "pages" DROP COLUMN "activity_seo_noindex";
  ALTER TABLE "pages" DROP COLUMN "clients_seo_title";
  ALTER TABLE "pages" DROP COLUMN "clients_seo_description";
  ALTER TABLE "pages" DROP COLUMN "clients_seo_image_id";
  ALTER TABLE "pages" DROP COLUMN "clients_seo_noindex";
  ALTER TABLE "pages" DROP COLUMN "people_seo_title";
  ALTER TABLE "pages" DROP COLUMN "people_seo_description";
  ALTER TABLE "pages" DROP COLUMN "people_seo_image_id";
  ALTER TABLE "pages" DROP COLUMN "people_seo_noindex";
  ALTER TABLE "pages" DROP COLUMN "credits_title";
  ALTER TABLE "pages" DROP COLUMN "credits_intro";
  ALTER TABLE "pages" DROP COLUMN "credits_roll_label";
  ALTER TABLE "pages" DROP COLUMN "credits_pause_label";
  ALTER TABLE "pages" DROP COLUMN "credits_music_id";
  ALTER TABLE "pages" DROP COLUMN "credits_thanks_title";
  ALTER TABLE "pages" DROP COLUMN "credits_dedication_title";
  ALTER TABLE "pages" DROP COLUMN "credits_dedication";
  ALTER TABLE "pages" DROP COLUMN "credits_seo_title";
  ALTER TABLE "pages" DROP COLUMN "credits_seo_description";
  ALTER TABLE "pages" DROP COLUMN "credits_seo_image_id";
  ALTER TABLE "pages" DROP COLUMN "credits_seo_noindex";
  ALTER TABLE "chat" DROP COLUMN "seo_title";
  ALTER TABLE "chat" DROP COLUMN "seo_description";
  ALTER TABLE "chat" DROP COLUMN "seo_image_id";
  ALTER TABLE "chat" DROP COLUMN "seo_noindex";`)
}
