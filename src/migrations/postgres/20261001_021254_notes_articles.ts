import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "notes_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"count" numeric DEFAULT 1
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "notes" ALTER COLUMN "year" DROP NOT NULL;
  ALTER TABLE "notes" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "notes" ADD COLUMN "slug" varchar;
  ALTER TABLE "notes" ADD COLUMN "date" timestamp(3) with time zone;
  UPDATE "notes" SET "slug" = 'note-' || "id", "date" = CASE WHEN "year" ~ '^[0-9]{4}$' THEN to_timestamp("year" || '-01-01', 'YYYY-MM-DD') ELSE "created_at" END;
  ALTER TABLE "notes" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "notes" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "notes" ADD COLUMN "summary" varchar;
  ALTER TABLE "notes" ADD COLUMN "cover_id" integer;
  ALTER TABLE "notes" ADD COLUMN "body" jsonb;
  ALTER TABLE "notes" ADD COLUMN "likes" numeric DEFAULT 0;
  ALTER TABLE "notes" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subscribers_id" integer;
  ALTER TABLE "pages" ADD COLUMN "notes_rss_label" varchar DEFAULT 'Subscribe via RSS';
  ALTER TABLE "pages" ADD COLUMN "notes_signed_up_text" varchar DEFAULT 'Thanks, you''re on the list.';
  ALTER TABLE "pages" ADD COLUMN "notes_all_label" varchar DEFAULT 'All notes';
  ALTER TABLE "pages" ADD COLUMN "notes_next_label" varchar DEFAULT 'Next note';
  ALTER TABLE "notes_highlights" ADD CONSTRAINT "notes_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "notes_highlights_order_idx" ON "notes_highlights" USING btree ("_order");
  CREATE INDEX "notes_highlights_parent_id_idx" ON "notes_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  ALTER TABLE "notes" ADD CONSTRAINT "notes_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "notes_slug_idx" ON "notes" USING btree ("slug");
  CREATE INDEX "notes_cover_idx" ON "notes" USING btree ("cover_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  ALTER TABLE "notes" DROP COLUMN "order";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "notes_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "subscribers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "notes_highlights" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  ALTER TABLE "notes" DROP CONSTRAINT "notes_cover_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subscribers_fk";
  
  DROP INDEX "notes_slug_idx";
  DROP INDEX "notes_cover_idx";
  DROP INDEX "payload_locked_documents_rels_subscribers_id_idx";
  ALTER TABLE "notes" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "notes" ALTER COLUMN "year" SET NOT NULL;
  ALTER TABLE "notes" ADD COLUMN "order" numeric DEFAULT 0;
  ALTER TABLE "notes" DROP COLUMN "slug";
  ALTER TABLE "notes" DROP COLUMN "date";
  ALTER TABLE "notes" DROP COLUMN "summary";
  ALTER TABLE "notes" DROP COLUMN "cover_id";
  ALTER TABLE "notes" DROP COLUMN "body";
  ALTER TABLE "notes" DROP COLUMN "likes";
  ALTER TABLE "notes" DROP COLUMN "views";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subscribers_id";
  ALTER TABLE "pages" DROP COLUMN "notes_rss_label";
  ALTER TABLE "pages" DROP COLUMN "notes_signed_up_text";
  ALTER TABLE "pages" DROP COLUMN "notes_all_label";
  ALTER TABLE "pages" DROP COLUMN "notes_next_label";`)
}
