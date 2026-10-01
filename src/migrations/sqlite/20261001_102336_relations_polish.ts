import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`notes_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`projects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_rels_order_idx\` ON \`notes_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`notes_rels_parent_idx\` ON \`notes_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`notes_rels_path_idx\` ON \`notes_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`notes_rels_projects_id_idx\` ON \`notes_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE TABLE \`messages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`email\` text NOT NULL,
  	\`subject\` text,
  	\`message\` text NOT NULL,
  	\`read\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`messages_updated_at_idx\` ON \`messages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`messages_created_at_idx\` ON \`messages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text,
  	\`client_id\` integer,
  	\`project_id\` integer,
  	\`avatar_id\` integer,
  	\`demo\` integer,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_client_idx\` ON \`testimonials\` (\`client_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_project_idx\` ON \`testimonials\` (\`project_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_avatar_idx\` ON \`testimonials\` (\`avatar_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`pages_home_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`count\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_home_stats_order_idx\` ON \`pages_home_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_home_stats_parent_id_idx\` ON \`pages_home_stats\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`client_id\` integer REFERENCES clients(id);`)
  await db.run(sql`CREATE INDEX \`projects_client_idx\` ON \`projects\` (\`client_id\`);`)
  await db.run(sql`ALTER TABLE \`clients\` ADD \`logo_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`clients_logo_idx\` ON \`clients\` (\`logo_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`messages_id\` integer REFERENCES messages(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`testimonials_id\` integer REFERENCES testimonials(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_messages_id_idx\` ON \`payload_locked_documents_rels\` (\`messages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`available\` integer;`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`available_text\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`home_about_link\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`home_approach_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`home_work_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`home_see_all_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`home_clients_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`home_testimonials_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`work_client_label\` text DEFAULT 'Client';`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`work_related_notes_label\` text DEFAULT 'Writing about this';`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`notes_related_label\` text DEFAULT 'Related work';`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`clients_visit_label\` text DEFAULT 'Visit';`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`people_projects_label\` text DEFAULT 'Worked on';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`notes_rels\`;`)
  await db.run(sql`DROP TABLE \`messages\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`pages_home_stats\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`subtitle\` text NOT NULL,
  	\`code\` text,
  	\`year\` text,
  	\`team\` text,
  	\`featured\` integer,
  	\`device\` text DEFAULT 'phone',
  	\`image_id\` integer,
  	\`cover\` text DEFAULT 'graph',
  	\`intro\` text NOT NULL,
  	\`credit\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_projects\`("id", "title", "slug", "subtitle", "code", "year", "team", "featured", "device", "image_id", "cover", "intro", "credit", "order", "updated_at", "created_at") SELECT "id", "title", "slug", "subtitle", "code", "year", "team", "featured", "device", "image_id", "cover", "intro", "credit", "order", "updated_at", "created_at" FROM \`projects\`;`)
  await db.run(sql`DROP TABLE \`projects\`;`)
  await db.run(sql`ALTER TABLE \`__new_projects\` RENAME TO \`projects\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`projects_image_idx\` ON \`projects\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_clients\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`note\` text,
  	\`href\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_clients\`("id", "name", "note", "href", "order", "updated_at", "created_at") SELECT "id", "name", "note", "href", "order", "updated_at", "created_at" FROM \`clients\`;`)
  await db.run(sql`DROP TABLE \`clients\`;`)
  await db.run(sql`ALTER TABLE \`__new_clients\` RENAME TO \`clients\`;`)
  await db.run(sql`CREATE INDEX \`clients_updated_at_idx\` ON \`clients\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`clients_created_at_idx\` ON \`clients\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`projects_id\` integer,
  	\`notes_id\` integer,
  	\`subscribers_id\` integer,
  	\`photos_id\` integer,
  	\`clients_id\` integer,
  	\`people_id\` integer,
  	\`papers_id\` integer,
  	\`awards_id\` integer,
  	\`playground_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`notes_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`subscribers_id\`) REFERENCES \`subscribers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`photos_id\`) REFERENCES \`photos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clients_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`papers_id\`) REFERENCES \`papers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`awards_id\`) REFERENCES \`awards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`playground_id\`) REFERENCES \`playground\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "projects_id", "notes_id", "subscribers_id", "photos_id", "clients_id", "people_id", "papers_id", "awards_id", "playground_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "projects_id", "notes_id", "subscribers_id", "photos_id", "clients_id", "people_id", "papers_id", "awards_id", "playground_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_notes_id_idx\` ON \`payload_locked_documents_rels\` (\`notes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`subscribers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_photos_id_idx\` ON \`payload_locked_documents_rels\` (\`photos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_people_id_idx\` ON \`payload_locked_documents_rels\` (\`people_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_papers_id_idx\` ON \`payload_locked_documents_rels\` (\`papers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_awards_id_idx\` ON \`payload_locked_documents_rels\` (\`awards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_playground_id_idx\` ON \`payload_locked_documents_rels\` (\`playground_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`site\` DROP COLUMN \`available\`;`)
  await db.run(sql`ALTER TABLE \`site\` DROP COLUMN \`available_text\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`home_about_link\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`home_approach_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`home_work_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`home_see_all_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`home_clients_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`home_testimonials_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`work_client_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`work_related_notes_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`notes_related_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`clients_visit_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`people_projects_label\`;`)
}
