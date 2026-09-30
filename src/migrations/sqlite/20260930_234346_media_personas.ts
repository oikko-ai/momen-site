import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_projects_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`body\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_projects_sections\`("_order", "_parent_id", "id", "heading", "body") SELECT "_order", "_parent_id", "id", "heading", "body" FROM \`projects_sections\`;`)
  await db.run(sql`DROP TABLE \`projects_sections\`;`)
  await db.run(sql`ALTER TABLE \`__new_projects_sections\` RENAME TO \`projects_sections\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`projects_sections_order_idx\` ON \`projects_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_sections_parent_id_idx\` ON \`projects_sections\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` ADD \`source\` text DEFAULT 'upload';`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` ADD \`aspect\` text DEFAULT '16/10';`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` ADD \`url\` text;`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` ADD \`fit\` text DEFAULT 'cover';`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` ADD \`background\` text DEFAULT 'none';`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` ADD \`frame\` text DEFAULT 'none';`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` ADD \`likes\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`people\` ADD \`bio\` text;`)
  await db.run(sql`ALTER TABLE \`people\` ADD \`demo\` integer;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`content_version\` numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` DROP COLUMN \`source\`;`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` DROP COLUMN \`aspect\`;`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` DROP COLUMN \`url\`;`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` DROP COLUMN \`fit\`;`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` DROP COLUMN \`background\`;`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` DROP COLUMN \`frame\`;`)
  await db.run(sql`ALTER TABLE \`projects_sections_gallery\` DROP COLUMN \`likes\`;`)
  await db.run(sql`ALTER TABLE \`people\` DROP COLUMN \`bio\`;`)
  await db.run(sql`ALTER TABLE \`people\` DROP COLUMN \`demo\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`content_version\`;`)
}
