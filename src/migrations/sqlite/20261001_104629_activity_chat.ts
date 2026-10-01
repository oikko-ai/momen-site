import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`conversations_messages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`role\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`conversations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`conversations_messages_order_idx\` ON \`conversations_messages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`conversations_messages_parent_id_idx\` ON \`conversations_messages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`conversations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`city\` text,
  	\`region\` text,
  	\`country\` text,
  	\`lat\` numeric,
  	\`lon\` numeric,
  	\`hidden\` integer,
  	\`demo\` integer,
  	\`visitor\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`conversations_updated_at_idx\` ON \`conversations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`conversations_created_at_idx\` ON \`conversations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`activity\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text NOT NULL,
  	\`target\` text NOT NULL,
  	\`count\` numeric DEFAULT 1,
  	\`title\` text,
  	\`href\` text,
  	\`quote\` text,
  	\`thumb\` text,
  	\`cover\` text,
  	\`city\` text,
  	\`region\` text,
  	\`country\` text,
  	\`hidden\` integer,
  	\`demo\` integer,
  	\`visitor\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`activity_updated_at_idx\` ON \`activity\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`activity_created_at_idx\` ON \`activity\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`chat_suggestions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chat\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chat_suggestions_order_idx\` ON \`chat_suggestions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chat_suggestions_parent_id_idx\` ON \`chat_suggestions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chat\` (
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
  	\`instructions\` text,
  	\`facts\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`conversations_id\` integer REFERENCES conversations(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`activity_id\` integer REFERENCES activity(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_conversations_id_idx\` ON \`payload_locked_documents_rels\` (\`conversations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_activity_id_idx\` ON \`payload_locked_documents_rels\` (\`activity_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_title\` text DEFAULT 'Activity' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_intro\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_someone_from\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_someone\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_times\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_this_week\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_earlier\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_liked_note\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_liked_image\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_liked_video\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_highlighted\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_started_chat\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_empty_text\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`activity_sample_text\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`conversations_messages\`;`)
  await db.run(sql`DROP TABLE \`conversations\`;`)
  await db.run(sql`DROP TABLE \`activity\`;`)
  await db.run(sql`DROP TABLE \`chat_suggestions\`;`)
  await db.run(sql`DROP TABLE \`chat\`;`)
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "projects_id", "notes_id", "subscribers_id", "messages_id", "photos_id", "clients_id", "people_id", "testimonials_id", "papers_id", "awards_id", "playground_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "projects_id", "notes_id", "subscribers_id", "messages_id", "photos_id", "clients_id", "people_id", "testimonials_id", "papers_id", "awards_id", "playground_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_photos_id_idx\` ON \`payload_locked_documents_rels\` (\`photos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_people_id_idx\` ON \`payload_locked_documents_rels\` (\`people_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_papers_id_idx\` ON \`payload_locked_documents_rels\` (\`papers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_awards_id_idx\` ON \`payload_locked_documents_rels\` (\`awards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_playground_id_idx\` ON \`payload_locked_documents_rels\` (\`playground_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_intro\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_someone_from\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_someone\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_times\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_this_week\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_earlier\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_liked_note\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_liked_image\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_liked_video\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_highlighted\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_started_chat\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_empty_text\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`activity_sample_text\`;`)
}
