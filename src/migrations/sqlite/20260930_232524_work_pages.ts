import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`projects_sections_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`cover\` text DEFAULT 'graph',
  	\`caption\` text,
  	\`width\` text DEFAULT 'full',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_sections_gallery_order_idx\` ON \`projects_sections_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_sections_gallery_parent_id_idx\` ON \`projects_sections_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_sections_gallery_image_idx\` ON \`projects_sections_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`people_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_rels_order_idx\` ON \`projects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_parent_idx\` ON \`projects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_path_idx\` ON \`projects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_people_id_idx\` ON \`projects_rels\` (\`people_id\`);`)
  await db.run(sql`CREATE TABLE \`clients_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`clients_texts_order_parent\` ON \`clients_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`people_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`people_texts_order_parent\` ON \`people_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_colophon_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_colophon_rows_order_idx\` ON \`pages_colophon_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_colophon_rows_parent_id_idx\` ON \`pages_colophon_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`work_title\` text NOT NULL,
  	\`work_intro\` text,
  	\`work_next_label\` text DEFAULT 'Next project',
  	\`notes_title\` text NOT NULL,
  	\`notes_intro\` text,
  	\`notes_empty_text\` text,
  	\`notes_signup_title\` text,
  	\`notes_signup_text\` text,
  	\`photos_title\` text NOT NULL,
  	\`photos_intro\` text,
  	\`clients_title\` text NOT NULL,
  	\`clients_intro\` text,
  	\`people_title\` text NOT NULL,
  	\`people_intro\` text,
  	\`colophon_title\` text NOT NULL,
  	\`colophon_intro\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`DROP TABLE \`clients_tags\`;`)
  await db.run(sql`DROP TABLE \`people_tags\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_projects_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text NOT NULL,
  	\`body\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_projects_sections\`("_order", "_parent_id", "id", "heading", "body") SELECT "_order", "_parent_id", "id", "heading", "body" FROM \`projects_sections\`;`)
  await db.run(sql`DROP TABLE \`projects_sections\`;`)
  await db.run(sql`ALTER TABLE \`__new_projects_sections\` RENAME TO \`projects_sections\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`projects_sections_order_idx\` ON \`projects_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_sections_parent_id_idx\` ON \`projects_sections\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`device\` text DEFAULT 'phone';`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`credit\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`clients_tags\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`clients_tags_order_idx\` ON \`clients_tags\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`clients_tags_parent_idx\` ON \`clients_tags\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`people_tags\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`people_tags_order_idx\` ON \`people_tags\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`people_tags_parent_idx\` ON \`people_tags\` (\`parent_id\`);`)
  await db.run(sql`DROP TABLE \`projects_sections_gallery\`;`)
  await db.run(sql`DROP TABLE \`projects_rels\`;`)
  await db.run(sql`DROP TABLE \`clients_texts\`;`)
  await db.run(sql`DROP TABLE \`people_texts\`;`)
  await db.run(sql`DROP TABLE \`pages_colophon_rows\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`ALTER TABLE \`projects_sections\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`projects_sections\` ADD \`cover\` text DEFAULT 'graph';`)
  await db.run(sql`CREATE INDEX \`projects_sections_image_idx\` ON \`projects_sections\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`device\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`credit\`;`)
}
