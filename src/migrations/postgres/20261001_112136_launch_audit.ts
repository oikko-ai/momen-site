import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_chat_ai_model" AS ENUM('claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-4-5');
  CREATE TYPE "public"."enum_chat_ai_effort" AS ENUM('low', 'medium', 'high');
  CREATE TABLE "chat_usage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"month" varchar NOT NULL,
  	"answers" numeric DEFAULT 0,
  	"cost" numeric DEFAULT 0,
  	"input_tokens" numeric DEFAULT 0,
  	"output_tokens" numeric DEFAULT 0,
  	"cache_read_tokens" numeric DEFAULT 0,
  	"cache_write_tokens" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"more" boolean
  );
  
  CREATE TABLE "site_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  ALTER TABLE "conversations" ADD COLUMN "usage_model" varchar;
  ALTER TABLE "conversations" ADD COLUMN "usage_input_tokens" numeric DEFAULT 0;
  ALTER TABLE "conversations" ADD COLUMN "usage_output_tokens" numeric DEFAULT 0;
  ALTER TABLE "conversations" ADD COLUMN "usage_cost" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "chat_usage_id" integer;
  ALTER TABLE "pages" ADD COLUMN "notes_signup_placeholder" varchar;
  ALTER TABLE "pages" ADD COLUMN "notes_signup_button" varchar;
  ALTER TABLE "pages" ADD COLUMN "about_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "about_research_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "about_recognition_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "about_playground_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "about_github_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_to_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_from_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_from_placeholder" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_subject_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_subject_placeholder" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_message_placeholder" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_hint" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_send_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_sending_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_sent_text" varchar;
  ALTER TABLE "pages" ADD COLUMN "contact_mail_text" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_more_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_menu_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_all_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_profile_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_view_profile_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_team_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_services_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_date_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_sample_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_placeholder_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_demo_persona_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_portrait_placeholder" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_highlights_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_highlights_hint" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_highlights_empty" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_you_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_others_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_not_found_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "labels_not_found_link" varchar;
  ALTER TABLE "chat" ADD COLUMN "ai_enabled" boolean DEFAULT true;
  ALTER TABLE "chat" ADD COLUMN "ai_model" "enum_chat_ai_model" DEFAULT 'claude-opus-5-5' NOT NULL;
  ALTER TABLE "chat" ADD COLUMN "ai_effort" "enum_chat_ai_effort" DEFAULT 'low' NOT NULL;
  ALTER TABLE "chat" ADD COLUMN "ai_max_tokens" numeric DEFAULT 1200 NOT NULL;
  ALTER TABLE "chat" ADD COLUMN "ai_monthly_budget" numeric DEFAULT 20;
  ALTER TABLE "chat" ADD COLUMN "ai_credit" numeric;
  ALTER TABLE "chat" ADD COLUMN "ai_daily_per_visitor" numeric DEFAULT 30 NOT NULL;
  ALTER TABLE "chat" ADD COLUMN "ai_limit_text" varchar;
  ALTER TABLE "site_menu" ADD CONSTRAINT "site_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_footer_links" ADD CONSTRAINT "site_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "chat_usage_month_idx" ON "chat_usage" USING btree ("month");
  CREATE INDEX "chat_usage_updated_at_idx" ON "chat_usage" USING btree ("updated_at");
  CREATE INDEX "chat_usage_created_at_idx" ON "chat_usage" USING btree ("created_at");
  CREATE INDEX "site_menu_order_idx" ON "site_menu" USING btree ("_order");
  CREATE INDEX "site_menu_parent_id_idx" ON "site_menu" USING btree ("_parent_id");
  CREATE INDEX "site_footer_links_order_idx" ON "site_footer_links" USING btree ("_order");
  CREATE INDEX "site_footer_links_parent_id_idx" ON "site_footer_links" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_usage_fk" FOREIGN KEY ("chat_usage_id") REFERENCES "public"."chat_usage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_chat_usage_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_usage_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "chat_usage" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_footer_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "chat_usage" CASCADE;
  DROP TABLE "site_menu" CASCADE;
  DROP TABLE "site_footer_links" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_chat_usage_fk";
  
  DROP INDEX "payload_locked_documents_rels_chat_usage_id_idx";
  ALTER TABLE "conversations" DROP COLUMN "usage_model";
  ALTER TABLE "conversations" DROP COLUMN "usage_input_tokens";
  ALTER TABLE "conversations" DROP COLUMN "usage_output_tokens";
  ALTER TABLE "conversations" DROP COLUMN "usage_cost";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "chat_usage_id";
  ALTER TABLE "pages" DROP COLUMN "notes_signup_placeholder";
  ALTER TABLE "pages" DROP COLUMN "notes_signup_button";
  ALTER TABLE "pages" DROP COLUMN "about_title";
  ALTER TABLE "pages" DROP COLUMN "about_research_title";
  ALTER TABLE "pages" DROP COLUMN "about_recognition_title";
  ALTER TABLE "pages" DROP COLUMN "about_playground_title";
  ALTER TABLE "pages" DROP COLUMN "about_github_label";
  ALTER TABLE "pages" DROP COLUMN "contact_to_label";
  ALTER TABLE "pages" DROP COLUMN "contact_from_label";
  ALTER TABLE "pages" DROP COLUMN "contact_from_placeholder";
  ALTER TABLE "pages" DROP COLUMN "contact_subject_label";
  ALTER TABLE "pages" DROP COLUMN "contact_subject_placeholder";
  ALTER TABLE "pages" DROP COLUMN "contact_message_placeholder";
  ALTER TABLE "pages" DROP COLUMN "contact_hint";
  ALTER TABLE "pages" DROP COLUMN "contact_send_label";
  ALTER TABLE "pages" DROP COLUMN "contact_sending_label";
  ALTER TABLE "pages" DROP COLUMN "contact_sent_text";
  ALTER TABLE "pages" DROP COLUMN "contact_mail_text";
  ALTER TABLE "pages" DROP COLUMN "labels_more_label";
  ALTER TABLE "pages" DROP COLUMN "labels_menu_label";
  ALTER TABLE "pages" DROP COLUMN "labels_all_label";
  ALTER TABLE "pages" DROP COLUMN "labels_profile_label";
  ALTER TABLE "pages" DROP COLUMN "labels_view_profile_label";
  ALTER TABLE "pages" DROP COLUMN "labels_team_label";
  ALTER TABLE "pages" DROP COLUMN "labels_services_label";
  ALTER TABLE "pages" DROP COLUMN "labels_date_label";
  ALTER TABLE "pages" DROP COLUMN "labels_sample_label";
  ALTER TABLE "pages" DROP COLUMN "labels_placeholder_label";
  ALTER TABLE "pages" DROP COLUMN "labels_demo_persona_label";
  ALTER TABLE "pages" DROP COLUMN "labels_portrait_placeholder";
  ALTER TABLE "pages" DROP COLUMN "labels_highlights_title";
  ALTER TABLE "pages" DROP COLUMN "labels_highlights_hint";
  ALTER TABLE "pages" DROP COLUMN "labels_highlights_empty";
  ALTER TABLE "pages" DROP COLUMN "labels_you_label";
  ALTER TABLE "pages" DROP COLUMN "labels_others_label";
  ALTER TABLE "pages" DROP COLUMN "labels_not_found_title";
  ALTER TABLE "pages" DROP COLUMN "labels_not_found_link";
  ALTER TABLE "chat" DROP COLUMN "ai_enabled";
  ALTER TABLE "chat" DROP COLUMN "ai_model";
  ALTER TABLE "chat" DROP COLUMN "ai_effort";
  ALTER TABLE "chat" DROP COLUMN "ai_max_tokens";
  ALTER TABLE "chat" DROP COLUMN "ai_monthly_budget";
  ALTER TABLE "chat" DROP COLUMN "ai_credit";
  ALTER TABLE "chat" DROP COLUMN "ai_daily_per_visitor";
  ALTER TABLE "chat" DROP COLUMN "ai_limit_text";
  DROP TYPE "public"."enum_chat_ai_model";
  DROP TYPE "public"."enum_chat_ai_effort";`)
}
