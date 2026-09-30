import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_sections_gallery_source" AS ENUM('upload', 'url', 'placeholder');
  CREATE TYPE "public"."enum_projects_sections_gallery_aspect" AS ENUM('21/9', '2/1', '16/9', '16/10', '4/3', '1/1', '4/5', '3/4', '9/16');
  CREATE TYPE "public"."enum_projects_sections_gallery_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum_projects_sections_gallery_background" AS ENUM('none', 'dark', 'light');
  CREATE TYPE "public"."enum_projects_sections_gallery_frame" AS ENUM('none', 'browser', 'phone');
  ALTER TYPE "public"."enum_projects_sections_gallery_width" ADD VALUE 'twoThirds' BEFORE 'half';
  ALTER TYPE "public"."enum_projects_sections_gallery_width" ADD VALUE 'third';
  ALTER TYPE "public"."enum_projects_sections_gallery_width" ADD VALUE 'quarter';
  ALTER TABLE "projects_sections" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "projects_sections" ALTER COLUMN "body" DROP NOT NULL;
  ALTER TABLE "projects_sections_gallery" ADD COLUMN "source" "enum_projects_sections_gallery_source" DEFAULT 'upload';
  ALTER TABLE "projects_sections_gallery" ADD COLUMN "aspect" "enum_projects_sections_gallery_aspect" DEFAULT '16/10';
  ALTER TABLE "projects_sections_gallery" ADD COLUMN "url" varchar;
  ALTER TABLE "projects_sections_gallery" ADD COLUMN "fit" "enum_projects_sections_gallery_fit" DEFAULT 'cover';
  ALTER TABLE "projects_sections_gallery" ADD COLUMN "background" "enum_projects_sections_gallery_background" DEFAULT 'none';
  ALTER TABLE "projects_sections_gallery" ADD COLUMN "frame" "enum_projects_sections_gallery_frame" DEFAULT 'none';
  ALTER TABLE "projects_sections_gallery" ADD COLUMN "likes" numeric DEFAULT 0;
  ALTER TABLE "people" ADD COLUMN "bio" varchar;
  ALTER TABLE "people" ADD COLUMN "demo" boolean;
  ALTER TABLE "pages" ADD COLUMN "content_version" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_sections_gallery" ALTER COLUMN "width" SET DATA TYPE text;
  ALTER TABLE "projects_sections_gallery" ALTER COLUMN "width" SET DEFAULT 'full'::text;
  DROP TYPE "public"."enum_projects_sections_gallery_width";
  CREATE TYPE "public"."enum_projects_sections_gallery_width" AS ENUM('full', 'half');
  ALTER TABLE "projects_sections_gallery" ALTER COLUMN "width" SET DEFAULT 'full'::"public"."enum_projects_sections_gallery_width";
  ALTER TABLE "projects_sections_gallery" ALTER COLUMN "width" SET DATA TYPE "public"."enum_projects_sections_gallery_width" USING "width"::"public"."enum_projects_sections_gallery_width";
  ALTER TABLE "projects_sections" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "projects_sections" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "projects_sections_gallery" DROP COLUMN "source";
  ALTER TABLE "projects_sections_gallery" DROP COLUMN "aspect";
  ALTER TABLE "projects_sections_gallery" DROP COLUMN "url";
  ALTER TABLE "projects_sections_gallery" DROP COLUMN "fit";
  ALTER TABLE "projects_sections_gallery" DROP COLUMN "background";
  ALTER TABLE "projects_sections_gallery" DROP COLUMN "frame";
  ALTER TABLE "projects_sections_gallery" DROP COLUMN "likes";
  ALTER TABLE "people" DROP COLUMN "bio";
  ALTER TABLE "people" DROP COLUMN "demo";
  ALTER TABLE "pages" DROP COLUMN "content_version";
  DROP TYPE "public"."enum_projects_sections_gallery_source";
  DROP TYPE "public"."enum_projects_sections_gallery_aspect";
  DROP TYPE "public"."enum_projects_sections_gallery_fit";
  DROP TYPE "public"."enum_projects_sections_gallery_background";
  DROP TYPE "public"."enum_projects_sections_gallery_frame";`)
}
