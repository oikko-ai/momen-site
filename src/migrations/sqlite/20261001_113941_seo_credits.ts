import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_knows_about\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`topic\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_knows_about_order_idx\` ON \`site_knows_about\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_knows_about_parent_id_idx\` ON \`site_knows_about\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_faq_order_idx\` ON \`about_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_faq_parent_id_idx\` ON \`about_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_credits_groups_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`role\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_credits_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_credits_groups_rows_order_idx\` ON \`pages_credits_groups_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_credits_groups_rows_parent_id_idx\` ON \`pages_credits_groups_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_credits_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_credits_groups_order_idx\` ON \`pages_credits_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_credits_groups_parent_id_idx\` ON \`pages_credits_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_credits_thanks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_credits_thanks_order_idx\` ON \`pages_credits_thanks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_credits_thanks_parent_id_idx\` ON \`pages_credits_thanks\` (\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content_version\` numeric,
  	\`home_about_link\` text,
  	\`home_approach_title\` text,
  	\`home_work_title\` text,
  	\`home_see_all_label\` text,
  	\`home_clients_title\` text,
  	\`home_testimonials_title\` text,
  	\`work_title\` text NOT NULL,
  	\`work_intro\` text,
  	\`work_next_label\` text DEFAULT 'Next project',
  	\`work_client_label\` text DEFAULT 'Client',
  	\`work_related_notes_label\` text DEFAULT 'Writing about this',
  	\`work_seo_title\` text,
  	\`work_seo_description\` text,
  	\`work_seo_image_id\` integer,
  	\`work_seo_noindex\` integer,
  	\`notes_title\` text NOT NULL,
  	\`notes_intro\` text,
  	\`notes_empty_text\` text,
  	\`notes_signup_title\` text,
  	\`notes_signup_text\` text,
  	\`notes_rss_label\` text DEFAULT 'Subscribe via RSS',
  	\`notes_signup_placeholder\` text,
  	\`notes_signup_button\` text,
  	\`notes_signed_up_text\` text DEFAULT 'Thanks, you''re on the list.',
  	\`notes_all_label\` text DEFAULT 'All notes',
  	\`notes_next_label\` text DEFAULT 'Next note',
  	\`notes_related_label\` text DEFAULT 'Related work',
  	\`notes_seo_title\` text,
  	\`notes_seo_description\` text,
  	\`notes_seo_image_id\` integer,
  	\`notes_seo_noindex\` integer,
  	\`photos_title\` text NOT NULL,
  	\`photos_intro\` text,
  	\`photos_seo_title\` text,
  	\`photos_seo_description\` text,
  	\`photos_seo_image_id\` integer,
  	\`photos_seo_noindex\` integer,
  	\`about_title\` text,
  	\`about_research_title\` text,
  	\`about_recognition_title\` text,
  	\`about_playground_title\` text,
  	\`about_github_label\` text,
  	\`contact_to_label\` text,
  	\`contact_from_label\` text,
  	\`contact_from_placeholder\` text,
  	\`contact_subject_label\` text,
  	\`contact_subject_placeholder\` text,
  	\`contact_message_placeholder\` text,
  	\`contact_hint\` text,
  	\`contact_send_label\` text,
  	\`contact_sending_label\` text,
  	\`contact_sent_text\` text,
  	\`contact_mail_text\` text,
  	\`labels_more_label\` text,
  	\`labels_menu_label\` text,
  	\`labels_all_label\` text,
  	\`labels_profile_label\` text,
  	\`labels_view_profile_label\` text,
  	\`labels_team_label\` text,
  	\`labels_services_label\` text,
  	\`labels_date_label\` text,
  	\`labels_sample_label\` text,
  	\`labels_placeholder_label\` text,
  	\`labels_demo_persona_label\` text,
  	\`labels_portrait_placeholder\` text,
  	\`labels_highlights_title\` text,
  	\`labels_highlights_hint\` text,
  	\`labels_highlights_empty\` text,
  	\`labels_you_label\` text,
  	\`labels_others_label\` text,
  	\`labels_not_found_title\` text,
  	\`labels_not_found_link\` text,
  	\`activity_title\` text NOT NULL,
  	\`activity_intro\` text,
  	\`activity_someone_from\` text,
  	\`activity_someone\` text,
  	\`activity_times\` text,
  	\`activity_this_week\` text,
  	\`activity_earlier\` text,
  	\`activity_liked_note\` text,
  	\`activity_liked_image\` text,
  	\`activity_liked_video\` text,
  	\`activity_highlighted\` text,
  	\`activity_started_chat\` text,
  	\`activity_empty_text\` text,
  	\`activity_sample_text\` text,
  	\`activity_seo_title\` text,
  	\`activity_seo_description\` text,
  	\`activity_seo_image_id\` integer,
  	\`activity_seo_noindex\` integer,
  	\`clients_title\` text NOT NULL,
  	\`clients_intro\` text,
  	\`clients_visit_label\` text DEFAULT 'Visit',
  	\`clients_seo_title\` text,
  	\`clients_seo_description\` text,
  	\`clients_seo_image_id\` integer,
  	\`clients_seo_noindex\` integer,
  	\`people_title\` text NOT NULL,
  	\`people_intro\` text,
  	\`people_projects_label\` text DEFAULT 'Worked on',
  	\`people_seo_title\` text,
  	\`people_seo_description\` text,
  	\`people_seo_image_id\` integer,
  	\`people_seo_noindex\` integer,
  	\`credits_title\` text DEFAULT 'Credits' NOT NULL,
  	\`credits_intro\` text,
  	\`credits_roll_label\` text,
  	\`credits_pause_label\` text,
  	\`credits_music_id\` integer,
  	\`credits_thanks_title\` text,
  	\`credits_dedication_title\` text,
  	\`credits_dedication\` text,
  	\`credits_seo_title\` text,
  	\`credits_seo_description\` text,
  	\`credits_seo_image_id\` integer,
  	\`credits_seo_noindex\` integer,
  	\`colophon_title\` text DEFAULT 'Colophon' NOT NULL,
  	\`colophon_intro\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`work_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`notes_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`photos_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`activity_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`clients_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`people_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`credits_music_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`credits_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages\`("id", "content_version", "home_about_link", "home_approach_title", "home_work_title", "home_see_all_label", "home_clients_title", "home_testimonials_title", "work_title", "work_intro", "work_next_label", "work_client_label", "work_related_notes_label", "notes_title", "notes_intro", "notes_empty_text", "notes_signup_title", "notes_signup_text", "notes_rss_label", "notes_signup_placeholder", "notes_signup_button", "notes_signed_up_text", "notes_all_label", "notes_next_label", "notes_related_label", "photos_title", "photos_intro", "about_title", "about_research_title", "about_recognition_title", "about_playground_title", "about_github_label", "contact_to_label", "contact_from_label", "contact_from_placeholder", "contact_subject_label", "contact_subject_placeholder", "contact_message_placeholder", "contact_hint", "contact_send_label", "contact_sending_label", "contact_sent_text", "contact_mail_text", "labels_more_label", "labels_menu_label", "labels_all_label", "labels_profile_label", "labels_view_profile_label", "labels_team_label", "labels_services_label", "labels_date_label", "labels_sample_label", "labels_placeholder_label", "labels_demo_persona_label", "labels_portrait_placeholder", "labels_highlights_title", "labels_highlights_hint", "labels_highlights_empty", "labels_you_label", "labels_others_label", "labels_not_found_title", "labels_not_found_link", "activity_title", "activity_intro", "activity_someone_from", "activity_someone", "activity_times", "activity_this_week", "activity_earlier", "activity_liked_note", "activity_liked_image", "activity_liked_video", "activity_highlighted", "activity_started_chat", "activity_empty_text", "activity_sample_text", "clients_title", "clients_intro", "clients_visit_label", "people_title", "people_intro", "people_projects_label", "colophon_title", "colophon_intro", "updated_at", "created_at") SELECT "id", "content_version", "home_about_link", "home_approach_title", "home_work_title", "home_see_all_label", "home_clients_title", "home_testimonials_title", "work_title", "work_intro", "work_next_label", "work_client_label", "work_related_notes_label", "notes_title", "notes_intro", "notes_empty_text", "notes_signup_title", "notes_signup_text", "notes_rss_label", "notes_signup_placeholder", "notes_signup_button", "notes_signed_up_text", "notes_all_label", "notes_next_label", "notes_related_label", "photos_title", "photos_intro", "about_title", "about_research_title", "about_recognition_title", "about_playground_title", "about_github_label", "contact_to_label", "contact_from_label", "contact_from_placeholder", "contact_subject_label", "contact_subject_placeholder", "contact_message_placeholder", "contact_hint", "contact_send_label", "contact_sending_label", "contact_sent_text", "contact_mail_text", "labels_more_label", "labels_menu_label", "labels_all_label", "labels_profile_label", "labels_view_profile_label", "labels_team_label", "labels_services_label", "labels_date_label", "labels_sample_label", "labels_placeholder_label", "labels_demo_persona_label", "labels_portrait_placeholder", "labels_highlights_title", "labels_highlights_hint", "labels_highlights_empty", "labels_you_label", "labels_others_label", "labels_not_found_title", "labels_not_found_link", "activity_title", "activity_intro", "activity_someone_from", "activity_someone", "activity_times", "activity_this_week", "activity_earlier", "activity_liked_note", "activity_liked_image", "activity_liked_video", "activity_highlighted", "activity_started_chat", "activity_empty_text", "activity_sample_text", "clients_title", "clients_intro", "clients_visit_label", "people_title", "people_intro", "people_projects_label", "colophon_title", "colophon_intro", "updated_at", "created_at" FROM \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`pages_work_seo_work_seo_image_idx\` ON \`pages\` (\`work_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_notes_seo_notes_seo_image_idx\` ON \`pages\` (\`notes_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_photos_seo_photos_seo_image_idx\` ON \`pages\` (\`photos_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_activity_seo_activity_seo_image_idx\` ON \`pages\` (\`activity_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_clients_seo_clients_seo_image_idx\` ON \`pages\` (\`clients_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_people_seo_people_seo_image_idx\` ON \`pages\` (\`people_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_credits_credits_music_idx\` ON \`pages\` (\`credits_music_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_credits_seo_credits_seo_image_idx\` ON \`pages\` (\`credits_seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`seo_noindex\` integer;`)
  await db.run(sql`CREATE INDEX \`projects_seo_seo_image_idx\` ON \`projects\` (\`seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`notes\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`notes\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`notes\` ADD \`seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`notes\` ADD \`seo_noindex\` integer;`)
  await db.run(sql`CREATE INDEX \`notes_seo_seo_image_idx\` ON \`notes\` (\`seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`seo_noindex\` integer;`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`job_title\` text;`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`org_name\` text;`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`org_url\` text;`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`org_description\` text;`)
  await db.run(sql`CREATE INDEX \`site_seo_seo_image_idx\` ON \`site\` (\`seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`about\` ADD \`faq_title\` text;`)
  await db.run(sql`ALTER TABLE \`about\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`about\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`about\` ADD \`seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`about\` ADD \`seo_noindex\` integer;`)
  await db.run(sql`CREATE INDEX \`about_seo_seo_image_idx\` ON \`about\` (\`seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`chat\` ADD \`seo_noindex\` integer;`)
  await db.run(sql`CREATE INDEX \`chat_seo_seo_image_idx\` ON \`chat\` (\`seo_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_knows_about\`;`)
  await db.run(sql`DROP TABLE \`about_faq\`;`)
  await db.run(sql`DROP TABLE \`pages_credits_groups_rows\`;`)
  await db.run(sql`DROP TABLE \`pages_credits_groups\`;`)
  await db.run(sql`DROP TABLE \`pages_credits_thanks\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`subtitle\` text NOT NULL,
  	\`code\` text,
  	\`year\` text,
  	\`team\` text,
  	\`client_id\` integer,
  	\`featured\` integer,
  	\`device\` text DEFAULT 'phone',
  	\`image_id\` integer,
  	\`cover\` text DEFAULT 'graph',
  	\`intro\` text NOT NULL,
  	\`credit\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_projects\`("id", "title", "slug", "subtitle", "code", "year", "team", "client_id", "featured", "device", "image_id", "cover", "intro", "credit", "order", "updated_at", "created_at") SELECT "id", "title", "slug", "subtitle", "code", "year", "team", "client_id", "featured", "device", "image_id", "cover", "intro", "credit", "order", "updated_at", "created_at" FROM \`projects\`;`)
  await db.run(sql`DROP TABLE \`projects\`;`)
  await db.run(sql`ALTER TABLE \`__new_projects\` RENAME TO \`projects\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`projects_client_idx\` ON \`projects\` (\`client_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_image_idx\` ON \`projects\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_notes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`date\` text NOT NULL,
  	\`summary\` text,
  	\`href\` text,
  	\`cover_id\` integer,
  	\`body\` text,
  	\`likes\` numeric DEFAULT 0,
  	\`views\` numeric DEFAULT 0,
  	\`year\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_notes\`("id", "title", "slug", "date", "summary", "href", "cover_id", "body", "likes", "views", "year", "updated_at", "created_at") SELECT "id", "title", "slug", "date", "summary", "href", "cover_id", "body", "likes", "views", "year", "updated_at", "created_at" FROM \`notes\`;`)
  await db.run(sql`DROP TABLE \`notes\`;`)
  await db.run(sql`ALTER TABLE \`__new_notes\` RENAME TO \`notes\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`notes_slug_idx\` ON \`notes\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`notes_cover_idx\` ON \`notes\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`notes_updated_at_idx\` ON \`notes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`notes_created_at_idx\` ON \`notes\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_site\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`city\` text,
  	\`portrait_id\` integer,
  	\`available\` integer,
  	\`available_text\` text,
  	\`tagline\` text NOT NULL,
  	\`intro\` text,
  	\`about_heading\` text,
  	\`contact_heading\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site\`("id", "name", "email", "city", "portrait_id", "available", "available_text", "tagline", "intro", "about_heading", "contact_heading", "updated_at", "created_at") SELECT "id", "name", "email", "city", "portrait_id", "available", "available_text", "tagline", "intro", "about_heading", "contact_heading", "updated_at", "created_at" FROM \`site\`;`)
  await db.run(sql`DROP TABLE \`site\`;`)
  await db.run(sql`ALTER TABLE \`__new_site\` RENAME TO \`site\`;`)
  await db.run(sql`CREATE INDEX \`site_portrait_idx\` ON \`site\` (\`portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_about\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_about\`("id", "heading", "updated_at", "created_at") SELECT "id", "heading", "updated_at", "created_at" FROM \`about\`;`)
  await db.run(sql`DROP TABLE \`about\`;`)
  await db.run(sql`ALTER TABLE \`__new_about\` RENAME TO \`about\`;`)
  await db.run(sql`CREATE TABLE \`__new_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content_version\` numeric,
  	\`home_about_link\` text,
  	\`home_approach_title\` text,
  	\`home_work_title\` text,
  	\`home_see_all_label\` text,
  	\`home_clients_title\` text,
  	\`home_testimonials_title\` text,
  	\`work_title\` text NOT NULL,
  	\`work_intro\` text,
  	\`work_next_label\` text DEFAULT 'Next project',
  	\`work_client_label\` text DEFAULT 'Client',
  	\`work_related_notes_label\` text DEFAULT 'Writing about this',
  	\`notes_title\` text NOT NULL,
  	\`notes_intro\` text,
  	\`notes_empty_text\` text,
  	\`notes_signup_title\` text,
  	\`notes_signup_text\` text,
  	\`notes_rss_label\` text DEFAULT 'Subscribe via RSS',
  	\`notes_signup_placeholder\` text,
  	\`notes_signup_button\` text,
  	\`notes_signed_up_text\` text DEFAULT 'Thanks, you''re on the list.',
  	\`notes_all_label\` text DEFAULT 'All notes',
  	\`notes_next_label\` text DEFAULT 'Next note',
  	\`notes_related_label\` text DEFAULT 'Related work',
  	\`photos_title\` text NOT NULL,
  	\`photos_intro\` text,
  	\`about_title\` text,
  	\`about_research_title\` text,
  	\`about_recognition_title\` text,
  	\`about_playground_title\` text,
  	\`about_github_label\` text,
  	\`contact_to_label\` text,
  	\`contact_from_label\` text,
  	\`contact_from_placeholder\` text,
  	\`contact_subject_label\` text,
  	\`contact_subject_placeholder\` text,
  	\`contact_message_placeholder\` text,
  	\`contact_hint\` text,
  	\`contact_send_label\` text,
  	\`contact_sending_label\` text,
  	\`contact_sent_text\` text,
  	\`contact_mail_text\` text,
  	\`labels_more_label\` text,
  	\`labels_menu_label\` text,
  	\`labels_all_label\` text,
  	\`labels_profile_label\` text,
  	\`labels_view_profile_label\` text,
  	\`labels_team_label\` text,
  	\`labels_services_label\` text,
  	\`labels_date_label\` text,
  	\`labels_sample_label\` text,
  	\`labels_placeholder_label\` text,
  	\`labels_demo_persona_label\` text,
  	\`labels_portrait_placeholder\` text,
  	\`labels_highlights_title\` text,
  	\`labels_highlights_hint\` text,
  	\`labels_highlights_empty\` text,
  	\`labels_you_label\` text,
  	\`labels_others_label\` text,
  	\`labels_not_found_title\` text,
  	\`labels_not_found_link\` text,
  	\`activity_title\` text NOT NULL,
  	\`activity_intro\` text,
  	\`activity_someone_from\` text,
  	\`activity_someone\` text,
  	\`activity_times\` text,
  	\`activity_this_week\` text,
  	\`activity_earlier\` text,
  	\`activity_liked_note\` text,
  	\`activity_liked_image\` text,
  	\`activity_liked_video\` text,
  	\`activity_highlighted\` text,
  	\`activity_started_chat\` text,
  	\`activity_empty_text\` text,
  	\`activity_sample_text\` text,
  	\`clients_title\` text NOT NULL,
  	\`clients_intro\` text,
  	\`clients_visit_label\` text DEFAULT 'Visit',
  	\`people_title\` text NOT NULL,
  	\`people_intro\` text,
  	\`people_projects_label\` text DEFAULT 'Worked on',
  	\`colophon_title\` text NOT NULL,
  	\`colophon_intro\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages\`("id", "content_version", "home_about_link", "home_approach_title", "home_work_title", "home_see_all_label", "home_clients_title", "home_testimonials_title", "work_title", "work_intro", "work_next_label", "work_client_label", "work_related_notes_label", "notes_title", "notes_intro", "notes_empty_text", "notes_signup_title", "notes_signup_text", "notes_rss_label", "notes_signup_placeholder", "notes_signup_button", "notes_signed_up_text", "notes_all_label", "notes_next_label", "notes_related_label", "photos_title", "photos_intro", "about_title", "about_research_title", "about_recognition_title", "about_playground_title", "about_github_label", "contact_to_label", "contact_from_label", "contact_from_placeholder", "contact_subject_label", "contact_subject_placeholder", "contact_message_placeholder", "contact_hint", "contact_send_label", "contact_sending_label", "contact_sent_text", "contact_mail_text", "labels_more_label", "labels_menu_label", "labels_all_label", "labels_profile_label", "labels_view_profile_label", "labels_team_label", "labels_services_label", "labels_date_label", "labels_sample_label", "labels_placeholder_label", "labels_demo_persona_label", "labels_portrait_placeholder", "labels_highlights_title", "labels_highlights_hint", "labels_highlights_empty", "labels_you_label", "labels_others_label", "labels_not_found_title", "labels_not_found_link", "activity_title", "activity_intro", "activity_someone_from", "activity_someone", "activity_times", "activity_this_week", "activity_earlier", "activity_liked_note", "activity_liked_image", "activity_liked_video", "activity_highlighted", "activity_started_chat", "activity_empty_text", "activity_sample_text", "clients_title", "clients_intro", "clients_visit_label", "people_title", "people_intro", "people_projects_label", "colophon_title", "colophon_intro", "updated_at", "created_at") SELECT "id", "content_version", "home_about_link", "home_approach_title", "home_work_title", "home_see_all_label", "home_clients_title", "home_testimonials_title", "work_title", "work_intro", "work_next_label", "work_client_label", "work_related_notes_label", "notes_title", "notes_intro", "notes_empty_text", "notes_signup_title", "notes_signup_text", "notes_rss_label", "notes_signup_placeholder", "notes_signup_button", "notes_signed_up_text", "notes_all_label", "notes_next_label", "notes_related_label", "photos_title", "photos_intro", "about_title", "about_research_title", "about_recognition_title", "about_playground_title", "about_github_label", "contact_to_label", "contact_from_label", "contact_from_placeholder", "contact_subject_label", "contact_subject_placeholder", "contact_message_placeholder", "contact_hint", "contact_send_label", "contact_sending_label", "contact_sent_text", "contact_mail_text", "labels_more_label", "labels_menu_label", "labels_all_label", "labels_profile_label", "labels_view_profile_label", "labels_team_label", "labels_services_label", "labels_date_label", "labels_sample_label", "labels_placeholder_label", "labels_demo_persona_label", "labels_portrait_placeholder", "labels_highlights_title", "labels_highlights_hint", "labels_highlights_empty", "labels_you_label", "labels_others_label", "labels_not_found_title", "labels_not_found_link", "activity_title", "activity_intro", "activity_someone_from", "activity_someone", "activity_times", "activity_this_week", "activity_earlier", "activity_liked_note", "activity_liked_image", "activity_liked_video", "activity_highlighted", "activity_started_chat", "activity_empty_text", "activity_sample_text", "clients_title", "clients_intro", "clients_visit_label", "people_title", "people_intro", "people_projects_label", "colophon_title", "colophon_intro", "updated_at", "created_at" FROM \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`)
  await db.run(sql`CREATE TABLE \`__new_chat\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`greeting\` text NOT NULL,
  	\`placeholder\` text,
  	\`disclosure\` text,
  	\`offline_text\` text,
  	\`conversations_title\` text,
  	\`new_chat_label\` text,
  	\`chat_label\` text,
  	\`map_label\` text,
  	\`show_conversations\` integer DEFAULT true,
  	\`ai_enabled\` integer DEFAULT true,
  	\`ai_model\` text DEFAULT 'claude-opus-5-5' NOT NULL,
  	\`ai_effort\` text DEFAULT 'low' NOT NULL,
  	\`ai_max_tokens\` numeric DEFAULT 1200 NOT NULL,
  	\`ai_monthly_budget\` numeric DEFAULT 20,
  	\`ai_credit\` numeric,
  	\`ai_daily_per_visitor\` numeric DEFAULT 30 NOT NULL,
  	\`ai_limit_text\` text,
  	\`instructions\` text,
  	\`facts\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_chat\`("id", "greeting", "placeholder", "disclosure", "offline_text", "conversations_title", "new_chat_label", "chat_label", "map_label", "show_conversations", "ai_enabled", "ai_model", "ai_effort", "ai_max_tokens", "ai_monthly_budget", "ai_credit", "ai_daily_per_visitor", "ai_limit_text", "instructions", "facts", "updated_at", "created_at") SELECT "id", "greeting", "placeholder", "disclosure", "offline_text", "conversations_title", "new_chat_label", "chat_label", "map_label", "show_conversations", "ai_enabled", "ai_model", "ai_effort", "ai_max_tokens", "ai_monthly_budget", "ai_credit", "ai_daily_per_visitor", "ai_limit_text", "instructions", "facts", "updated_at", "created_at" FROM \`chat\`;`)
  await db.run(sql`DROP TABLE \`chat\`;`)
  await db.run(sql`ALTER TABLE \`__new_chat\` RENAME TO \`chat\`;`)
}
