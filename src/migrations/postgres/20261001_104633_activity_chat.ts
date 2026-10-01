import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conversations_messages_role" AS ENUM('visitor', 'assistant');
  CREATE TYPE "public"."enum_activity_kind" AS ENUM('like', 'highlight', 'chat');
  CREATE TYPE "public"."enum_activity_target" AS ENUM('note', 'image', 'video', 'chat');
  CREATE TYPE "public"."enum_activity_cover" AS ENUM('voice', 'grid', 'doc', 'stream', 'market', 'graph', 'ledger', 'fusion');
  CREATE TABLE "conversations_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_conversations_messages_role" NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"city" varchar,
  	"region" varchar,
  	"country" varchar,
  	"lat" numeric,
  	"lon" numeric,
  	"hidden" boolean,
  	"demo" boolean,
  	"visitor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "activity" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_activity_kind" NOT NULL,
  	"target" "enum_activity_target" NOT NULL,
  	"count" numeric DEFAULT 1,
  	"title" varchar,
  	"href" varchar,
  	"quote" varchar,
  	"thumb" varchar,
  	"cover" "enum_activity_cover",
  	"city" varchar,
  	"region" varchar,
  	"country" varchar,
  	"hidden" boolean,
  	"demo" boolean,
  	"visitor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chat_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "chat" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"greeting" varchar NOT NULL,
  	"placeholder" varchar,
  	"disclosure" varchar,
  	"offline_text" varchar,
  	"conversations_title" varchar,
  	"new_chat_label" varchar,
  	"chat_label" varchar,
  	"map_label" varchar,
  	"show_conversations" boolean DEFAULT true,
  	"instructions" varchar,
  	"facts" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "conversations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "activity_id" integer;
  ALTER TABLE "pages" ADD COLUMN "activity_title" varchar DEFAULT 'Activity' NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "activity_intro" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_someone_from" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_someone" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_times" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_this_week" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_earlier" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_liked_note" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_liked_image" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_liked_video" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_highlighted" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_started_chat" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_empty_text" varchar;
  ALTER TABLE "pages" ADD COLUMN "activity_sample_text" varchar;
  ALTER TABLE "conversations_messages" ADD CONSTRAINT "conversations_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chat_suggestions" ADD CONSTRAINT "chat_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "conversations_messages_order_idx" ON "conversations_messages" USING btree ("_order");
  CREATE INDEX "conversations_messages_parent_id_idx" ON "conversations_messages" USING btree ("_parent_id");
  CREATE INDEX "conversations_updated_at_idx" ON "conversations" USING btree ("updated_at");
  CREATE INDEX "conversations_created_at_idx" ON "conversations" USING btree ("created_at");
  CREATE INDEX "activity_updated_at_idx" ON "activity" USING btree ("updated_at");
  CREATE INDEX "activity_created_at_idx" ON "activity" USING btree ("created_at");
  CREATE INDEX "chat_suggestions_order_idx" ON "chat_suggestions" USING btree ("_order");
  CREATE INDEX "chat_suggestions_parent_id_idx" ON "chat_suggestions" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conversations_fk" FOREIGN KEY ("conversations_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_activity_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activity"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("conversations_id");
  CREATE INDEX "payload_locked_documents_rels_activity_id_idx" ON "payload_locked_documents_rels" USING btree ("activity_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "conversations_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "conversations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "activity" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chat_suggestions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chat" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "conversations_messages" CASCADE;
  DROP TABLE "conversations" CASCADE;
  DROP TABLE "activity" CASCADE;
  DROP TABLE "chat_suggestions" CASCADE;
  DROP TABLE "chat" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_conversations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_activity_fk";
  
  DROP INDEX "payload_locked_documents_rels_conversations_id_idx";
  DROP INDEX "payload_locked_documents_rels_activity_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "conversations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "activity_id";
  ALTER TABLE "pages" DROP COLUMN "activity_title";
  ALTER TABLE "pages" DROP COLUMN "activity_intro";
  ALTER TABLE "pages" DROP COLUMN "activity_someone_from";
  ALTER TABLE "pages" DROP COLUMN "activity_someone";
  ALTER TABLE "pages" DROP COLUMN "activity_times";
  ALTER TABLE "pages" DROP COLUMN "activity_this_week";
  ALTER TABLE "pages" DROP COLUMN "activity_earlier";
  ALTER TABLE "pages" DROP COLUMN "activity_liked_note";
  ALTER TABLE "pages" DROP COLUMN "activity_liked_image";
  ALTER TABLE "pages" DROP COLUMN "activity_liked_video";
  ALTER TABLE "pages" DROP COLUMN "activity_highlighted";
  ALTER TABLE "pages" DROP COLUMN "activity_started_chat";
  ALTER TABLE "pages" DROP COLUMN "activity_empty_text";
  ALTER TABLE "pages" DROP COLUMN "activity_sample_text";
  DROP TYPE "public"."enum_conversations_messages_role";
  DROP TYPE "public"."enum_activity_kind";
  DROP TYPE "public"."enum_activity_target";
  DROP TYPE "public"."enum_activity_cover";`)
}
