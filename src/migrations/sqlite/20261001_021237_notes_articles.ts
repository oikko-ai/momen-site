import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`notes_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`count\` numeric DEFAULT 1,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_highlights_order_idx\` ON \`notes_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`notes_highlights_parent_id_idx\` ON \`notes_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`subscribers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`subscribers_email_idx\` ON \`subscribers\` (\`email\`);`)
  await db.run(sql`CREATE INDEX \`subscribers_updated_at_idx\` ON \`subscribers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`subscribers_created_at_idx\` ON \`subscribers\` (\`created_at\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
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
  await db.run(sql`INSERT INTO \`__new_notes\`("id", "title", "slug", "date", "summary", "href", "cover_id", "body", "likes", "views", "year", "updated_at", "created_at") SELECT "id", "title", 'note-' || "id", CASE WHEN length("year") = 4 THEN "year" || '-01-01T00:00:00.000Z' ELSE "created_at" END, NULL, "href", NULL, NULL, 0, 0, "year", "updated_at", "created_at" FROM \`notes\`;`)
  await db.run(sql`DROP TABLE \`notes\`;`)
  await db.run(sql`ALTER TABLE \`__new_notes\` RENAME TO \`notes\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`notes_slug_idx\` ON \`notes\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`notes_cover_idx\` ON \`notes\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`notes_updated_at_idx\` ON \`notes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`notes_created_at_idx\` ON \`notes\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`subscribers_id\` integer REFERENCES subscribers(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`subscribers_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`notes_rss_label\` text DEFAULT 'Subscribe via RSS';`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`notes_signed_up_text\` text DEFAULT 'Thanks, you''re on the list.';`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`notes_all_label\` text DEFAULT 'All notes';`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`notes_next_label\` text DEFAULT 'Next note';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`notes_highlights\`;`)
  await db.run(sql`DROP TABLE \`subscribers\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_notes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`year\` text NOT NULL,
  	\`href\` text NOT NULL,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_notes\`("id", "title", "year", "href", "order", "updated_at", "created_at") SELECT "id", "title", "year", "href", "order", "updated_at", "created_at" FROM \`notes\`;`)
  await db.run(sql`DROP TABLE \`notes\`;`)
  await db.run(sql`ALTER TABLE \`__new_notes\` RENAME TO \`notes\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`notes_updated_at_idx\` ON \`notes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`notes_created_at_idx\` ON \`notes\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`projects_id\` integer,
  	\`notes_id\` integer,
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "projects_id", "notes_id", "photos_id", "clients_id", "people_id", "papers_id", "awards_id", "playground_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "projects_id", "notes_id", "photos_id", "clients_id", "people_id", "papers_id", "awards_id", "playground_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_notes_id_idx\` ON \`payload_locked_documents_rels\` (\`notes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_photos_id_idx\` ON \`payload_locked_documents_rels\` (\`photos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_people_id_idx\` ON \`payload_locked_documents_rels\` (\`people_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_papers_id_idx\` ON \`payload_locked_documents_rels\` (\`papers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_awards_id_idx\` ON \`payload_locked_documents_rels\` (\`awards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_playground_id_idx\` ON \`payload_locked_documents_rels\` (\`playground_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`notes_rss_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`notes_signed_up_text\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`notes_all_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`notes_next_label\`;`)
}
