import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`chat_usage\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`month\` text NOT NULL,
  	\`answers\` numeric DEFAULT 0,
  	\`cost\` numeric DEFAULT 0,
  	\`input_tokens\` numeric DEFAULT 0,
  	\`output_tokens\` numeric DEFAULT 0,
  	\`cache_read_tokens\` numeric DEFAULT 0,
  	\`cache_write_tokens\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`chat_usage_month_idx\` ON \`chat_usage\` (\`month\`);`)
  await db.run(sql`CREATE INDEX \`chat_usage_updated_at_idx\` ON \`chat_usage\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chat_usage_created_at_idx\` ON \`chat_usage\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_menu\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	\`more\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_menu_order_idx\` ON \`site_menu\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_menu_parent_id_idx\` ON \`site_menu\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_footer_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_footer_links_order_idx\` ON \`site_footer_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_footer_links_parent_id_idx\` ON \`site_footer_links\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`conversations\` ADD \`usage_model\` text;`)
  await db.run(sql`ALTER TABLE \`conversations\` ADD \`usage_input_tokens\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`conversations\` ADD \`usage_output_tokens\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`conversations\` ADD \`usage_cost\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`chat_usage_id\` integer REFERENCES chat_usage(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chat_usage_id_idx\` ON \`payload_locked_documents_rels\` (\`chat_usage_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`notes_signup_placeholder\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`notes_signup_button\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`about_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`about_research_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`about_recognition_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`about_playground_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`about_github_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_to_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_from_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_from_placeholder\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_subject_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_subject_placeholder\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_message_placeholder\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_hint\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_send_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_sending_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_sent_text\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`contact_mail_text\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_more_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_menu_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_all_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_profile_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_view_profile_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_team_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_services_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_date_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_sample_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_placeholder_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_demo_persona_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_portrait_placeholder\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_highlights_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_highlights_hint\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_highlights_empty\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_you_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_others_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_not_found_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`labels_not_found_link\` text;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`ai_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`ai_model\` text DEFAULT 'claude-opus-5-5' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`ai_effort\` text DEFAULT 'low' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`ai_max_tokens\` numeric DEFAULT 1200 NOT NULL;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`ai_monthly_budget\` numeric DEFAULT 20;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`ai_credit\` numeric;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`ai_daily_per_visitor\` numeric DEFAULT 30 NOT NULL;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`ai_limit_text\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`chat_usage\`;`)
  await db.run(sql`DROP TABLE \`site_menu\`;`)
  await db.run(sql`DROP TABLE \`site_footer_links\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`projects_id\` integer,
  	\`notes_id\` integer,
  	\`subscribers_id\` integer,
  	\`messages_id\` integer,
  	\`conversations_id\` integer,
  	\`activity_id\` integer,
  	\`photos_id\` integer,
  	\`clients_id\` integer,
  	\`people_id\` integer,
  	\`testimonials_id\` integer,
  	\`papers_id\` integer,
  	\`awards_id\` integer,
  	\`playground_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`notes_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`subscribers_id\`) REFERENCES \`subscribers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`messages_id\`) REFERENCES \`messages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`conversations_id\`) REFERENCES \`conversations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`activity_id\`) REFERENCES \`activity\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`photos_id\`) REFERENCES \`photos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clients_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`papers_id\`) REFERENCES \`papers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`awards_id\`) REFERENCES \`awards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`playground_id\`) REFERENCES \`playground\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "projects_id", "notes_id", "subscribers_id", "messages_id", "conversations_id", "activity_id", "photos_id", "clients_id", "people_id", "testimonials_id", "papers_id", "awards_id", "playground_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "projects_id", "notes_id", "subscribers_id", "messages_id", "conversations_id", "activity_id", "photos_id", "clients_id", "people_id", "testimonials_id", "papers_id", "awards_id", "playground_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_notes_id_idx\` ON \`payload_locked_documents_rels\` (\`notes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`subscribers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_messages_id_idx\` ON \`payload_locked_documents_rels\` (\`messages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_conversations_id_idx\` ON \`payload_locked_documents_rels\` (\`conversations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_activity_id_idx\` ON \`payload_locked_documents_rels\` (\`activity_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_photos_id_idx\` ON \`payload_locked_documents_rels\` (\`photos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_people_id_idx\` ON \`payload_locked_documents_rels\` (\`people_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_papers_id_idx\` ON \`payload_locked_documents_rels\` (\`papers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_awards_id_idx\` ON \`payload_locked_documents_rels\` (\`awards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_playground_id_idx\` ON \`payload_locked_documents_rels\` (\`playground_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`conversations\` DROP COLUMN \`usage_model\`;`)
  await db.run(sql`ALTER TABLE \`conversations\` DROP COLUMN \`usage_input_tokens\`;`)
  await db.run(sql`ALTER TABLE \`conversations\` DROP COLUMN \`usage_output_tokens\`;`)
  await db.run(sql`ALTER TABLE \`conversations\` DROP COLUMN \`usage_cost\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`notes_signup_placeholder\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`notes_signup_button\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`about_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`about_research_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`about_recognition_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`about_playground_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`about_github_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_to_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_from_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_from_placeholder\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_subject_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_subject_placeholder\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_message_placeholder\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_hint\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_send_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_sending_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_sent_text\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`contact_mail_text\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_more_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_menu_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_all_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_profile_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_view_profile_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_team_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_services_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_date_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_sample_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_placeholder_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_demo_persona_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_portrait_placeholder\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_highlights_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_highlights_hint\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_highlights_empty\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_you_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_others_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_not_found_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`labels_not_found_link\`;`)
  await db.run(sql`ALTER TABLE \`chat\` DROP COLUMN \`ai_enabled\`;`)
  await db.run(sql`ALTER TABLE \`chat\` DROP COLUMN \`ai_model\`;`)
  await db.run(sql`ALTER TABLE \`chat\` DROP COLUMN \`ai_effort\`;`)
  await db.run(sql`ALTER TABLE \`chat\` DROP COLUMN \`ai_max_tokens\`;`)
  await db.run(sql`ALTER TABLE \`chat\` DROP COLUMN \`ai_monthly_budget\`;`)
  await db.run(sql`ALTER TABLE \`chat\` DROP COLUMN \`ai_credit\`;`)
  await db.run(sql`ALTER TABLE \`chat\` DROP COLUMN \`ai_daily_per_visitor\`;`)
  await db.run(sql`ALTER TABLE \`chat\` DROP COLUMN \`ai_limit_text\`;`)
}
